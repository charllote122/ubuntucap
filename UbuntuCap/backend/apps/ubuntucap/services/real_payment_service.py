import requests
import base64
import json
import logging
from django.conf import settings
from django.utils import timezone

logger = logging.getLogger(__name__)

class RealPaymentService:
    """
    STRICT REAL PAYMENTS ONLY - No mock fallbacks
    System will FAIL completely if credentials are invalid
    """
    
    def __init__(self):
        self.consumer_key = getattr(settings, 'PESAPAL_CONSUMER_KEY', '')
        self.consumer_secret = getattr(settings, 'PESAPAL_CONSUMER_SECRET', '')
        
        # Test credentials immediately - SYSTEM BLOCKS IF INVALID
        self.credentials_valid = self._validate_credentials()
        
        if not self.credentials_valid:
            error_msg = """
            🚨 CRITICAL: INVALID PESAPAL CREDENTIALS
            REAL PAYMENTS ARE BLOCKED UNTIL YOU GET VALID CREDENTIALS
            
            IMMEDIATE ACTION REQUIRED:
            1. Email PesaPal: support@pesapal.com (use template provided)
            2. Apply to DPO Group: sales@dpogroup.com  
            3. Apply to Selcom: info@selcom.com
            
            CURRENT CREDENTIALS:
            Consumer Key: rbpmoIN0Dn5o2+ymhWN85VK4pSuOnVrK
            Consumer Secret: mPd/AKquZa4lIwcL7cmFpUf2aGU=
            
            ERROR: Invalid API credentials provided
            """
            logger.error(error_msg)
            raise Exception("INVALID_PESAPAL_CREDENTIALS - System blocked until valid credentials are provided")
        
        logger.info("✅ PesaPal credentials validated - REAL PAYMENT SYSTEM ACTIVE")
    
    def _validate_credentials(self):
        """Test PesaPal credentials - NO MOCK FALLBACK"""
        if not self.consumer_key or not self.consumer_secret:
            logger.error("❌ PesaPal credentials missing in settings")
            return False
        
        # Test both endpoints
        endpoints = [
            "https://pay.pesapal.com/v3/api/Auth/RequestToken",  # Live
            "https://cybqa.pesapal.com/pesapalv3/api/Auth/RequestToken"  # Sandbox
        ]
        
        for endpoint in endpoints:
            try:
                auth_string = f"{self.consumer_key}:{self.consumer_secret}"
                encoded_auth = base64.b64encode(auth_string.encode()).decode()
                
                headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': f'Basic {encoded_auth}'
                }
                
                payload = {
                    "consumer_key": self.consumer_key,
                    "consumer_secret": self.consumer_secret
                }
                
                response = requests.post(endpoint, json=payload, headers=headers, timeout=30)
                
                if response.status_code == 200:
                    logger.info(f"✅ PesaPal credentials VALID for endpoint: {endpoint}")
                    self.active_endpoint = endpoint.replace('/api/Auth/RequestToken', '')
                    return True
                else:
                    logger.warning(f"❌ Endpoint failed: {endpoint} - {response.status_code}")
                    
            except Exception as e:
                logger.warning(f"❌ Endpoint error: {endpoint} - {e}")
                continue
        
        logger.error("💥 ALL PESAPAL ENDPOINTS FAILED - CREDENTIALS ARE INVALID")
        return False
    
    def get_access_token(self):
        """Get OAuth token - FAILS if credentials invalid"""
        if not self.credentials_valid:
            raise Exception("Cannot get token - credentials are invalid")
        
        auth_string = f"{self.consumer_key}:{self.consumer_secret}"
        encoded_auth = base64.b64encode(auth_string.encode()).decode()
        
        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': f'Basic {encoded_auth}'
        }
        
        payload = {
            "consumer_key": self.consumer_key,
            "consumer_secret": self.consumer_secret
        }
        
        response = requests.post(
            f"{self.active_endpoint}/api/Auth/RequestToken",
            json=payload,
            headers=headers,
            timeout=30
        )
        
        if response.status_code != 200:
            raise Exception(f"Token request failed: {response.status_code} - {response.text}")
        
        token_data = response.json()
        return token_data['token']
    
    def disburse_loan(self, user, amount, loan_application):
        """REAL loan disbursement - NO MOCK"""
        try:
            access_token = self.get_access_token()
            
            headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {access_token}'
            }
            
            order_tracking_id = f"UBUNTUCAP_DISB_{user.id}_{int(timezone.now().timestamp())}"
            
            payload = {
                "id": order_tracking_id,
                "currency": "KES",
                "amount": float(amount),
                "description": f"UbuntuCap Loan Disbursement - KES {amount:,.0f}",
                "callback_url": f"{getattr(settings, 'BASE_URL', 'http://localhost:8000')}/api/pesapal/callback/",
                "notification_id": f"{getattr(settings, 'BASE_URL', 'http://localhost:8000')}/api/pesapal/ipn/",
                "billing_address": {
                    "email_address": getattr(user, 'email', f"{user.phone_number}@ubuntucap.com"),
                    "phone_number": user.phone_number,
                    "first_name": user.business_name.split()[0] if user.business_name else "Customer",
                    "last_name": user.business_name.split()[-1] if user.business_name and ' ' in user.business_name else "UbuntuCap",
                }
            }
            
            logger.info(f"🚀 SUBMITTING REAL DISBURSEMENT: {order_tracking_id}")
            
            response = requests.post(
                f"{self.active_endpoint}/api/Transactions/SubmitOrderRequest",
                json=payload,
                headers=headers,
                timeout=30
            )
            
            if response.status_code != 200:
                raise Exception(f"Disbursement failed: {response.status_code} - {response.text}")
            
            order_data = response.json()
            
            return {
                'success': True,
                'real_payment': True,
                'order_tracking_id': order_tracking_id,
                'payment_url': order_data['redirect_url'],
                'merchant_reference': order_data.get('merchant_reference'),
                'message': 'REAL payment order created successfully'
            }
            
        except Exception as e:
            logger.error(f"💥 REAL DISBURSEMENT FAILED: {e}")
            raise Exception(f"REAL payment failed: {str(e)}")
    
    def collect_repayment(self, user, amount, loan):
        """REAL repayment collection - NO MOCK"""
        try:
            access_token = self.get_access_token()
            
            headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {access_token}'
            }
            
            order_tracking_id = f"UBUNTUCAP_REPAY_{user.id}_{int(timezone.now().timestamp())}"
            
            payload = {
                "id": order_tracking_id,
                "currency": "KES",
                "amount": float(amount),
                "description": f"UbuntuCap Loan Repayment - KES {amount:,.0f}",
                "callback_url": f"{getattr(settings, 'BASE_URL', 'http://localhost:8000')}/api/pesapal/callback/",
                "notification_id": f"{getattr(settings, 'BASE_URL', 'http://localhost:8000')}/api/pesapal/ipn/",
                "billing_address": {
                    "email_address": getattr(user, 'email', f"{user.phone_number}@ubuntucap.com"),
                    "phone_number": user.phone_number,
                    "first_name": user.business_name.split()[0] if user.business_name else "Customer",
                    "last_name": user.business_name.split()[-1] if user.business_name and ' ' in user.business_name else "UbuntuCap",
                }
            }
            
            logger.info(f"🚀 SUBMITTING REAL REPAYMENT: {order_tracking_id}")
            
            response = requests.post(
                f"{self.active_endpoint}/api/Transactions/SubmitOrderRequest",
                json=payload,
                headers=headers,
                timeout=30
            )
            
            if response.status_code != 200:
                raise Exception(f"Repayment failed: {response.status_code} - {response.text}")
            
            order_data = response.json()
            
            return {
                'success': True,
                'real_payment': True,
                'order_tracking_id': order_tracking_id,
                'payment_url': order_data['redirect_url'],
                'merchant_reference': order_data.get('merchant_reference'),
                'message': 'REAL repayment order created successfully'
            }
            
        except Exception as e:
            logger.error(f"💥 REAL REPAYMENT FAILED: {e}")
            raise Exception(f"REAL repayment failed: {str(e)}")
    
    def get_system_status(self):
        """Get real system status"""
        return {
            'real_payments_only': True,
            'pesapal_configured': True,
            'pesapal_credentials_valid': self.credentials_valid,
            'active_endpoint': self.active_endpoint if self.credentials_valid else 'NONE',
            'system_ready': self.credentials_valid,
            'message': 'REAL PAYMENTS ONLY - No mock fallbacks' if self.credentials_valid else 'INVALID CREDENTIALS - System blocked'
        }
