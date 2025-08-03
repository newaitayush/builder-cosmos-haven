from django.contrib import admin
from .models import Customer, Loan


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['customer_id', 'first_name', 'last_name', 'age', 'phone_number', 'monthly_salary', 'approved_limit', 'created_at']
    list_filter = ['age', 'created_at']
    search_fields = ['first_name', 'last_name', 'phone_number']
    readonly_fields = ['customer_id', 'approved_limit', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Personal Information', {
            'fields': ('first_name', 'last_name', 'age', 'phone_number')
        }),
        ('Financial Information', {
            'fields': ('monthly_salary', 'approved_limit')
        }),
        ('System Information', {
            'fields': ('customer_id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Loan)
class LoanAdmin(admin.ModelAdmin):
    list_display = ['loan_id', 'customer', 'loan_amount', 'tenure', 'interest_rate', 'monthly_payment', 'start_date', 'end_date', 'emis_paid_on_time']
    list_filter = ['interest_rate', 'tenure', 'start_date', 'created_at']
    search_fields = ['customer__first_name', 'customer__last_name', 'loan_id']
    readonly_fields = ['loan_id', 'monthly_payment', 'end_date', 'created_at', 'updated_at', 'total_amount', 'total_interest', 'remaining_amount', 'payment_percentage']
    
    fieldsets = (
        ('Loan Details', {
            'fields': ('customer', 'loan_amount', 'tenure', 'interest_rate', 'start_date', 'end_date')
        }),
        ('Payment Information', {
            'fields': ('monthly_payment', 'emis_paid_on_time')
        }),
        ('Calculated Fields', {
            'fields': ('total_amount', 'total_interest', 'remaining_amount', 'payment_percentage'),
            'classes': ('collapse',)
        }),
        ('System Information', {
            'fields': ('loan_id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
