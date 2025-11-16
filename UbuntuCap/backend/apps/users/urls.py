from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('', views.api_root, name='api-root'),
    path('register/', views.RegisterView.as_view(), name='auth-register'),
    path('login/', views.login_view, name='auth-login'),
    path('profile/', views.ProfileView.as_view(), name='auth-profile'),
    path('profile/details/', views.UserProfileView.as_view(), name='user-profile'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
]