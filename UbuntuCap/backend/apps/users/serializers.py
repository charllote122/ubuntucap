from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import User, UserProfile
import re

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = ('id', 'phone_number', 'password', 'email', 'first_name', 'last_name', 
                 'national_id', 'business_name', 'business_type', 'business_location', 
                 'business_age_months', 'mpesa_consent_granted', 'mpesa_phone_number')
        extra_kwargs = {
            'phone_number': {'required': True},
            'email': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
            'password': {'write_only': True},
        }
    
    def validate_phone_number(self, value):
        """Validate and clean phone number"""
        if not value:
            raise serializers.ValidationError("Phone number is required")
            
        # Remove any spaces or special characters
        clean_phone = re.sub(r'\D', '', str(value))
        
        # Ensure it starts with 254
        if not clean_phone.startswith('254'):
            raise serializers.ValidationError("Phone number must start with 254")
        
        # Check length (254 + 9 digits = 12 digits)
        if len(clean_phone) != 12:
            raise serializers.ValidationError("Phone number must be 12 digits including 254")
        
        return clean_phone
    
    def validate_email(self, value):
        """Ensure email is unique"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
    
    def validate_phone_number(self, value):
        """Ensure phone number is unique"""
        clean_phone = re.sub(r'\D', '', str(value))
        if User.objects.filter(phone_number=clean_phone).exists():
            raise serializers.ValidationError("A user with this phone number already exists.")
        return clean_phone
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        
        # Create user using the custom manager
        user = User.objects.create_user(
            phone_number=validated_data['phone_number'],
            email=validated_data.get('email'),
            password=password,
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            national_id=validated_data.get('national_id'),
            business_name=validated_data.get('business_name', ''),
            business_type=validated_data.get('business_type', ''),
            business_location=validated_data.get('business_location', ''),
            business_age_months=validated_data.get('business_age_months', 0),
            mpesa_consent_granted=validated_data.get('mpesa_consent_granted', False),
            mpesa_phone_number=validated_data.get('mpesa_phone_number', ''),
        )
        
        # Create user profile
        UserProfile.objects.create(user=user)
        
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = '__all__'

class LoginSerializer(serializers.Serializer):
    phone_number = serializers.CharField()
    password = serializers.CharField()