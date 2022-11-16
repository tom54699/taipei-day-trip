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
    'pool_size': 5,
    'max_overflow': 5,
}  
    # session設定
    SECRET_KEY = os.getenv("SECRET_KEY")
