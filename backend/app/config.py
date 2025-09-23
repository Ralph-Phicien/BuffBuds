import os
from dotenv import load_dotenv

load_dotenv()

# parent class
class Config:
    DEBUG = False
    TESTING = False
    ENV = 'production'
    SECRET_KEY = 'password'
    
    # api keys (enviornment variables)
    SUPABASE_URL = os.environ.get('SUPABASE_URL', '')
    SUPABASE_KEY = os.environ.get('SUPABASE_KEY', '')
    API_NINJAS_KEY = os.environ.get('API_NINJAS_KEY', '')

# subclasses
class DevelopmentConfig(Config):
    DEBUG = True
    ENV = 'development'
    SECRET_KEY = 'password'

class ProductionConfig(Config):
    DEBUG = False
    ENV = 'production'
    SECRET_KEY = 'password'