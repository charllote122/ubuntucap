from django.urls import path
from . import views

urlpatterns = [
    path('', views.LoanApplicationViewSet.as_view({'get': 'list'}), name='loan-list'),
]
