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
        self.scaler = None
        self.features = [
            'avg_monthly_volume',
            'transaction_consistency', 
            'business_age_months',
            'savings_ratio',
            'loan_history_count',
            'default_rate',
            'mpesa_activity_score',
            'customer_rating',
            'transaction_count_30d',
            'income_consistency_score', 
            'has_regular_income',
            'negative_balance_days'
        ]
        self.model_path = os.path.join(settings.BASE_DIR, 'ml_models', 'credit_model.pkl')
        self.scaler_path = os.path.join(settings.BASE_DIR, 'ml_models', 'scaler.pkl')
        self.load_model()
    
    def load_model(self):
        """Load pre-trained ML model or fallback to rule-based"""
        try:
            if os.path.exists(self.model_path) and os.path.exists(self.scaler_path):
                self.model = joblib.load(self.model_path)
                self.scaler = joblib.load(self.scaler_path)
                logger.info("✅ ML model loaded successfully")
            else:
                logger.info("⚠️ No trained ML model found. Using rule-based scoring.")
                self.model = None
                self.scaler = None
        except Exception as e:
            logger.error(f"Error loading ML model: {e}")
            self.model = None
            self.scaler = None
    
    def predict_credit_score(self, user):
        """Predict credit score using ML model or fallback to rule-based"""
        try:
            if self.model:
                # Use ML model prediction
                features = self._extract_features(user)
                feature_vector = np.array([list(features.values())])
                
                # Scale features if using linear model
                if hasattr(self.model, 'coef_'):
                    feature_vector = self.scaler.transform(feature_vector)
                
                ml_score = self.model.predict(feature_vector)[0]
                logger.info(f"🤖 ML prediction: {ml_score:.1f}")
                return max(0, min(100, ml_score))
            else:
                # Fallback to rule-based scoring
                return self._rule_based_scoring(user)
                
        except Exception as e:
            logger.error(f"ML prediction failed: {e}")
            return self._rule_based_scoring(user)
    
    def _extract_features(self, user):
        """Extract features for ML model with safe defaults for missing fields"""
        try:
            profile = user.profile
            
            # Safe feature extraction with defaults for missing fields
            features = {
                'avg_monthly_volume': float(getattr(profile, 'avg_monthly_volume', 0)),
                'transaction_consistency': getattr(profile, 'transaction_consistency', 0.5),
                'business_age_months': getattr(user, 'business_age_months', 0),
                'savings_ratio': getattr(profile, 'savings_ratio', 0),
                'loan_history_count': user.loans.count() if hasattr(user, 'loans') else 0,
                'default_rate': self._calculate_default_rate(user),
                'mpesa_activity_score': self._calculate_activity_score(profile),
                'customer_rating': getattr(profile, 'customer_rating', 3.0) or 3.0,
                'transaction_count_30d': getattr(profile, 'transaction_count_30d', 0),
                'income_consistency_score': getattr(profile, 'income_consistency_score', 0.5),
                'has_regular_income': 1 if getattr(profile, 'has_regular_income', False) else 0,
                'negative_balance_days': getattr(profile, 'negative_balance_days', 0)  # Safe default
            }
            
            return features
        except Exception as e:
            logger.error(f"Error extracting features: {e}")
            # Return safe defaults for all features
            return {feature: 0 for feature in self.features}
    
    def _calculate_default_rate(self, user):
        """Calculate user's default rate"""
        try:
            if not hasattr(user, 'loans'):
                return 0.0
            total_loans = user.loans.count()
            if total_loans == 0:
                return 0.0
            defaulted_loans = user.loans.filter(status='defaulted').count()
            return defaulted_loans / total_loans
        except:
            return 0.0
    
    def _calculate_activity_score(self, profile):
        """Calculate M-Pesa activity score"""
        activity_map = {
            'very_high': 0.9,
            'high': 0.7,
            'medium': 0.5,
            'low': 0.3
        }
        return activity_map.get(getattr(profile, 'mpesa_activity_level', 'medium'), 0.5)
    
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
            volume = float(getattr(profile, 'avg_monthly_volume', 0))
            if volume > 100000:
                score += 20
            elif volume > 50000:
                score += 15
            elif volume > 25000:
                score += 10
            elif volume > 10000:
                score += 5
            
            # Business age scoring (0-15 points)
            business_age = getattr(user, 'business_age_months', 0)
            if business_age > 24:
                score += 15
            elif business_age > 12:
                score += 10
            elif business_age > 6:
                score += 5
            
            # Transaction consistency (0-15 points)
            consistency = getattr(profile, 'transaction_consistency', 0)
            if consistency > 0.8:
                score += 15
            elif consistency > 0.6:
                score += 10
            elif consistency > 0.4:
                score += 5
            
            # Savings ratio (0-10 points)
            savings = getattr(profile, 'savings_ratio', 0)
            if savings > 0.2:
                score += 10
            elif savings > 0.1:
                score += 5
            
            # M-Pesa activity level (0-10 points)
            activity_level = getattr(profile, 'mpesa_activity_level', 'medium')
            if activity_level == 'very_high':
                score += 10
            elif activity_level == 'high':
                score += 7
            elif activity_level == 'medium':
                score += 4
            
            # Loan history (0-10 points)
            loan_count = user.loans.count() if hasattr(user, 'loans') else 0
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
            rating = getattr(profile, 'customer_rating', 3.0) or 3.0
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
            'activity_score': self._calculate_activity_score_points(profile),
            'loan_history_score': self._calculate_loan_history_score(user),
            'default_penalty': self._calculate_default_penalty(user),
            'rating_score': self._calculate_rating_score(profile)
        }
        
        total_score = sum(breakdown.values())
        breakdown['final_score'] = max(0, min(100, total_score))
        
        return breakdown
    
    def _calculate_volume_score(self, profile):
        volume = float(getattr(profile, 'avg_monthly_volume', 0))
        if volume > 100000: return 20
        elif volume > 50000: return 15
        elif volume > 25000: return 10
        elif volume > 10000: return 5
        return 0
    
    def _calculate_business_age_score(self, user):
        business_age = getattr(user, 'business_age_months', 0)
        if business_age > 24: return 15
        elif business_age > 12: return 10
        elif business_age > 6: return 5
        return 0
    
    def _calculate_consistency_score(self, profile):
        consistency = getattr(profile, 'transaction_consistency', 0)
        if consistency > 0.8: return 15
        elif consistency > 0.6: return 10
        elif consistency > 0.4: return 5
        return 0
    
    def _calculate_savings_score(self, profile):
        savings = getattr(profile, 'savings_ratio', 0)
        if savings > 0.2: return 10
        elif savings > 0.1: return 5
        return 0
    
    def _calculate_activity_score_points(self, profile):
        activity_level = getattr(profile, 'mpesa_activity_level', 'medium')
        if activity_level == 'very_high': return 10
        elif activity_level == 'high': return 7
        elif activity_level == 'medium': return 4
        return 0
    
    def _calculate_loan_history_score(self, user):
        if not hasattr(user, 'loans'):
            return 0
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
        rating = getattr(profile, 'customer_rating', 3.0) or 3.0
        if rating >= 4.5: return 10
        elif rating >= 4.0: return 7
        elif rating >= 3.5: return 4
        elif rating >= 3.0: return 2
        return 0
