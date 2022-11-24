from api import setting
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate



db =  SQLAlchemy()

print("init_run 運行")

def create_app():
    app = Flask(__name__)
    
    # Config
    app.config.from_object(setting.BaseConfig)
    # 初始化擴展
    db.init_app(app)
    CORS(app)
    Migrate(app,db)
    # Blueprint
    with app.app_context():
        from api.attractions.attractions import attractions
        app.register_blueprint(attractions, url_prefix="")
        from api.main.main import main
        app.register_blueprint(main, url_prefix="")
    return app