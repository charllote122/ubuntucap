import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib
import os
from django.conf import settings

class CreditScoringModel:
    def __init__(self):
        self.model = None
        self.features = [
            'avg_monthly_volume',
            'transaction_consistency', 
            'business_age_months',
            'savings_ratio'
        ]
    
    def calculate_user_score(self, user):
        """Calculate credit score for a user (0-100)"""
        try:
            profile = user.profile
            
            # Prepare features
            user_features = {
                'avg_monthly_volume': float(profile.avg_monthly_volume),
                'transaction_consistency': profile.transaction_consistency,
                'business_age_months': user.business_age_months,
                'savings_ratio': profile.savings_ratio,
            }
            
            # Use rule-based scoring as fallback
            score = self._rule_based_scoring(user_features)
            
            return max(0, min(100, score))
            
        except Exception as e:
            # Fallback to basic scoring if ML fails
            return self._basic_fallback_score(user)
    
    def _rule_based_scoring(self, features):
        """Rule-based credit scoring"""
        score = 50  # Base score
        
        # Monthly volume scoring
        if features['avg_monthly_volume'] > 50000:
            score += 20
        elif features['avg_monthly_volume'] > 20000:
            score += 15
        elif features['avg_monthly_volume'] > 10000:
            score += 10
        elif features['avg_monthly_volume'] > 5000:
            score += 5
        
        # Business age scoring
        if features['business_age_months'] > 24:
            score += 15
        elif features['business_age_months'] > 12:
            score += 10
        elif features['business_age_months'] > 6:
            score += 5
        
        # Transaction consistency
        if features['transaction_consistency'] > 0.8:
            score += 15
        elif features['transaction_consistency'] > 0.6:
            score += 10
        elif features['transaction_consistency'] > 0.4:
            score += 5
        
        return score
    
    def _basic_fallback_score(self, user):
        """Very basic fallback scoring"""
        score = 50
        
        if user.business_age_months > 12:
            score += 20
        elif user.business_age_months > 6:
            score += 10
        
        return score