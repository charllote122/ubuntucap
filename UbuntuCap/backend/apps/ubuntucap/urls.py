from django.urls import path
from . import views

urlpatterns = [
    # Credit Scoring APIs
    path('score/predict/', views.CreditScoreAPI.as_view(), name='predict_credit_score'),
    path('score/train/', views.ModelTrainingAPI.as_view(), name='train_model'),
    path('score/model-info/', views.ModelTrainingAPI.as_view(), name='model_info'),
    path('score/quick-check/', views.quick_credit_check, name='quick_credit_check'),
    
    # Loan Application with ML Scoring
    path('loans/apply/', views.LoanApplicationAPI.as_view(), name='apply_loan_ml'),
]