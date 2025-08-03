from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import Customer, Loan
from .serializers import (
    CustomerSerializer, LoanSerializer, LoanDetailSerializer,
    EligibilityCheckSerializer, EligibilityResponseSerializer,
    LoanCreationSerializer
)
import pandas as pd
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import io


def calculate_credit_score(customer):
    """
    Calculate credit score based on EMI payment history
    Logic:
    - 90-100% EMIs paid on time: score = 10
    - 80-89%: score = 9
    - 70-79%: score = 8
    - 60-69%: score = 7
    - 50-59%: score = 6
    - 40-49%: score = 5
    - 30-39%: score = 4
    - 20-29%: score = 3
    - 10-19%: score = 2
    - 0-9%: score = 1
    """
    loans = Loan.objects.filter(customer=customer)
    
    if not loans.exists():
        return 10  # New customer gets highest score initially
    
    total_emis = sum(loan.tenure for loan in loans)
    total_paid_on_time = sum(loan.emis_paid_on_time for loan in loans)
    
    if total_emis == 0:
        return 10
    
    payment_percentage = (total_paid_on_time / total_emis) * 100
    
    if payment_percentage >= 90:
        return 10
    elif payment_percentage >= 80:
        return 9
    elif payment_percentage >= 70:
        return 8
    elif payment_percentage >= 60:
        return 7
    elif payment_percentage >= 50:
        return 6
    elif payment_percentage >= 40:
        return 5
    elif payment_percentage >= 30:
        return 4
    elif payment_percentage >= 20:
        return 3
    elif payment_percentage >= 10:
        return 2
    else:
        return 1


def calculate_emi(principal, rate, tenure):
    """Calculate EMI using the standard formula"""
    monthly_rate = rate / (12 * 100)
    if monthly_rate > 0:
        emi = (principal * monthly_rate * ((1 + monthly_rate) ** tenure)) / \
              (((1 + monthly_rate) ** tenure) - 1)
    else:
        emi = principal / tenure
    return round(emi, 2)


