INSTALLED_APPS = [ ... 'apps.loans', ]

# Add this to your settings.py to load environment variables
import os
from dotenv import load_dotenv

load_dotenv()

# PesaPal Configuration
PESAPAL_CONSUMER_KEY = os.getenv('PESAPAL_CONSUMER_KEY', '')
PESAPAL_CONSUMER_SECRET = os.getenv('PESAPAL_CONSUMER_SECRET', '')

# PesaPal Configuration
PESAPAL_CONSUMER_KEY = os.getenv('PESAPAL_CONSUMER_KEY', '')
PESAPAL_CONSUMER_SECRET = os.getenv('PESAPAL_CONSUMER_SECRET', '')
