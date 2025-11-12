from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid

class User(AbstractUser):
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
    
    last_ml_update = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'user_profiles'
    
    def __str__(self):
        return f"Profile for {self.user.phone_number}"