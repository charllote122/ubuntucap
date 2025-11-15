import os
from pathlib import Path
from decouple import config
from datetime import timedelta

BASE_DIR = Path(__file__).resolve().parent.parent.parent

SECRET_KEY = config('SECRET_KEY', default='django-insecure-ubuntucap-2024')

DEBUG = config('DEBUG', default=True, cast=bool)

ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1,.githubpreview.dev', cast=lambda v: [s.strip() for s in v.split(',')])

# Add apps to Python path
import sys
sys.path.insert(0, os.path.join(BASE_DIR, 'apps'))

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third party
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    
    # Local apps
    'apps.users',
    'apps.loans',
    'apps.ubuntucap',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'ubuntucap.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'ubuntucap.wsgi.application'

# Database - Let's use SQLite for now to avoid PostgreSQL issues
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Africa/Nairobi'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Custom user model
AUTH_USER_MODEL = 'users.User'

# REST Framework Configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
    ],
}

# JWT Settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': False,

    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': None,

    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
}

# CORS Settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://*.githubpreview.dev",
]

CORS_ALLOW_CREDENTIALS = True

# Logging Configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
        'apps.ubuntucap': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
    },
}

# ==============================================================================
# M-PESA DARAJA API CONFIGURATION
# ==============================================================================

# M-Pesa Environment (sandbox or production)
MPESA_ENVIRONMENT = config('MPESA_ENVIRONMENT', default='sandbox')

# M-Pesa API URLs
if MPESA_ENVIRONMENT == 'production':
    MPESA_BASE_URL = 'https://api.safaricom.co.ke'
else:
    MPESA_BASE_URL = 'https://sandbox.safaricom.co.ke'

# M-Pesa API Credentials (Sandbox - for development)
MPESA_CONSUMER_KEY = config('MPESA_CONSUMER_KEY', default='your_sandbox_consumer_key_here')
MPESA_CONSUMER_SECRET = config('MPESA_CONSUMER_SECRET', default='your_sandbox_consumer_secret_here')

# Business ShortCode (PayBill or Till Number)
MPESA_BUSINESS_SHORTCODE = config('MPESA_BUSINESS_SHORTCODE', default='174379')  # Sandbox test code

# Lipa Na M-Pesa Online Passkey
MPESA_PASSKEY = config('MPESA_PASSKEY', default='your_passkey_here')

# Transaction Type (for STK Push)
MPESA_TRANSACTION_TYPE = 'CustomerPayBillOnline'

# Callback URLs (Update these with your actual domain)
MPESA_CALLBACK_BASE_URL = config('MPESA_CALLBACK_BASE_URL', default='https://yourdomain.com')
MPESA_STK_CALLBACK_URL = f"{MPESA_CALLBACK_BASE_URL}/api/mpesa/stk-callback/"
MPESA_C2B_VALIDATE_URL = f"{MPESA_CALLBACK_BASE_URL}/api/mpesa/c2b-validate/"
MPESA_C2B_CONFIRMATION_URL = f"{MPESA_CALLBACK_BASE_URL}/api/mpesa/c2b-confirmation/"

# Account Balance API (if needed)
MPESA_ACCOUNT_BALANCE_CALLBACK_URL = f"{MPESA_CALLBACK_BASE_URL}/api/mpesa/balance-callback/"

# Transaction Status API
MPESA_TRANSACTION_STATUS_CALLBACK_URL = f"{MPESA_CALLBACK_BASE_URL}/api/mpesa/transaction-status-callback/"

# M-Pesa Timeout (in seconds)
MPESA_REQUEST_TIMEOUT = 30

# M-Pesa Security Configuration
MPESA_INITIATOR_NAME = config('MPESA_INITIATOR_NAME', default='testapi')
MPESA_INITIATOR_SECURITY_CREDENTIAL = config('MPESA_INITIATOR_SECURITY_CREDENTIAL', default='')

# ==============================================================================
# M-PESA TRANSACTION ANALYSIS CONFIGURATION
# ==============================================================================

# Credit Scoring Thresholds
MPESA_CREDIT_SCORE_THRESHOLDS = {
    'excellent': 80,
    'good': 70,
    'fair': 60,
    'poor': 50
}

# Transaction Volume Thresholds (KES)
MPESA_VOLUME_THRESHOLDS = {
    'very_high': 100000,    # 100K+
    'high': 50000,          # 50K - 100K
    'medium': 25000,        # 25K - 50K
    'low': 10000,           # 10K - 25K
    'very_low': 0           # 0 - 10K
}

# Transaction Frequency Thresholds (transactions per month)
MPESA_FREQUENCY_THRESHOLDS = {
    'very_high': 40,    # 40+ transactions/month
    'high': 25,         # 25-39 transactions/month
    'medium': 15,       # 15-24 transactions/month
    'low': 8,           # 8-14 transactions/month
    'very_low': 0       # 0-7 transactions/month
}

# Risk Assessment Weights
MPESA_RISK_WEIGHTS = {
    'transaction_volume': 0.35,
    'transaction_frequency': 0.25,
    'income_consistency': 0.20,
    'savings_ratio': 0.15,
    'business_age': 0.05
}

# Loan Qualification Criteria
MPESA_LOAN_QUALIFICATION = {
    'minimum_monthly_volume': 10000,      # KES 10,000
    'minimum_transaction_count': 8,       # 8 transactions/month
    'minimum_consistency_score': 0.4,     # 40% consistency
    'maximum_risk_indicators': 2,         # Max 2 risk factors
    'loan_to_volume_ratio': 0.3           # Max loan = 30% of monthly volume
}

# M-Pesa Transaction Types for Analysis
MPESA_TRANSACTION_CATEGORIES = {
    'income': ['receive_money', 'deposit'],
    'expenses': ['send_money', 'pay_bill', 'buy_goods', 'withdrawal'],
    'high_risk': ['withdrawal', 'send_money']  # Can indicate cash flow issues
}