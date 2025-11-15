import requests
import base64
import json
import hashlib
import hmac
from django.conf import settings
from django.utils import timezone
import logging
from decimal import Decimal

logger = logging.getLogger(__name__)

class PesapalPaymentService:
    def __init__(self):
        self.consumer_key = getattr(settings, 'PESAPAL_CONSUMER_KEY', '')
        self.consumer_secret = getattr(settings, 'PESAPAL_CONSUMER_SECRET', '')
        self.base_url = "https://pay.pesapal.com/v3"  # Live API
        self.callback_url = f"{getattr(settings, 'BASE_URL', 'http://localhost:8000')}/api/pesapal/callback/"
        
    def get_access_token(self):
        """Get OAuth token from PesaPal"""
        try:
            # PesaPal uses Basic Auth for token
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
                f"{self.base_url}/api/Auth/RequestToken",
                json=payload,
                headers=headers,
                timeout=30
            )
            
            if response.status_code == 200:
                token_data = response.json()
                logger.info("✅ PesaPal access token obtained successfully")
                return token_data['token']
            else:
                logger.error(f"❌ PesaPal token request failed: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            logger.error(f"❌ Error getting PesaPal token: {e}")
            return None
    
    def submit_order(self, user, amount, description, order_type="loan_disbursement"):
        """
        Submit payment order to PesaPal
        Used for BOTH disbursements and repayments
        """
        try:
            access_token = self.get_access_token()
            if not access_token:
                return {'success': False, 'error': 'Could not get access token'}
            
            headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {access_token}'
            }
            
            # Generate unique order tracking ID
            order_tracking_id = f"UBUNTUCAP_{order_type.upper()}_{user.id}_{int(timezone.now().timestamp())}"
            
            payload = {
                "id": order_tracking_id,
                "currency": "KES",
                "amount": float(amount),
                "description": description,
                "callback_url": self.callback_url,
                "notification_id": f"{getattr(settings, 'BASE_URL', 'http://localhost:8000')}/api/pesapal/ipn/",
                "billing_address": {
                    "email_address": getattr(user, 'email', f"{user.phone_number}@ubuntucap.com"),
                    "phone_number": user.phone_number,
                    "first_name": user.business_name.split()[0] if user.business_name else "Customer",
                    "last_name": user.business_name.split()[-1] if user.business_name and ' ' in user.business_name else "UbuntuCap",
                }
            }
            
            logger.info(f"🚀 Submitting PesaPal order: {payload}")
            
            response = requests.post(
                f"{self.base_url}/api/Transactions/SubmitOrderRequest",
                json=payload,
                headers=headers,
                timeout=30
            )
            
            if response.status_code == 200:
                order_data = response.json()
                logger.info(f"✅ PesaPal order submitted: {order_tracking_id}")
                
                return {
                    'success': True,
                    'order_tracking_id': order_tracking_id,
                    'payment_url': order_data['redirect_url'],
                    'merchant_reference': order_data.get('merchant_reference'),
                    'message': 'Payment order created successfully'
                }
            else:
                logger.error(f"❌ PesaPal order submission failed: {response.status_code} - {response.text}")
                return {'success': False, 'error': f'Order submission failed: {response.text}'}
                
        except Exception as e:
            logger.error(f"❌ PesaPal order submission error: {e}")
            return {'success': False, 'error': str(e)}
    
    def disburse_loan(self, user, amount, loan_application):
        """
        Disburse loan via PesaPal - User receives money
        For PesaPal, this would be a "merchant to customer" payment
        """
        description = f"UbuntuCap Loan Disbursement - KES {amount:,.0f}"
        
        result = self.submit_order(
            user=user,
            amount=amount,
            description=description,
            order_type="loan_disbursement"
        )
        
        if result['success']:
            result['instruction'] = "Complete the payment to receive your loan"
            result['payment_type'] = "disbursement"
            
        return result
    
    def collect_repayment(self, user, amount, loan):
        """
        Collect repayment via PesaPal - User pays money
        """
        description = f"UbuntuCap Loan Repayment - KES {amount:,.0f}"
        
        result = self.submit_order(
            user=user,
            amount=amount,
            description=description, 
            order_type="loan_repayment"
        )
        
        if result['success']:
            result['instruction'] = "Make your loan repayment via PesaPal"
            result['payment_type'] = "repayment"
            
        return result
    
    def get_order_status(self, order_tracking_id):
        """Check order/payment status"""
        try:
            access_token = self.get_access_token()
            if not access_token:
                return {'success': False, 'error': 'Could not get access token'}
            
            headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {access_token}'
            }
            
            response = requests.get(
                f"{self.base_url}/api/Transactions/GetTransactionStatus?orderTrackingId={order_tracking_id}",
                headers=headers,
                timeout=30
            )
            
            if response.status_code == 200:
                status_data = response.json()
                return {
                    'success': True,
                    'order_tracking_id': order_tracking_id,
                    'status': status_data.get('payment_status_description', 'Unknown'),
                    'payment_method': status_data.get('payment_method', 'Unknown'),
                    'amount': status_data.get('amount'),
                    'message': status_data.get('message')
                }
            else:
                return {'success': False, 'error': f'Status check failed: {response.text}'}
                
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def handle_ipn_callback(self, payload):
        """
        Handle Instant Payment Notification from PesaPal
        This is called when payment status changes
        """
        try:
            order_tracking_id = payload.get('OrderTrackingId')
            payment_status = payload.get('PaymentStatus')
            
            logger.info(f"🔄 PesaPal IPN: {order_tracking_id} - {payment_status}")
            
            # Update your database based on payment status
            if payment_status == 'COMPLETED':
                # Payment successful - update loan status
                self._handle_successful_payment(order_tracking_id)
            elif payment_status == 'FAILED':
                # Payment failed - notify user
                self._handle_failed_payment(order_tracking_id)
            
            return True
            
        except Exception as e:
            logger.error(f"❌ IPN handling error: {e}")
            return False
    
    def _handle_successful_payment(self, order_tracking_id):
        """Handle successful payment"""
        try:
            # Extract loan info from order_tracking_id
            # Format: UBUNTUCAP_{TYPE}_{USER_ID}_{TIMESTAMP}
            parts = order_tracking_id.split('_')
            if len(parts) >= 4:
                order_type = parts[1]  # loan_disbursement or loan_repayment
                user_id = parts[2]
                
                logger.info(f"✅ Payment successful: {order_type} for user {user_id}")
                
                # Update your database here
                if order_type == 'loan_disbursement':
                    # Mark loan as disbursed
                    pass
                elif order_type == 'loan_repayment':
                    # Update repayment status
                    pass
                    
        except Exception as e:
            logger.error(f"Error handling successful payment: {e}")
    
    def _handle_failed_payment(self, order_tracking_id):
        """Handle failed payment"""
        logger.warning(f"❌ Payment failed: {order_tracking_id}")
        # Notify user, update database, etc.
    
    def test_connection(self):
        """Test PesaPal API connection"""
        try:
            token = self.get_access_token()
            if token:
                return {
                    'success': True,
                    'message': '✅ PesaPal API connection successful!',
                    'token_obtained': True,
                    'provider': 'pesapal'
                }
            else:
                return {
                    'success': False,
                    'message': '❌ Failed to connect to PesaPal API',
                    'token_obtained': False,
                    'provider': 'pesapal'
                }
        except Exception as e:
            return {
                'success': False,
                'message': f'❌ PesaPal connection test failed: {e}',
                'token_obtained': False,
                'provider': 'pesapal'
            }
