import os 
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

class BaseConfig:
    # 防止隨意排序json格式資料
    JSON_SORT_KEYS = False
    JSON_AS_ASCII = False
    TEMPLATES_AUTO_RELOAD = True
    # SQL設定
    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI")
    SQLALCHEMY_ENGINE_OPTIONS = {
    "pool_pre_ping": True,
    "pool_recycle": 300,
    'pool_timeout': 900,
    'pool_size': 10,
    'max_overflow': 5,
    }  
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # session設定
    SECRET_KEY = os.getenv("SECRET_KEY")
    # JWT設定
    JWT_TOKEN_LOCATION = ['headers','cookies']
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=30)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=7)
    JWT_COOKIE_SECURE = False  # 開true要有https
    JWT_COOKIE_CSRF_PROTECT = False

