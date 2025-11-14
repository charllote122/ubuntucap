from django.db import models
from django.conf import settings
from django.utils import timezone
import uuid

class Loan(models.Model):
    LOAN_STATUS = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('disbursed', 'Disbursed'),
        ('completed', 'Completed'),
        ('defaulted', 'Defaulted'),
    )
    
    BUSINESS_TYPES = (
        ('retail', 'Retail'),
        ('agriculture', 'Agriculture'),
        ('services', 'Services'),
        ('manufacturing', 'Manufacturing'),
        ('other', 'Other'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='loans')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    purpose = models.CharField(max_length=255)
    business_type = models.CharField(max_length=50, choices=BUSINESS_TYPES)
    
    status = models.CharField(max_length=20, choices=LOAN_STATUS, default='pending')
    term_days = models.IntegerField(default=30)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, default=8.5)
    
    # Dates
    application_date = models.DateTimeField(auto_now_add=True)
    approved_date = models.DateTimeField(null=True, blank=True)
    disbursed_date = models.DateTimeField(null=True, blank=True)
    due_date = models.DateTimeField(null=True, blank=True)
    
    # Repayment tracking
    repaid_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    # ML Credit Scoring fields
    credit_score = models.IntegerField(default=0)
    risk_level = models.CharField(max_length=20, default='medium')  # low, medium, high
    
    class Meta:
        ordering = ['-application_date']
    
    def __str__(self):
        return f"{self.user.phone_number} - {self.amount} - {self.status}"
    
    @property
    def total_repayable(self):
        interest_amount = self.amount * self.interest_rate / 100
        return self.amount + interest_amount
    
    @property
    def remaining_balance(self):
        return self.total_repayable - self.repaid_amount
    
    @property
    def is_overdue(self):
        if self.due_date and self.status in ['disbursed', 'approved']:
            return timezone.now() > self.due_date and self.remaining_balance > 0
        return False

class LoanRepayment(models.Model):
    REPAYMENT_STATUS = (
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('overdue', 'Overdue'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE, related_name='repayments')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    due_date = models.DateTimeField()
    paid_date = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=REPAYMENT_STATUS, default='pending')
    mpesa_receipt = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Repayment {self.amount} for {self.loan}"

class LoanApplication(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    purpose = models.CharField(max_length=255)
    term_days = models.IntegerField(default=30)
    status = models.CharField(max_length=20, choices=Loan.LOAN_STATUS, default='pending')
    applied_date = models.DateTimeField(auto_now_add=True)
    
    # Additional application data for ML scoring
    business_age_months = models.IntegerField(default=0)
    existing_loans_count = models.IntegerField(default=0)
    average_monthly_sales = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    
    def __str__(self):
        return f"Application {self.amount} by {self.user.phone_number}"