from rest_framework import serializers
from .models import Customer, Loan
from datetime import date


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['customer_id', 'first_name', 'last_name', 'age', 'phone_number', 'monthly_salary', 'approved_limit']
        read_only_fields = ['customer_id', 'approved_limit']

    def validate_age(self, value):
        if value < 18 or value > 100:
            raise serializers.ValidationError("Age must be between 18 and 100.")
        return value

    def validate_monthly_salary(self, value):
        if value <= 0:
            raise serializers.ValidationError("Monthly salary must be greater than 0.")
        return value


class LoanSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()
    total_amount = serializers.ReadOnlyField()
    total_interest = serializers.ReadOnlyField()
    remaining_amount = serializers.ReadOnlyField()
    payment_percentage = serializers.ReadOnlyField()

    class Meta:
        model = Loan
        fields = [
            'loan_id', 'customer', 'customer_name', 'loan_amount', 'tenure', 
            'interest_rate', 'monthly_payment', 'emis_paid_on_time', 
            'start_date', 'end_date', 'total_amount', 'total_interest', 
            'remaining_amount', 'payment_percentage'
        ]
        read_only_fields = ['loan_id', 'monthly_payment', 'end_date']

    def get_customer_name(self, obj):
        return f"{obj.customer.first_name} {obj.customer.last_name}"

    def validate_loan_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Loan amount must be greater than 0.")
        return value

    def validate_tenure(self, value):
        if value <= 0 or value > 360:
            raise serializers.ValidationError("Tenure must be between 1 and 360 months.")
        return value

    def validate_interest_rate(self, value):
        if value <= 0 or value > 50:
            raise serializers.ValidationError("Interest rate must be between 0.1% and 50%.")
        return value


class LoanDetailSerializer(LoanSerializer):
    customer_details = CustomerSerializer(source='customer', read_only=True)

    class Meta(LoanSerializer.Meta):
        fields = LoanSerializer.Meta.fields + ['customer_details']


class EligibilityCheckSerializer(serializers.Serializer):
    customer_id = serializers.IntegerField()
    loan_amount = serializers.IntegerField(min_value=1)
    interest_rate = serializers.FloatField(min_value=0.1, max_value=50.0)
    tenure = serializers.IntegerField(min_value=1, max_value=360)

    def validate_customer_id(self, value):
        try:
            Customer.objects.get(customer_id=value)
        except Customer.DoesNotExist:
            raise serializers.ValidationError("Customer does not exist.")
        return value


class EligibilityResponseSerializer(serializers.Serializer):
    credit_score = serializers.IntegerField()
    approved_amount = serializers.IntegerField()
    approval_status = serializers.CharField()
    suggested_interest_rate = serializers.FloatField()
    monthly_emi = serializers.FloatField()


class LoanCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Loan
        fields = ['customer', 'loan_amount', 'tenure', 'interest_rate', 'start_date']

    def validate_start_date(self, value):
        if value < date.today():
            raise serializers.ValidationError("Start date cannot be in the past.")
        return value

    def validate(self, data):
        # Check if customer has sufficient credit limit
        customer = data['customer']
        loan_amount = data['loan_amount']
        
        # Calculate current utilization
        active_loans = Loan.objects.filter(customer=customer)
        current_utilization = sum(loan.loan_amount for loan in active_loans)
        
        if current_utilization + loan_amount > customer.approved_limit:
            raise serializers.ValidationError(
                f"Loan amount exceeds available credit limit. "
                f"Available: ₹{customer.approved_limit - current_utilization:,}"
            )
        
        return data
