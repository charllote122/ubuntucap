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
    business_type = models.CharField(max_length=50, choices=BUSINESS_TYPES, default='other')
    
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
    risk_level = models.CharField(max_length=20, default='medium')
    
    class Meta:
        ordering = ['-application_date']
        db_table = 'loans'
    
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
    
    def approve_loan(self):
        """Approve a pending loan"""
        if self.status == 'pending':
            from .services import CreditScoringService
            
            # Check eligibility
            is_eligible, reason = CreditScoringService.calculate_loan_eligibility(
                self.user, self.amount
            )
            
            if is_eligible:
                self.status = 'approved'
                self.approved_date = timezone.now()
                self.interest_rate = CreditScoringService.calculate_interest_rate(
                    self.user, self.amount, self.term_days
                )
                self.due_date = timezone.now() + timezone.timedelta(days=self.term_days)
                self.credit_score = self.user.profile.credit_score
                self.save()
                return True, "Loan approved"
            else:
                self.status = 'rejected'
                self.save()
                return False, reason
        return False, "Loan not in pending status"
    
    def disburse_loan(self):
        """Disburse an approved loan"""
        if self.status == 'approved':
            # TODO: Integrate with M-Pesa API
            self.status = 'disbursed'
            self.disbursed_date = timezone.now()
            self.save()
            
            # Update user profile
            profile = self.user.profile
            profile.total_loans_taken += 1
            profile.total_amount_borrowed += self.amount
            profile.save()
            
            return True, "Loan disbursed"
        return False, "Loan not approved"
    
    def add_repayment(self, amount, mpesa_receipt=None):
        """Add a repayment to the loan"""
        if self.status in ['disbursed', 'approved']:
            self.repaid_amount += amount
            self.save()
            
            # Update user profile
            profile = self.user.profile
            profile.total_amount_repaid += amount
            profile.save()
            
            # Create repayment record
            repayment = LoanRepayment.objects.create(
                loan=self,
                amount=amount,
                mpesa_receipt=mpesa_receipt,
                status='paid'
            )
            
            # Check if loan is completed
            if self.repaid_amount >= self.total_repayable:
                self.status = 'completed'
                self.save()
            
            return repayment
        return None

class LoanRepayment(models.Model):
    REPAYMENT_STATUS = (
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('overdue', 'Overdue'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE, related_name='repayments')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    due_date = models.DateTimeField(null=True, blank=True)
    paid_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=REPAYMENT_STATUS, default='paid')
    mpesa_receipt = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'loan_repayments'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Repayment {self.amount} for {self.loan}"