@api_view(['POST'])
def register_customer(request):
    """
    POST /api/register
    Register a new customer with automatic approved_limit calculation
    """
    serializer = CustomerSerializer(data=request.data)
    if serializer.is_valid():
        customer = serializer.save()
        return Response({
            'message': 'Customer registered successfully',
            'customer_id': customer.customer_id,
            'approved_limit': customer.approved_limit,
            'customer': CustomerSerializer(customer).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def check_eligibility(request):
    """
    POST /api/check-eligibility
    Check loan eligibility for a customer
    """
    serializer = EligibilityCheckSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    validated_data = serializer.validated_data
    customer_id = validated_data['customer_id']
    loan_amount = validated_data['loan_amount']
    interest_rate = validated_data['interest_rate']
    tenure = validated_data['tenure']
    
    customer = get_object_or_404(Customer, customer_id=customer_id)
    credit_score = calculate_credit_score(customer)
    
    # Calculate available credit limit
    active_loans = Loan.objects.filter(customer=customer)
    current_utilization = sum(loan.loan_amount for loan in active_loans)
    available_limit = customer.approved_limit - current_utilization
    
    # Determine approval logic based on credit score
    if credit_score >= 7:
        approved_amount = min(loan_amount, available_limit)
        approval_status = 'approved' if approved_amount >= loan_amount else 'partial'
        suggested_rate = interest_rate
    elif credit_score >= 5:
        approved_amount = min(loan_amount * 0.8, available_limit)  # 80% of requested amount
        approval_status = 'partial' if approved_amount > 0 else 'rejected'
        suggested_rate = interest_rate + 2  # Add 2% to interest rate
    elif credit_score >= 3:
        approved_amount = min(loan_amount * 0.6, available_limit)  # 60% of requested amount
        approval_status = 'partial' if approved_amount > 0 else 'rejected'
        suggested_rate = interest_rate + 4  # Add 4% to interest rate
    else:
        approved_amount = 0
        approval_status = 'rejected'
        suggested_rate = interest_rate + 6  # Add 6% to interest rate
    
    # Ensure suggested rate doesn't exceed 50%
    suggested_rate = min(suggested_rate, 50.0)
    
    # Calculate EMI for approved amount
    monthly_emi = calculate_emi(approved_amount, suggested_rate, tenure) if approved_amount > 0 else 0
    
    response_data = {
        'credit_score': credit_score,
        'approved_amount': int(approved_amount),
        'approval_status': approval_status,
        'suggested_interest_rate': round(suggested_rate, 2),
        'monthly_emi': monthly_emi
    }
    
    return Response(response_data, status=status.HTTP_200_OK)


@api_view(['POST'])
def create_loan(request):
    """
    POST /api/create-loan
    Create a new loan after eligibility check
    """
    serializer = LoanCreationSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    loan = serializer.save()
    response_serializer = LoanDetailSerializer(loan)
    
    return Response({
        'message': 'Loan created successfully',
        'loan': response_serializer.data
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def view_loan_by_id(request, loan_id):
    """
    GET /api/view-loan/<loan_id>
    Get loan details by loan ID
    """
    loan = get_object_or_404(Loan, loan_id=loan_id)
    serializer = LoanDetailSerializer(loan)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def view_loans_by_customer(request, customer_id):
    """
    GET /api/view-loans/<customer_id>
    Get all loans for a specific customer
    """
    customer = get_object_or_404(Customer, customer_id=customer_id)
    loans = Loan.objects.filter(customer=customer).order_by('-created_at')
    serializer = LoanDetailSerializer(loans, many=True)
    
    return Response({
        'customer': CustomerSerializer(customer).data,
        'loans': serializer.data,
        'total_loans': loans.count()
    }, status=status.HTTP_200_OK)


class CustomerListView(generics.ListAPIView):
    """
    GET /api/customers
    List all customers with pagination
    """
    queryset = Customer.objects.all().order_by('-created_at')
    serializer_class = CustomerSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(phone_number__icontains=search)
            )
        return queryset


class LoanListView(generics.ListAPIView):
    """
    GET /api/loans
    List all loans with pagination and filtering
    """
    queryset = Loan.objects.all().order_by('-created_at')
    serializer_class = LoanSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by customer
        customer_id = self.request.query_params.get('customer_id')
        if customer_id:
            queryset = queryset.filter(customer__customer_id=customer_id)
        
        # Filter by status (you might want to add a status field)
        status_filter = self.request.query_params.get('status')
        if status_filter:
            # This is a simple implementation, you might want to add actual status logic
            if status_filter == 'active':
                queryset = queryset.filter(end_date__gte=date.today())
            elif status_filter == 'completed':
                queryset = queryset.filter(end_date__lt=date.today())
        
        return queryset


@api_view(['POST'])
def upload_excel_data(request):
    """
    POST /api/upload-excel
    Upload customer and loan data from Excel files
    """
    if 'customer_file' not in request.FILES and 'loan_file' not in request.FILES:
        return Response(
            {'error': 'Please provide customer_file or loan_file'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    results = {}
    
    # Process customer file
    if 'customer_file' in request.FILES:
        customer_file = request.FILES['customer_file']
        try:
            # Read Excel file
            if customer_file.name.endswith('.xlsx') or customer_file.name.endswith('.xls'):
                df = pd.read_excel(customer_file)
            else:
                df = pd.read_csv(customer_file)
            
            customers_created = 0
            errors = []
            
            for index, row in df.iterrows():
                try:
                    customer_data = {
                        'first_name': row.get('first_name', ''),
                        'last_name': row.get('last_name', ''),
                        'age': int(row.get('age', 0)),
                        'phone_number': str(row.get('phone_number', '')),
                        'monthly_salary': int(row.get('monthly_salary', 0))
                    }
                    
                    serializer = CustomerSerializer(data=customer_data)
                    if serializer.is_valid():
                        serializer.save()
                        customers_created += 1
                    else:
                        errors.append(f"Row {index + 1}: {serializer.errors}")
                
                except Exception as e:
                    errors.append(f"Row {index + 1}: {str(e)}")
            
            results['customers'] = {
                'created': customers_created,
                'errors': errors[:10]  # Limit errors to first 10
            }
            
        except Exception as e:
            results['customers'] = {'error': str(e)}
    
    # Process loan file
    if 'loan_file' in request.FILES:
        loan_file = request.FILES['loan_file']
        try:
            # Read Excel file
            if loan_file.name.endswith('.xlsx') or loan_file.name.endswith('.xls'):
                df = pd.read_excel(loan_file)
            else:
                df = pd.read_csv(loan_file)
            
            loans_created = 0
            errors = []
            
            for index, row in df.iterrows():
                try:
                    # Get customer
                    customer_id = int(row.get('customer_id', 0))
                    customer = Customer.objects.get(customer_id=customer_id)
                    
                    loan_data = {
                        'customer': customer.customer_id,
                        'loan_amount': int(row.get('loan_amount', 0)),
                        'tenure': int(row.get('tenure', 0)),
                        'interest_rate': float(row.get('interest_rate', 0)),
                        'start_date': row.get('start_date', date.today())
                    }
                    
                    serializer = LoanCreationSerializer(data=loan_data)
                    if serializer.is_valid():
                        loan = serializer.save()
                        # Update EMIs paid on time if provided
                        emis_paid = row.get('emis_paid_on_time', 0)
                        if emis_paid:
                            loan.emis_paid_on_time = int(emis_paid)
                            loan.save()
                        loans_created += 1
                    else:
                        errors.append(f"Row {index + 1}: {serializer.errors}")
                
                except Customer.DoesNotExist:
                    errors.append(f"Row {index + 1}: Customer {customer_id} not found")
                except Exception as e:
                    errors.append(f"Row {index + 1}: {str(e)}")
            
            results['loans'] = {
                'created': loans_created,
                'errors': errors[:10]  # Limit errors to first 10
            }
            
        except Exception as e:
            results['loans'] = {'error': str(e)}
    
    return Response(results, status=status.HTTP_200_OK)
