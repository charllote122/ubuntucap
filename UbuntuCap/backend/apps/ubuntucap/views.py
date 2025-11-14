from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views import View
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
import json
import logging
from datetime import datetime

# Import your ML engine
from .ml_engine.credit_scorer import CreditScoringModel

logger = logging.getLogger(__name__)

# Initialize the credit scoring model
credit_model = CreditScoringModel()

class BaseAPIView(View):
    """Base API view with JWT authentication"""
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

class CreditScoreAPI(BaseAPIView):
    """API for credit score predictions with JWT auth"""
    
    def post(self, request):
        """Predict credit score for authenticated user"""
        try:
            user = request.user
            
            # Predict credit score using Gradient Boosting
            score = credit_model.predict_credit_score(user)
            risk_level, reason = credit_model.predict_credit_risk(user)
            
            # Get feature importance for explainability
            feature_importance = credit_model.get_feature_importance()
            
            # Determine loan eligibility
            loan_eligibility = self._calculate_loan_eligibility(score, user)
            
            response_data = {
                'success': True,
                'user_id': user.id,
                'username': user.username,
                'credit_score': round(score, 2),
                'risk_level': risk_level,
                'risk_reason': reason,
                'loan_eligibility': loan_eligibility,
                'feature_importance': feature_importance,
                'model_type': 'XGBoost Gradient Boosting',
                'timestamp': datetime.now().isoformat()
            }
            
            logger.info(f"Credit score predicted for user {user.id}: {score}")
            
            return JsonResponse(response_data)
            
        except Exception as e:
            logger.error(f"Credit score prediction error: {str(e)}")
            return JsonResponse({
                'success': False,
                'error': 'Failed to calculate credit score',
                'details': str(e)
            }, status=400)
    
    def _calculate_loan_eligibility(self, credit_score, user):
        """Calculate loan eligibility based on credit score and user profile"""
        try:
            from apps.users.models import UserProfile  # Adjust import based on your structure
            
            profile = user.userprofile  # Adjust based on your profile model name
            
            if credit_score >= 80:
                return {
                    "approved": True,
                    "max_amount": 100000,
                    "interest_rate": 0.079,
                    "repayment_period": 24,
                    "reason": "Excellent credit profile"
                }
            elif credit_score >= 70:
                return {
                    "approved": True,
                    "max_amount": 50000,
                    "interest_rate": 0.099,
                    "repayment_period": 18,
                    "reason": "Good credit history"
                }
            elif credit_score >= 60:
                return {
                    "approved": True,
                    "max_amount": 25000,
                    "interest_rate": 0.129,
                    "repayment_period": 12,
                    "reason": "Acceptable credit score"
                }
            elif credit_score >= 50:
                return {
                    "approved": True,
                    "max_amount": 10000,
                    "interest_rate": 0.159,
                    "repayment_period": 6,
                    "reason": "Basic eligibility met"
                }
            else:
                return {
                    "approved": False,
                    "max_amount": 0,
                    "interest_rate": 0,
                    "repayment_period": 0,
                    "reason": "Credit score below minimum threshold"
                }
                
        except Exception as e:
            logger.error(f"Loan eligibility calculation error: {str(e)}")
            return {
                "approved": False,
                "max_amount": 0,
                "interest_rate": 0,
                "repayment_period": 0,
                "reason": "Error calculating eligibility"
            }

class ModelTrainingAPI(BaseAPIView):
    """API for training and managing the ML model (Admin only)"""
    
    def post(self, request):
        """Retrain the credit scoring model"""
        try:
            # Check if user is staff/admin
            if not request.user.is_staff:
                return JsonResponse({
                    'success': False,
                    'error': 'Permission denied. Admin access required.'
                }, status=403)
            
            from django.contrib.auth.models import User
            
            # Get training parameters
            data = json.loads(request.body) if request.body else {}
            use_xgboost = data.get('use_xgboost', True)
            
            # Get all users with profiles for training
            users = User.objects.filter(userprofile__isnull=False)  # Adjust based on your profile model
            
            if users.count() < 10:
                return JsonResponse({
                    'success': False,
                    'error': 'Insufficient training data. Need at least 10 users with profiles.'
                }, status=400)
            
            # Train the model
            success = credit_model.fit(users, use_xgboost=use_xgboost)
            
            if success:
                feature_importance = credit_model.get_feature_importance()
                
                response_data = {
                    'success': True,
                    'message': 'Model trained successfully',
                    'model_type': 'XGBoost' if use_xgboost else 'GradientBoosting',
                    'training_samples': users.count(),
                    'feature_importance': feature_importance,
                    'timestamp': datetime.now().isoformat()
                }
                
                logger.info(f"Model trained successfully with {users.count()} samples")
                
            else:
                response_data = {
                    'success': False,
                    'error': 'Model training failed'
                }
            
            return JsonResponse(response_data)
            
        except Exception as e:
            logger.error(f"Model training error: {str(e)}")
            return JsonResponse({
                'success': False,
                'error': 'Model training failed',
                'details': str(e)
            }, status=400)
    
    def get(self, request):
        """Get model information and status"""
        try:
            model_info = {
                'success': True,
                'model_loaded': credit_model.model is not None,
                'model_type': 'XGBoost Gradient Boosting' if credit_model.model is not None else 'Not loaded',
                'features_used': credit_model.features,
                'timestamp': datetime.now().isoformat()
            }
            
            if credit_model.model is not None:
                feature_importance = credit_model.get_feature_importance()
                model_info['feature_importance'] = feature_importance
            
            return JsonResponse(model_info)
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=400)

