from .base import *

DEBUG = True

ALLOWED_HOSTS = ['*']

# Development-specific settings
INSTALLED_APPS += [
    'django_extensions',
]

# Email backend for development
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# CSRF settings for development
CSRF_TRUSTED_ORIGINS = [
    'https://humble-parakeet-7vprgxgxq7qxf79q-8001.app.github.dev',
    'http://localhost:8001',
    'https://localhost:8001',
]

# Cookie settings for development
CSRF_COOKIE_SECURE = False
SESSION_COOKIE_SECURE = False