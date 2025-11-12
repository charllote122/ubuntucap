from .base import *

DEBUG = True

ALLOWED_HOSTS = ['*']

# Development-specific settings
INSTALLED_APPS += [
    'django_extensions',
]

# Email backend for development
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
