from api.setting import config_dict
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
import os


db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()


def create_app():
    app = Flask(__name__)

    # Config
    configName = os.getenv("CONFIG_NAME", "development")
    app.config.from_object(config_dict[configName])
    # 初始化擴展
    db.init_app(app)
    bcrypt.init_app(app)
    CORS(app)
    jwt.init_app(app)
    # Blueprint
    with app.app_context():
        from api.main.main import main

        app.register_blueprint(main, url_prefix="")
        from api.members.members import members

        app.register_blueprint(members, url_prefix="")
        from api.attractions.attractions import attractions

        app.register_blueprint(attractions, url_prefix="")
        from api.booking.booking import booking

        app.register_blueprint(booking, url_prefix="")
        from api.orders.orders import orders

        app.register_blueprint(orders, url_prefix="")
    return app
