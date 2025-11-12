from django.db import models
from django.core.validators import MinValueValidator
import uuid
from apps.users.models import User

class LoanApplication(models.Model):
    STATUS_PENDING = 'pending'
    STATUS_APPROVED = 'approved'
    STATUS_REJECTED = 'rejected'
    STATUS_DISBURSED = 'disbursed'
    
    STATUS_CHOICES = [
        (STATUS_PENDING, 'Pending'),
        (STATUS_APPROVED, 'Approved'),
        (STATUS_REJECTED, 'Rejected'),
        (STATUS_DISBURSED, 'Disbursed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='loan_applications')
    
    amount_requested = models.DecimalField(
        max_digits=12, 
        decimal_places=2,
        validators=[MinValueValidator(100)]
    )
    loan_purpose = models.CharField(max_length=200)
    repayment_period_days = models.IntegerField(default=30)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    credit_score = models.IntegerField(null=True, blank=True)
    decision_reason = models.TextField(blank=True)
    
    applied_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    decision_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'loan_applications'
        ordering = ['-applied_at']
    
    def __str__(self):
        return f"Loan App #{self.id} - {self.user.phone_number}"

class Loan(models.Model):
    STATUS_ACTIVE = 'active'
    STATUS_REPAID = 'repaid'
    STATUS_DEFAULTED = 'defaulted'
    
    STATUS_CHOICES = [
        (STATUS_ACTIVE, 'Active'),
        (STATUS_REPAID, 'Fully Repaid'),
        (STATUS_DEFAULTED, 'Defaulted'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    application = models.OneToOneField(LoanApplication, on_delete=models.CASCADE, related_name='loan')
    
    amount_approved = models.DecimalField(max_digits=12, decimal_places=2)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2)
    service_fee = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    total_amount_due = models.DecimalField(max_digits=12, decimal_places=2)
    amount_disbursed = models.DecimalField(max_digits=12, decimal_places=2)
    
    disbursement_date = models.DateTimeField(null=True, blank=True)
    due_date = models.DateField()
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_ACTIVE)
    amount_repaid = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    last_repayment_date = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'loans'
    
    def __str__(self):
        return f"Loan #{self.id} - {self.application.user.phone_number}"

class Repayment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE, related_name='repayments')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    mpesa_receipt_number = models.CharField(max_length=20, unique=True)
    phone_number = models.CharField(max_length=15)
    transaction_date = models.DateTimeField()
    recorded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'repayments'
    
    def __str__(self):
        return f"Repayment #{self.mpesa_receipt_number}"