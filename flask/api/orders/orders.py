from flask import Flask,Blueprint,jsonify,request,render_template
from api import db,bcrypt,jwt
#from api.models.orders_model import 
from flask_jwt_extended import (JWTManager, jwt_required,)
import time
import re


orders = Blueprint("orders",
    __name__,
    static_folder='static',
    template_folder='templates')

@orders.route("api/orders",methods=["POST"])
@jwt_required(fresh=True)
def create_new_order():
    try:
        data = request.get_json()
        contact_email = data["order"]["contact"]["email"]
        contact_phone = data["order"]["contact"]["phone"]
        regex = r"^09[0-9]{8}$"
        if contact_email == "" or not bool(re.match(regex, contact_phone)):
            return jsonify(error="true", message="⚠ 信箱或密碼格式不正確"),400
        data_length = len(data["order"]["trip"])
        print(data_length)
        booking_id_list = []
        for i in range(data_length):
            booking_id = data["order"]["trip"][i]["attraction"]["bookingId"]
            booking_id_list.append(booking_id)
        print(booking_id_list)
        localtime = time.localtime()
        number = time.strftime("%Y%m%d%H%M%S",localtime)
        success = {
            "data":{
                "number": number,
                "payment":{
                    "status": 0,
                    "message": "付款成功"
                }
            }
        }
        return success
    except Exception as ex:
        return jsonify(error="true",message=f"{ex}"),500

@orders.route("api/orders/<orderNumber>",methods=["GET"])
@jwt_required(fresh=True)
def get_new_order(orderNumber):
    return "1"   