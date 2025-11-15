import pandas as pd
import numpy as np
import joblib
import json
from datetime import datetime, timedelta
from django.conf import settings
from django.utils import timezone
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import logging
import os

logger = logging.getLogger(__name__)

class MLModelTrainer:
    def __init__(self):
        # Get BASE_DIR safely - handle both Django and standalone usage
        try:
            self.models_dir = os.path.join(settings.BASE_DIR, 'ml_models')
            self.data_dir = os.path.join(settings.BASE_DIR, 'ml_engine', 'data')
        except AttributeError:
            # Fallback for standalone usage
            current_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            self.models_dir = os.path.join(current_dir, 'ml_models')
            self.data_dir = os.path.join(current_dir, 'ml_engine', 'data')
        
        os.makedirs(self.models_dir, exist_ok=True)
        os.makedirs(self.data_dir, exist_ok=True)
        
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
        
        self.target = 'credit_score'
        
    def collect_training_data(self):
        """Collect and prepare training data from the database"""
        try:
            from apps.users.models import User, UserProfile
            from apps.loans.models import Loan, LoanApplication
            
            logger.info("📊 Collecting training data from database...")
            
            users = User.objects.all()
            training_data = []
            
            for user in users:
                try:
                    profile = user.profile
                    
                    # Calculate actual performance metrics
                    performance_score = self._calculate_actual_performance(user)
                    
                    features = {
                        'avg_monthly_volume': float(profile.avg_monthly_volume),
                        'transaction_consistency': profile.transaction_consistency,
                        'business_age_months': user.business_age_months,
                        'savings_ratio': profile.savings_ratio,
                        'loan_history_count': user.loans.count(),
                        'default_rate': self._calculate_default_rate(user),
                        'mpesa_activity_score': self._calculate_activity_score(profile),
                        'customer_rating': profile.customer_rating or 3.0,
                        'transaction_count_30d': profile.transaction_count_30d,
                        'income_consistency_score': profile.income_consistency_score,
                        'has_regular_income': 1 if profile.has_regular_income else 0,
                        'negative_balance_days': profile.negative_balance_days,
                        'credit_score': performance_score
                    }
                    
                    training_data.append(features)
                    
                except Exception as e:
                    logger.warning(f"Could not process user {user.id}: {e}")
                    continue
            
            # Convert to DataFrame
            df = pd.DataFrame(training_data)
            
            # Save raw data
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            df.to_csv(os.path.join(self.data_dir, f'training_data_{timestamp}.csv'), index=False)
            
            logger.info(f"✅ Collected {len(df)} training samples")
            return df
            
        except Exception as e:
            logger.error(f"❌ Error collecting training data: {e}")
            return pd.DataFrame()
    
    def generate_synthetic_data(self, num_samples=1000):
        """Generate synthetic training data for development"""
        logger.info(f"🤖 Generating {num_samples} synthetic training samples...")
        
        np.random.seed(42)
        
        synthetic_data = []
        for i in range(num_samples):
            # Realistic feature distributions based on Kenyan SME data
            avg_monthly_volume = np.random.lognormal(9, 1.2)
            transaction_consistency = np.random.beta(2, 2)
            business_age_months = np.random.randint(1, 60)
            savings_ratio = np.random.beta(2, 5)
            loan_history_count = np.random.poisson(1.5)
            default_rate = np.random.beta(1, 9)
            mpesa_activity_score = np.random.beta(3, 2)
            customer_rating = np.random.normal(3.8, 0.5)
            transaction_count_30d = np.random.poisson(20)
            income_consistency = np.random.beta(3, 2)
            has_regular_income = np.random.choice([0, 1], p=[0.3, 0.7])
            negative_balance_days = np.random.poisson(2)
            
            # Calculate realistic credit score based on features
            base_score = 50
            
            # Positive factors
            if avg_monthly_volume > 30000:
                base_score += 15
            elif avg_monthly_volume > 15000:
                base_score += 10
            elif avg_monthly_volume > 5000:
                base_score += 5
                
            if business_age_months > 24:
                base_score += 10
            elif business_age_months > 12:
                base_score += 7
            elif business_age_months > 6:
                base_score += 3
                
            if transaction_consistency > 0.7:
                base_score += 8
            elif transaction_consistency > 0.5:
                base_score += 4
                
            if savings_ratio > 0.1:
                base_score += 5
                
            if customer_rating > 4.0:
                base_score += 7
            elif customer_rating > 3.5:
                base_score += 3
                
            # Negative factors
            if default_rate > 0.3:
                base_score -= 20
            elif default_rate > 0.1:
                base_score -= 10
                
            if negative_balance_days > 7:
                base_score -= 8
            elif negative_balance_days > 3:
                base_score -= 4
                
            # Add some noise
            base_score += np.random.normal(0, 3)
            
            # Ensure score is between 0-100
            credit_score = max(0, min(100, base_score))
            
            synthetic_data.append({
                'avg_monthly_volume': avg_monthly_volume,
                'transaction_consistency': transaction_consistency,
                'business_age_months': business_age_months,
                'savings_ratio': savings_ratio,
                'loan_history_count': loan_history_count,
                'default_rate': default_rate,
                'mpesa_activity_score': mpesa_activity_score,
                'customer_rating': customer_rating,
                'transaction_count_30d': transaction_count_30d,
                'income_consistency_score': income_consistency,
                'has_regular_income': has_regular_income,
                'negative_balance_days': negative_balance_days,
                'credit_score': credit_score
            })
        
        df = pd.DataFrame(synthetic_data)
        
        # Save synthetic data
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        df.to_csv(os.path.join(self.data_dir, f'synthetic_data_{timestamp}.csv'), index=False)
        
        logger.info(f"✅ Generated {len(df)} synthetic samples")
        return df
    
    def train_models(self, use_synthetic=True):
        """Train multiple ML models and select the best one"""
        try:
            # Collect or generate data
            if use_synthetic:
                df = self.generate_synthetic_data(1000)
            else:
                df = self.collect_training_data()
                
            if df.empty:
                logger.error("❌ No training data available")
                return None
            
            # Prepare features and target
            X = df[self.features]
            y = df[self.target]
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            # Scale features
            scaler = StandardScaler()
            X_train_scaled = scaler.fit_transform(X_train)
            X_test_scaled = scaler.transform(X_test)
            
            # Define models to try
            models = {
                'random_forest': RandomForestRegressor(n_estimators=100, random_state=42),
                'gradient_boosting': GradientBoostingRegressor(n_estimators=100, random_state=42),
                'linear_regression': LinearRegression()
            }
            
            best_model = None
            best_score = -np.inf
            best_model_name = None
            results = {}
            
            logger.info("🏋️ Training multiple models...")
            
            for name, model in models.items():
                # Train model
                if name == 'linear_regression':
                    model.fit(X_train_scaled, y_train)
                    y_pred = model.predict(X_test_scaled)
                else:
                    model.fit(X_train, y_train)
                    y_pred = model.predict(X_test)
                
                # Evaluate
                mae = mean_absolute_error(y_test, y_pred)
                mse = mean_squared_error(y_test, y_pred)
                r2 = r2_score(y_test, y_pred)
                
                # Cross-validation
                cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='r2')
                
                results[name] = {
                    'mae': mae,
                    'mse': mse,
                    'r2': r2,
                    'cv_mean': cv_scores.mean(),
                    'cv_std': cv_scores.std()
                }
                
                logger.info(f"   {name.upper():<20} R²: {r2:.3f} | MAE: {mae:.2f} | CV: {cv_scores.mean():.3f} ± {cv_scores.std():.3f}")
                
                # Track best model
                if r2 > best_score:
                    best_score = r2
                    best_model = model
                    best_model_name = name
            
            # Save the best model
            if best_model:
                model_path = os.path.join(self.models_dir, 'credit_model.pkl')
                scaler_path = os.path.join(self.models_dir, 'scaler.pkl')
                
                joblib.dump(best_model, model_path)
                joblib.dump(scaler, scaler_path)
                
                # Save model metadata
                metadata = {
                    'model_name': best_model_name,
                    'training_date': datetime.now().isoformat(),
                    'features': self.features,
                    'performance': results[best_model_name],
                    'dataset_size': len(df),
                    'use_synthetic': use_synthetic
                }
                
                with open(os.path.join(self.models_dir, 'model_metadata.json'), 'w') as f:
                    json.dump(metadata, f, indent=2)
                
                logger.info(f"✅ Best model: {best_model_name} (R²: {best_score:.3f})")
                logger.info(f"💾 Model saved to: {model_path}")
                
                return {
                    'best_model': best_model_name,
                    'best_score': best_score,
                    'results': results,
                    'model_path': model_path
                }
            else:
                logger.error("❌ No model trained successfully")
                return None
                
        except Exception as e:
            logger.error(f"❌ Model training failed: {e}")
            return None
    
    def evaluate_model(self, model_path=None):
        """Evaluate the trained model"""
        try:
            if model_path is None:
                model_path = os.path.join(self.models_dir, 'credit_model.pkl')
            
            if not os.path.exists(model_path):
                logger.error("❌ Model file not found")
                return None
            
            # Load model and metadata
            model = joblib.load(model_path)
            scaler = joblib.load(os.path.join(self.models_dir, 'scaler.pkl'))
            
            # Generate test data
            test_df = self.generate_synthetic_data(200)
            X_test = test_df[self.features]
            y_test = test_df[self.target]
            
            # Predict
            if hasattr(model, 'feature_importances_'):
                y_pred = model.predict(X_test)
            else:
                X_test_scaled = scaler.transform(X_test)
                y_pred = model.predict(X_test_scaled)
            
            # Calculate metrics
            mae = mean_absolute_error(y_test, y_pred)
            mse = mean_squared_error(y_test, y_pred)
            r2 = r2_score(y_test, y_pred)
            
            # Feature importance (if available)
            feature_importance = {}
            if hasattr(model, 'feature_importances_'):
                importance = model.feature_importances_
                for i, feature in enumerate(self.features):
                    feature_importance[feature] = importance[i]
            
            evaluation = {
                'mae': mae,
                'mse': mse,
                'r2': r2,
                'feature_importance': feature_importance,
                'test_samples': len(test_df)
            }
            
            logger.info(f"�� Model Evaluation:")
            logger.info(f"   R² Score: {r2:.3f}")
            logger.info(f"   MAE: {mae:.2f}")
            logger.info(f"   MSE: {mse:.2f}")
            
            if feature_importance:
                logger.info("   Feature Importance:")
                for feature, importance in sorted(feature_importance.items(), key=lambda x: x[1], reverse=True)[:5]:
                    logger.info(f"     {feature}: {importance:.3f}")
            
            return evaluation
            
        except Exception as e:
            logger.error(f"❌ Model evaluation failed: {e}")
            return None
    
    def _calculate_actual_performance(self, user):
        """Calculate actual credit performance"""
        from apps.ubuntucap.ml_engine.credit_scorer import CreditScoringModel
        scorer = CreditScoringModel()
        return scorer.predict_credit_score(user)
    
    def _calculate_default_rate(self, user):
        """Calculate user's actual default rate"""
        try:
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
        return activity_map.get(profile.mpesa_activity_level, 0.5)
