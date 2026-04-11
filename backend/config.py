import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'default_secret_key')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'default_jwt_secret_key')
    
    # DB configuration
    DB_USER = os.environ.get('DB_USERNAME', 'root')
    DB_PASSWORD = os.environ.get('DB_PASSWORD', '')
    DB_HOST = os.environ.get('DB_HOST', '127.0.0.1')
    DB_NAME = os.environ.get('DB_NAME', 'expense_tracker_db')
    
    import urllib.parse
    DB_PASSWORD_ENCODED = urllib.parse.quote_plus(DB_PASSWORD)
    SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD_ENCODED}@{DB_HOST}/{DB_NAME}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # DB configuration