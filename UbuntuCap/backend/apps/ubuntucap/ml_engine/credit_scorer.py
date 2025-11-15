import pandas as pd
import numpy as np
import joblib
import os
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

class CreditScoringModel:
    def __init__(self):
        self.model = None
        self.features = [
            'avg_monthly_volume',
            'transaction_consistency', 
            'business_age_months',
            'savings_ratio',
            'loan_history_count',
            'default_rate',
            'mpesa_activity_score',
            'customer_rating'
        ]
        self.model_path = os.path.join(settings.BASE_DIR, 'ml_models', 'credit_model.pkl')
        self.load_model()
    
    def load_model(self):
        """Load pre-trained model"""
        try:
            os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
            
            if os.path.exists(self.model_path):
                self.model = joblib.load(self.model_path)
                logger.info("✓ ML model loaded successfully")
            else:
                logger.info("⚠ No pre-trained model found. Using rule-based scoring.")
                self.model = None
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            self.model = None
    
    def predict_credit_score(self, user):
        """Predict credit score for a user (0-100 scale)"""
        try:
            # For now, use rule-based scoring
            score = self._rule_based_scoring(user)
            return max(0, min(100, score))
            
        except Exception as e:
            logger.error(f"Credit scoring error: {e}")
            return self._basic_fallback_score(user)
    
    def predict_credit_risk(self, user):
        """Predict credit risk category"""
        score = self.predict_credit_score(user)
        
        if score >= 80:
            return "low", "Excellent credit profile"
        elif score >= 70:
            return "medium", "Good credit history"
        elif score >= 60:
            return "medium_high", "Acceptable credit score"
        elif score >= 50:
            return "high", "Basic eligibility met"
        else:
            return "very_high", "Credit score below minimum threshold"
    
    def _rule_based_scoring(self, user):
        """Enhanced rule-based scoring with M-Pesa data"""
        try:
            profile = user.profile
            score = 50  # Base score
            
            # Monthly volume scoring (0-20 points)
            volume = float(profile.avg_monthly_volume)
            if volume > 100000:
                score += 20
            elif volume > 50000:
                score += 15
            elif volume > 25000:
                score += 10
            elif volume > 10000:
                score += 5
            
            # Business age scoring (0-15 points)
            business_age = user.business_age_months
            if business_age > 24:
                score += 15
            elif business_age > 12:
                score += 10
            elif business_age > 6:
                score += 5
            
            # Transaction consistency (0-15 points)
            consistency = profile.transaction_consistency
            if consistency > 0.8:
                score += 15
            elif consistency > 0.6:
                score += 10
            elif consistency > 0.4:
                score += 5
            
            # Savings ratio (0-10 points)
            savings = profile.savings_ratio
            if savings > 0.2:
                score += 10
            elif savings > 0.1:
                score += 5
            
            # M-Pesa activity level (0-10 points)
            activity_level = profile.mpesa_activity_level
            if activity_level == 'very_high':
                score += 10
            elif activity_level == 'high':
                score += 7
            elif activity_level == 'medium':
                score += 4
            
            # Loan history (0-10 points)
            loan_count = user.loans.count()
            if loan_count > 5:
                score += 10
            elif loan_count > 2:
                score += 7
            elif loan_count > 0:
                score += 4
            
            # Default rate penalty (0 to -20 points)
            default_rate = self._calculate_default_rate(user)
            if default_rate > 0.5:
                score -= 20
            elif default_rate > 0.3:
                score -= 15
            elif default_rate > 0.1:
                score -= 10
            elif default_rate > 0:
                score -= 5
            
            # Customer rating (0-10 points)
            rating = profile.customer_rating or 3.0
            if rating >= 4.5:
                score += 10
            elif rating >= 4.0:
                score += 7
            elif rating >= 3.5:
                score += 4
            elif rating >= 3.0:
                score += 2
            
            return max(0, min(100, score))
            
        except Exception as e:
            logger.error(f"Rule-based scoring failed: {e}")
            return self._basic_fallback_score(user)
    
    def _calculate_default_rate(self, user):
        """Calculate user's default rate"""
        try:
            total_loans = user.loans.count()
            if total_loans == 0:
                return 0.0
            
            defaulted_loans = user.loans.filter(status='defaulted').count()
            return defaulted_loans / total_loans
            
        except Exception as e:
            logger.error(f"Error calculating default rate: {e}")
            return 0.0
    
    def _basic_fallback_score(self, user):
        """Basic fallback scoring when detailed scoring fails"""
        try:
            profile = user.profile
            score = 50
            
            if user.business_age_months > 12:
                score += 20
            elif user.business_age_months > 6:
                score += 10
            
            if float(profile.avg_monthly_volume) > 10000:
                score += 15
            
            return max(0, min(100, score))
            
        except Exception:
            return 50
    
    def get_score_breakdown(self, user):
        """Get detailed breakdown of credit score calculation"""
        profile = user.profile
        
        breakdown = {
            'base_score': 50,
            'volume_score': self._calculate_volume_score(profile),
            'business_age_score': self._calculate_business_age_score(user),
            'consistency_score': self._calculate_consistency_score(profile),
            'savings_score': self._calculate_savings_score(profile),
            'activity_score': self._calculate_activity_score(profile),
            'loan_history_score': self._calculate_loan_history_score(user),
            'default_penalty': self._calculate_default_penalty(user),
            'rating_score': self._calculate_rating_score(profile)
        }
        
        total_score = sum(breakdown.values())
        breakdown['final_score'] = max(0, min(100, total_score))
        
        return breakdown
    
    def _calculate_volume_score(self, profile):
        volume = float(profile.avg_monthly_volume)
        if volume > 100000: return 20
        elif volume > 50000: return 15
        elif volume > 25000: return 10
        elif volume > 10000: return 5
        return 0
    
    def _calculate_business_age_score(self, user):
        business_age = user.business_age_months
        if business_age > 24: return 15
        elif business_age > 12: return 10
        elif business_age > 6: return 5
        return 0
    
    def _calculate_consistency_score(self, profile):
        consistency = profile.transaction_consistency
        if consistency > 0.8: return 15
        elif consistency > 0.6: return 10
        elif consistency > 0.4: return 5
        return 0
    
    def _calculate_savings_score(self, profile):
        savings = profile.savings_ratio
        if savings > 0.2: return 10
        elif savings > 0.1: return 5
        return 0
    
    def _calculate_activity_score(self, profile):
        activity_level = profile.mpesa_activity_level
        if activity_level == 'very_high': return 10
        elif activity_level == 'high': return 7
        elif activity_level == 'medium': return 4
        return 0
    
    def _calculate_loan_history_score(self, user):
        loan_count = user.loans.count()
        if loan_count > 5: return 10
        elif loan_count > 2: return 7
        elif loan_count > 0: return 4
        return 0
    
    def _calculate_default_penalty(self, user):
        default_rate = self._calculate_default_rate(user)
        if default_rate > 0.5: return -20
        elif default_rate > 0.3: return -15
        elif default_rate > 0.1: return -10
        elif default_rate > 0: return -5
        return 0
    
    def _calculate_rating_score(self, profile):
        rating = profile.customer_rating or 3.0
        if rating >= 4.5: return 10
        elif rating >= 4.0: return 7
        elif rating >= 3.5: return 4
        elif rating >= 3.0: return 2
        return 0
