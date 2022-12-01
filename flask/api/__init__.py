from api import setting
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager


db =  SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()
print("init_run 運行")

def create_app():
    app = Flask(__name__)
    
    # Config
    app.config.from_object(setting.BaseConfig)
    # 初始化擴展
    db.init_app(app)
    bcrypt.init_app(app)
    CORS(app)
    jwt.init_app(app)
    # Blueprint
    with app.app_context():
        from api.attractions.attractions import attractions
        app.register_blueprint(attractions, url_prefix="")
        from api.main.main import main
        app.register_blueprint(main, url_prefix="")
        from api.members.members import members
        app.register_blueprint(members, url_prefix="")
        from api.booking.booking import booking
        app.register_blueprint(booking, url_prefix="")
        
    return app