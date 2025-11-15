from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
import uuid

class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, phone_number, email, password, **extra_fields):
        if not phone_number:
            raise ValueError('The given phone number must be set')
        email = self.normalize_email(email)
        user = self.model(phone_number=phone_number, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, phone_number, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(phone_number, email, password, **extra_fields)

    def create_superuser(self, phone_number, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(phone_number, email, password, **extra_fields)

class User(AbstractUser):
    # Add this line to use the custom manager
    objects = UserManager()
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    phone_number = models.CharField(max_length=15, unique=True)
    national_id = models.CharField(max_length=20, unique=True, null=True, blank=True)
    
    # Business information
    business_name = models.CharField(max_length=200, blank=True)
    business_type = models.CharField(max_length=100, blank=True)
    business_location = models.CharField(max_length=200, blank=True)
    business_age_months = models.IntegerField(default=0)
    
    # Financial consent
    mpesa_consent_granted = models.BooleanField(default=False)
    mpesa_phone_number = models.CharField(max_length=15, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Remove username, use phone number
    username = None
    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name']
    
    class Meta:
        db_table = 'users'
    
    def __str__(self):
        return f"{self.phone_number} - {self.get_full_name()}"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # Credit information
    credit_score = models.IntegerField(default=0)
    total_loans_taken = models.IntegerField(default=0)
    total_amount_borrowed = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_amount_repaid = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    # ML features
    avg_monthly_volume = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    transaction_consistency = models.FloatField(default=0)
    savings_ratio = models.FloatField(default=0)
    
    # NEW M-Pesa Transaction History Fields
    mpesa_last_sync = models.DateTimeField(null=True, blank=True)
    mpesa_balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    transaction_count_30d = models.IntegerField(default=0)
    transaction_count_90d = models.IntegerField(default=0)
    avg_transaction_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    max_transaction_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    min_transaction_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Transaction Pattern Analysis
    income_consistency_score = models.FloatField(default=0)
    has_regular_income = models.BooleanField(default=False)
    primary_transaction_times = models.JSONField(default=dict, blank=True)  # {'morning': 0.3, 'afternoon': 0.4, 'evening': 0.3}
    
    # Risk Indicators
    negative_balance_count = models.IntegerField(default=0)
    overdraft_frequency = models.IntegerField(default=0)
    high_risk_transactions = models.IntegerField(default=0)
    
    # M-Pesa Activity Scores
    mpesa_activity_level = models.CharField(max_length=20, default='low')  # low, medium, high, very_high
    customer_rating = models.FloatField(default=3.0)
    
    last_ml_update = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'user_profiles'
    
    def __str__(self):
        return f"Profile for {self.user.phone_number}"
    
    def update_mpesa_activity_level(self):
        """Update activity level based on transaction patterns"""
        if self.transaction_count_30d >= 60:
            self.mpesa_activity_level = 'very_high'
        elif self.transaction_count_30d >= 30:
            self.mpesa_activity_level = 'high'
        elif self.transaction_count_30d >= 15:
            self.mpesa_activity_level = 'medium'
        else:
            self.mpesa_activity_level = 'low'
        self.save()

class MpesaTransaction(models.Model):
    TRANSACTION_TYPES = [
        ('deposit', 'Deposit'),
        ('withdrawal', 'Withdrawal'),
        ('send_money', 'Send Money'),
        ('pay_bill', 'Pay Bill'),
        ('buy_goods', 'Buy Goods'),
        ('receive_money', 'Receive Money'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mpesa_transactions')
    
    # Transaction details
    transaction_id = models.CharField(max_length=50, unique=True)
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    balance_after = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    
    # Parties involved
    sender = models.CharField(max_length=15, blank=True)
    receiver = models.CharField(max_length=15, blank=True)
    description = models.TextField(blank=True)
    
    # Timing
    transaction_time = models.DateTimeField()
    recorded_at = models.DateTimeField(auto_now_add=True)
    
    # Risk assessment
    is_high_risk = models.BooleanField(default=False)
    risk_reason = models.CharField(max_length=100, blank=True)
    
    class Meta:
        db_table = 'mpesa_transactions'
        indexes = [
            models.Index(fields=['user', 'transaction_time']),
            models.Index(fields=['transaction_time']),
        ]
    
    def __str__(self):
        return f"{self.transaction_id} - {self.amount} - {self.user.phone_number}"