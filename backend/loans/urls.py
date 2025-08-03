from django.urls import path
from . import views

urlpatterns = [
    # Customer endpoints
    path('register', views.register_customer, name='register_customer'),
    path('customers/', views.CustomerListView.as_view(), name='customer_list'),
    
    # Loan endpoints
    path('check-eligibility', views.check_eligibility, name='check_eligibility'),
    path('create-loan', views.create_loan, name='create_loan'),
    path('view-loan/<int:loan_id>', views.view_loan_by_id, name='view_loan_by_id'),
    path('view-loans/<int:customer_id>', views.view_loans_by_customer, name='view_loans_by_customer'),
    path('loans/', views.LoanListView.as_view(), name='loan_list'),
    
    # Data import
    path('upload-excel', views.upload_excel_data, name='upload_excel_data'),
]