class LoanApplicationAPI(BaseAPIView):
    """API for handling loan applications with ML credit scoring"""
    
    def post(self, request):
        """Process a new loan application with ML scoring"""
        try:
            data = json.loads(request.body)
            user = request.user
            requested_amount = float(data.get('amount', 0))
            loan_purpose = data.get('purpose', '')
            
            if requested_amount <= 0:
                return JsonResponse({
                    'success': False,
                    'error': 'Invalid loan amount'
                }, status=400)
            
            # Get credit score prediction
            credit_score = credit_model.predict_credit_score(user)
            risk_level, risk_reason = credit_model.predict_credit_risk(user)
            
            # Determine loan approval
            approval_result = self._evaluate_loan_application(
                user, credit_score, requested_amount, loan_purpose
            )
            
            # Log the application
            logger.info(
                f"ML Loan application - User: {user.id}, "
                f"Amount: {requested_amount}, "
                f"Score: {credit_score}, "
                f"Approved: {approval_result['approved']}"
            )
            
            response_data = {
                'success': True,
                'application_id': f"APP{datetime.now().strftime('%Y%m%d%H%M%S')}",
                'credit_score': round(credit_score, 2),
                'risk_level': risk_level,
                'risk_reason': risk_reason,
                'requested_amount': requested_amount,
                'approval_result': approval_result,
                'timestamp': datetime.now().isoformat()
            }
            
            return JsonResponse(response_data)
            
        except Exception as e:
            logger.error(f"Loan application error: {str(e)}")
            return JsonResponse({
                'success': False,
                'error': 'Loan application failed',
                'details': str(e)
            }, status=400)
    
    def _evaluate_loan_application(self, user, credit_score, requested_amount, purpose):
        """Evaluate loan application using ML credit score"""
        try:
            from apps.users.models import UserProfile  # Adjust import
            
            profile = user.userprofile  # Adjust based on your profile model
            
            # Base eligibility from credit score
            if credit_score >= 80:
                max_amount = 100000
                interest_rate = 0.079
            elif credit_score >= 70:
                max_amount = 50000
                interest_rate = 0.099
            elif credit_score >= 60:
                max_amount = 25000
                interest_rate = 0.129
            elif credit_score >= 50:
                max_amount = 10000
                interest_rate = 0.159
            else:
                return {
                    "approved": False,
                    "reason": "Credit score below minimum threshold",
                    "suggested_amount": 0
                }
            
            # Additional business rules
            monthly_income = float(profile.avg_monthly_volume)
            affordable_amount = monthly_income * 0.3  # 30% of monthly income
            
            final_max_amount = min(max_amount, affordable_amount, requested_amount)
            
            if requested_amount <= final_max_amount:
                repayment_period = 12 if requested_amount <= 25000 else 24
                return {
                    "approved": True,
                    "approved_amount": requested_amount,
                    "interest_rate": interest_rate,
                    "repayment_period": repayment_period,
                    "monthly_installment": self._calculate_monthly_payment(
                        requested_amount, interest_rate, repayment_period
                    ),
                    "reason": "Application approved based on ML credit assessment"
                }
            else:
                return {
                    "approved": False,
                    "reason": f"Requested amount exceeds maximum eligible amount of KSh {final_max_amount:,.0f}",
                    "suggested_amount": final_max_amount
                }
                
        except Exception as e:
            logger.error(f"Loan evaluation error: {str(e)}")
            return {
                "approved": False,
                "reason": "Error evaluating application",
                "suggested_amount": 0
            }
    
    def _calculate_monthly_payment(self, principal, annual_rate, months):
        """Calculate monthly loan payment"""
        monthly_rate = annual_rate / 12
        payment = principal * (monthly_rate * (1 + monthly_rate) ** months) / ((1 + monthly_rate) ** months - 1)
        return round(payment, 2)

@csrf_exempt
@require_http_methods(["POST"])
def quick_credit_check(request):
    """Quick credit check without authentication (for demo/testing)"""
    try:
        data = json.loads(request.body)
        
        # Mock user data for quick check
        mock_user_data = {
            'avg_monthly_volume': float(data.get('monthly_volume', 0)),
            'transaction_consistency': float(data.get('consistency', 0.5)),
            'business_age_months': int(data.get('business_age', 0)),
            'savings_ratio': float(data.get('savings_ratio', 0)),
            'loan_history_count': int(data.get('previous_loans', 0)),
            'default_rate': float(data.get('default_rate', 0)),
        }
        
        # Create a mock user object (same as previous implementation)
        class MockUser:
            def __init__(self, data):
                self.profile = MockProfile(data)
                self.business_age_months = data['business_age_months']
                self.loans = MockLoans(data['loan_history_count'], data['default_rate'])
        
        class MockProfile:
            def __init__(self, data):
                self.avg_monthly_volume = data['avg_monthly_volume']
                self.transaction_consistency = data['transaction_consistency']
                self.savings_ratio = data['savings_ratio']
                self.customer_rating = 3.0
        
        class MockLoans:
            def __init__(self, count, default_rate):
                self.count = count
                self.default_rate = default_rate
            
            def count(self):
                return self.count
            
            def filter(self, **kwargs):
                return MockLoanQuery(int(self.count * self.default_rate))
        
        class MockLoanQuery:
            def __init__(self, count):
                self.count = count
            
            def count(self):
                return self.count
        
        mock_user = MockUser(mock_user_data)
        
        # Calculate score
        score = credit_model.predict_credit_score(mock_user)
        risk_level, reason = credit_model.predict_credit_risk(mock_user)
        
        return JsonResponse({
            'success': True,
            'credit_score': round(score, 2),
            'risk_level': risk_level,
            'risk_reason': reason,
            'estimated_max_loan': min(50000, mock_user_data['avg_monthly_volume'] * 3),
            'model_type': 'XGBoost Gradient Boosting',
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=400)