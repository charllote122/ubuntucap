import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingClassifier, GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, mean_squared_error
import joblib
import os
from django.conf import settings
import xgboost as xgb
from datetime import datetime
import json

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
        self.model_path = os.path.join(settings.BASE_DIR, 'ml_engine/models/gradient_boosting_model.pkl')
        self.load_model()
    
    def load_model(self):
        """Load pre-trained Gradient Boosting model or initialize new one"""
        try:
            if os.path.exists(self.model_path):
                self.model = joblib.load(self.model_path)
                print("✓ Gradient Boosting model loaded successfully")
            else:
                print("⚠ No pre-trained model found. Initialize with fit() method.")
                self.model = None
        except Exception as e:
            print(f"⚠ Error loading model: {e}")
            self.model = None
    
    def prepare_training_data(self, users):
        """Prepare training data from user records"""
        features_list = []
        targets = []
        
        for user in users:
            try:
                profile = user.profile
                
                # Feature engineering
                features = {
                    'avg_monthly_volume': float(profile.avg_monthly_volume),
                    'transaction_consistency': profile.transaction_consistency,
                    'business_age_months': user.business_age_months,
                    'savings_ratio': profile.savings_ratio,
                    'loan_history_count': user.loans.count(),
                    'default_rate': self._calculate_default_rate(user),
                    'mpesa_activity_score': self._calculate_mpesa_score(user),
                    'customer_rating': profile.customer_rating or 3.0
                }
                
                # Convert to feature vector
                feature_vector = [features[feature] for feature in self.features]
                features_list.append(feature_vector)
                
                # Target variable (1 = good credit, 0 = bad credit)
                target = 1 if self._is_good_borrower(user) else 0
                targets.append(target)
                
            except Exception as e:
                print(f"⚠ Skipping user {user.id}: {e}")
                continue
        
        return np.array(features_list), np.array(targets)
    
    def fit(self, users, use_xgboost=True):
        """Train Gradient Boosting model on user data"""
        try:
            X, y = self.prepare_training_data(users)
            
            if len(X) == 0:
                print("⚠ No training data available")
                return False
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42, stratify=y
            )
            
            if use_xgboost:
                # Use XGBoost (Extreme Gradient Boosting)
                self.model = xgb.XGBClassifier(
                    n_estimators=100,
                    max_depth=6,
                    learning_rate=0.1,
                    subsample=0.8,
                    colsample_bytree=0.8,
                    reg_alpha=0.1,
                    reg_lambda=0.1,
                    random_state=42,
                    eval_metric='logloss'
                )
                model_name = "XGBoost"
            else:
                # Use scikit-learn's Gradient Boosting
                self.model = GradientBoostingClassifier(
                    n_estimators=100,
                    max_depth=5,
                    learning_rate=0.1,
                    subsample=0.8,
                    random_state=42
                )
                model_name = "GradientBoosting"
            
            # Train model
            self.model.fit(X_train, y_train)
            
            # Evaluate
            train_score = self.model.score(X_train, y_train)
            test_score = self.model.score(X_test, y_test)
            
            print(f"✓ {model_name} model trained successfully")
            print(f"  Training Accuracy: {train_score:.3f}")
            print(f"  Test Accuracy: {test_score:.3f}")
            
            # Save model
            os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
            joblib.dump(self.model, self.model_path)
            print(f"✓ Model saved to {self.model_path}")
            
            return True
            
        except Exception as e:
            print(f"⚠ Error training model: {e}")
            return False
    
    def predict_credit_score(self, user):
        """Predict credit score using Gradient Boosting (0-100 scale)"""
        try:
            if self.model is None:
                print("⚠ No trained model available, using rule-based scoring")
                return self._rule_based_scoring(user)
            
            # Prepare features
            features = self._extract_features(user)
            feature_vector = np.array([features[feature] for feature in self.features]).reshape(1, -1)
            
            # Get probability of being good borrower
            probability = self.model.predict_proba(feature_vector)[0][1]
            
            # Convert to 0-100 score
            ml_score = probability * 100
            
            # Blend with rule-based score for robustness
            rule_score = self._rule_based_scoring(user)
            
            # Weighted average (70% ML, 30% rule-based)
            final_score = 0.7 * ml_score + 0.3 * rule_score
            
            return max(0, min(100, final_score))
            
        except Exception as e:
            print(f"⚠ ML prediction failed, using rule-based: {e}")
            return self._rule_based_scoring(user)
    
    def predict_credit_risk(self, user):
        """Predict credit risk category"""
        score = self.predict_credit_score(user)
        
        if score >= 80:
            return "low", "Excellent credit profile"
        elif score >= 60:
            return "medium", "Good credit profile"
        elif score >= 40:
            return "medium_high", "Acceptable credit profile"
        else:
            return "high", "High risk profile"
    
    def get_feature_importance(self):
        """Get feature importance from trained model"""
        if self.model is None:
            return None
        
        try:
            if hasattr(self.model, 'feature_importances_'):
                importance = self.model.feature_importances_
            elif hasattr(self.model, 'get_booster'):
                importance = self.model.get_booster().get_score(importance_type='weight')
            else:
                return None
            
            feature_importance = dict(zip(self.features, importance))
            return dict(sorted(feature_importance.items(), key=lambda x: x[1], reverse=True))
            
        except Exception as e:
            print(f"⚠ Error getting feature importance: {e}")
            return None
    
    def _extract_features(self, user):
        """Extract features from user object"""
        try:
            profile = user.profile
            
            return {
                'avg_monthly_volume': float(profile.avg_monthly_volume),
                'transaction_consistency': profile.transaction_consistency,
                'business_age_months': user.business_age_months,
                'savings_ratio': profile.savings_ratio,
                'loan_history_count': user.loans.count(),
                'default_rate': self._calculate_default_rate(user),
                'mpesa_activity_score': self._calculate_mpesa_score(user),
                'customer_rating': profile.customer_rating or 3.0
            }
        except Exception as e:
            print(f"⚠ Error extracting features: {e}")
            # Return default features
            return {feature: 0 for feature in self.features}
    
    def _calculate_default_rate(self, user):
        """Calculate loan default rate"""
        try:
            total_loans = user.loans.count()
            if total_loans == 0:
                return 0.0
            
            defaulted_loans = user.loans.filter(status='defaulted').count()
            return defaulted_loans / total_loans
        except:
            return 0.0
    
    def _calculate_mpesa_score(self, user):
        """Calculate M-Pesa activity score (0-10)"""
        try:
            profile = user.profile
            volume_score = min(10, profile.avg_monthly_volume / 5000)  # Normalize
            consistency_score = profile.transaction_consistency * 10
            return (volume_score + consistency_score) / 2
        except:
            return 5.0
    
    def _is_good_borrower(self, user):
        """Determine if user is a good borrower (for training labels)"""
        try:
            # Define "good borrower" criteria
            has_low_defaults = self._calculate_default_rate(user) < 0.1
            has_sufficient_volume = user.profile.avg_monthly_volume > 5000
            has_business_history = user.business_age_months > 6
            
            return has_low_defaults and has_sufficient_volume and has_business_history
        except:
            return False
    
    def _rule_based_scoring(self, user):
        """Enhanced rule-based scoring as fallback"""
        try:
            profile = user.profile
            score = 50  # Base score
            
            # Monthly volume scoring (0-20 points)
            volume = float(profile.avg_monthly_volume)
            if volume > 50000:
                score += 20
            elif volume > 20000:
                score += 15
            elif volume > 10000:
                score += 10
            elif volume > 5000:
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
            
            # Loan history (0-10 points)
            loan_count = user.loans.count()
            if loan_count > 0:
                default_rate = self._calculate_default_rate(user)
                if default_rate < 0.1:
                    score += 10
                elif default_rate < 0.2:
                    score += 5
            
            return max(0, min(100, score))
            
        except Exception as e:
            print(f"⚠ Rule-based scoring failed: {e}")
            return self._basic_fallback_score(user)
    
    def _basic_fallback_score(self, user):
        """Very basic fallback scoring"""
        try:
            score = 50
            if user.business_age_months > 12:
                score += 20
            elif user.business_age_months > 6:
                score += 10
            return score
        except:
            return 50  # Absolute minimum fallback