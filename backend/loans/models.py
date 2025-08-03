from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal
import datetime
from dateutil.relativedelta import relativedelta


class Customer(models.Model):
    customer_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    age = models.IntegerField(validators=[MinValueValidator(18), MaxValueValidator(100)])
    phone_number = models.CharField(max_length=15)
    monthly_salary = models.IntegerField(validators=[MinValueValidator(1)])
    approved_limit = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Calculate approved_limit as monthly_salary * 36
        if not self.approved_limit:
            self.approved_limit = self.monthly_salary * 36
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name} (ID: {self.customer_id})"

    class Meta:
        db_table = 'customers'


class Loan(models.Model):
    loan_id = models.AutoField(primary_key=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='loans')
    loan_amount = models.IntegerField(validators=[MinValueValidator(1)])
    tenure = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(360)], help_text="Tenure in months")
    interest_rate = models.FloatField(validators=[MinValueValidator(0.1), MaxValueValidator(50.0)])
    monthly_payment = models.FloatField()
    emis_paid_on_time = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    start_date = models.DateField()
    end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Calculate monthly_payment (EMI) using the formula
        # EMI = [P x R x (1+R)^N] / [(1+R)^N-1]
        if not self.monthly_payment:
            principal = self.loan_amount
            monthly_rate = self.interest_rate / (12 * 100)  # Convert annual rate to monthly decimal
            tenure_months = self.tenure
            
            if monthly_rate > 0:
                emi = (principal * monthly_rate * ((1 + monthly_rate) ** tenure_months)) / \
                      (((1 + monthly_rate) ** tenure_months) - 1)
            else:
                emi = principal / tenure_months  # Simple division if rate is 0
            
            self.monthly_payment = round(emi, 2)

        # Calculate end_date if not provided
        if not self.end_date and self.start_date:
            self.end_date = self.start_date + relativedelta(months=self.tenure)

        super().save(*args, **kwargs)

    @property
    def total_amount(self):
        """Calculate total amount to be paid"""
        return self.monthly_payment * self.tenure

    @property
    def total_interest(self):
        """Calculate total interest to be paid"""
        return self.total_amount - self.loan_amount

    @property
    def remaining_amount(self):
        """Calculate remaining amount to be paid"""
        return self.monthly_payment * (self.tenure - self.emis_paid_on_time)

    @property
    def payment_percentage(self):
        """Calculate percentage of EMIs paid on time"""
        if self.tenure == 0:
            return 0
        return (self.emis_paid_on_time / self.tenure) * 100

    def __str__(self):
        return f"Loan {self.loan_id} - {self.customer.first_name} {self.customer.last_name}"

    class Meta:
        db_table = 'loans'
