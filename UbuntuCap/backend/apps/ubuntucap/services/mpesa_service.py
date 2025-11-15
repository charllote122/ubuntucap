import requests
import base64
from datetime import datetime, timedelta
from django.conf import settings
from django.utils import timezone
import logging
import json
import random
from decimal import Decimal

logger = logging.getLogger(__name__)

class MpesaService:
    def __init__(self):
        self.consumer_key = settings.MPESA_CONSUMER_KEY
        self.consumer_secret = settings.MPESA_CONSUMER_SECRET
        self.base_url = settings.MPESA_BASE_URL
        self.business_shortcode = settings.MPESA_BUSINESS_SHORTCODE
        self.passkey = settings.MPESA_PASSKEY
    
    def get_access_token(self):
        """Get OAuth token from M-Pesa using settings"""
        try:
            # For production, use actual M-Pesa OAuth
            if settings.MPESA_ENVIRONMENT == 'production':
                auth_string = f"{self.consumer_key}:{self.consumer_secret}"
                encoded_auth = base64.b64encode(auth_string.encode()).decode()
                
                headers = {'Authorization': f'Basic {encoded_auth}'}
                
                response = requests.get(
                    f'{self.base_url}/oauth/v1/generate?grant_type=client_credentials',
                    headers=headers,
                    timeout=settings.MPESA_REQUEST_TIMEOUT
                )
                
                if response.status_code == 200:
                    return response.json().get('access_token')
                else:
                    logger.error(f"Failed to get access token: {response.text}")
                    return None
            else:
                # For sandbox/development, return mock token
                return "mock_access_token_12345"
                
        except Exception as e:
            logger.error(f"Error getting access token: {e}")
            return None
    
    def get_loan_qualification_status(self, user):
        """Check if user qualifies for loan based on M-Pesa thresholds"""
        try:
            profile = user.profile
            thresholds = settings.MPESA_LOAN_QUALIFICATION
            
            # Check minimum requirements
            meets_volume = float(profile.avg_monthly_volume) >= thresholds['minimum_monthly_volume']
            meets_frequency = profile.transaction_count_30d >= thresholds['minimum_transaction_count']
            meets_consistency = profile.income_consistency_score >= thresholds['minimum_consistency_score']
            
            risk_indicators = self._identify_risk_indicators(user)
            meets_risk_threshold = len(risk_indicators) <= thresholds['maximum_risk_indicators']
            
            # Calculate qualification score
            qualification_score = (
                (1 if meets_volume else 0) +
                (1 if meets_frequency else 0) +
                (1 if meets_consistency else 0) +
                (1 if meets_risk_threshold else 0)
            )
            
            if qualification_score >= 3:
                return 'qualified'
            elif qualification_score >= 2:
                return 'limited_qualification'
            else:
                return 'not_qualified'
                
        except Exception as e:
            logger.error(f"Error checking loan qualification: {e}")
            return 'not_qualified'
    
    def calculate_recommended_loan_limit(self, user):
        """Calculate loan limit based on M-Pesa transaction volume"""
        try:
            profile = user.profile
            ratio = settings.MPESA_LOAN_QUALIFICATION['loan_to_volume_ratio']
            
            base_limit = float(profile.avg_monthly_volume) * ratio
            
            # Adjust based on transaction patterns
            if profile.income_consistency_score > 0.7:
                base_limit *= 1.2  # 20% bonus for consistent income
            
            if profile.mpesa_activity_level == 'very_high':
                base_limit *= 1.1  # 10% bonus for high activity
            
            # Apply thresholds
            max_limit = settings.MPESA_VOLUME_THRESHOLDS['very_high'] * ratio
            min_limit = 1000  # Minimum loan amount
            
            return min(max_limit, max(min_limit, base_limit))
            
        except Exception as e:
            logger.error(f"Error calculating loan limit: {e}")
            return 5000  # Default minimum
    
    # ... rest of your existing MpesaService methods ...