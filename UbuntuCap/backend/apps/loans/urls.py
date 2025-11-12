from django.urls import path
from . import views

urlpatterns = [
    # Customer endpoints
    path('apply/', views.apply_for_loan, name='apply-loan'),
    path('my-applications/', views.my_loan_applications, name='my-applications'),
    path('my-loans/', views.my_active_loans, name='my-loans'),
    path('applications/<uuid:application_id>/', views.loan_application_detail, name='application-detail'),
    
    # Admin endpoints
    path('admin/pending-applications/', views.pending_applications, name='pending-applications'),
    path('admin/applications/<uuid:application_id>/review/', views.review_application, name='review-application'),
]