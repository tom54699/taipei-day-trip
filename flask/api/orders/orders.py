from flask import Flask,Blueprint,jsonify,request,render_template
from api import db,bcrypt,jwt
#from api.models.orders_model import 
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,get_jwt,
    create_refresh_token, get_jwt_identity,unset_access_cookies,unset_refresh_cookies,set_access_cookies,set_refresh_cookies,
)


orders = Blueprint("orders",
    __name__,
    static_folder='static',
    template_folder='templates')

@orders.route("api/orders",methods=["POST"])
@jwt_required(fresh=True)
def create_new_order():
    return "1"

@orders.route("api/orders/<orderNumber>",methods=["GET"])
@jwt_required(fresh=True)
def get_new_order(orderNumber):
    return "1"   