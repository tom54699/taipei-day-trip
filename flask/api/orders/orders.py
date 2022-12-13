from flask import Flask,Blueprint,jsonify,request,render_template
from api import db,bcrypt,jwt
from api.models.bookings_model import Booking
from api.models.attractions_model import Attraction
from api.models.members_model import Member
from api.models.orders_model import Orders
from flask_jwt_extended import (JWTManager, jwt_required,get_jwt_identity)
import time
import re
import os 
from dotenv import load_dotenv
import requests

load_dotenv()


orders = Blueprint("orders",
    __name__,
    static_folder='static',
    template_folder='templates')

@orders.route("api/orders",methods=["POST"])
@jwt_required(fresh=True)
def create_new_order():
    try:
        identity = get_jwt_identity()
        member_email =identity
        data = request.get_json()
        contact_email = data["order"]["contact"]["email"]
        contact_phone = data["order"]["contact"]["phone"]
        contact_name = data["order"]["contact"]["name"]
        order_price = data["order"]["price"]
        regex = r"^09[0-9]{8}$"
        if contact_email == "" or not bool(re.match(regex, contact_phone)):
            return jsonify(error="true", message="⚠ 信箱或密碼格式不正確"),400
        data_length = len(data["order"]["trip"])
        booking_id_list = []
        for i in range(data_length):
            booking_id = data["order"]["trip"][i]["attraction"]["bookingId"]
            booking_id_list.append(booking_id)
            # 要用join處理
            query_order_number = Booking.query.filter(Booking.id == booking_id_list[i], Booking.order_number != None).all()
            result = len(query_order_number)
            if result != 0:
                return jsonify(error="true",message="⚠ 請勿重複付款"),400
        
        order_data = {
            "prime": data["prime"],
            "partner_key": os.getenv("PARTNER_KEY"),
            "merchant_id": os.getenv("MERCHANT_ID"),
            "details":"TaiPei Day Trip Booking",
            "amount": order_price,
            "cardholder": {
                "phone_number": contact_phone,
                "name": contact_name,
                "email": contact_email,
            }
        }
        headers = {
            "Content-Type": "application/json",
            "x-api-key": os.getenv("PARTNER_KEY")
        }
        url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
        req = requests.post(url,headers=headers,json=order_data,timeout=30)
        status_code = req.json()["status"]
        if status_code == 0:
            localtime = time.localtime()
            number = time.strftime("%Y%m%d%H%M%S",localtime)
            success = {
                "data":{
                    "number": number,
                    "payment":{
                        "status": status_code,
                        "message": "付款成功"
                    }
                }
            }
            order_upload_data = Orders(number, member_email, contact_name, contact_email, contact_phone, order_price)
            db.session.add(order_upload_data)
            db.session.commit()
            for i in range(data_length):
                booking_upload_data = Booking.query.filter_by(id=booking_id_list[i]).update({"order_number":number})
                db.session.commit()
            return success,200
        else:
            return jsonify(error="true",message=req.json()["msg"])
    except Exception as ex:
        return jsonify(error="true",message=f"{ex}"),500

    

@orders.route("api/orders/<orderNumber>",methods=["GET"])
@jwt_required(fresh=True)
def get_new_order(orderNumber):
    try:
        trip_lists = []
        query_booking_lists = db.session.query(Orders,Booking, Attraction). \
            select_from(Orders).join(Booking).join(Attraction).filter(Orders.order_number == orderNumber).all()
        if len(query_booking_lists) == 0:
            return jsonify(error="true",message="沒有此訂單編號"),400
        for orders, booking ,attraction in query_booking_lists:
            image_urls = []
            for image in attraction.images:
                image_urls.append(image.image_url)
            orders_query_data = { 
                "data": {
                    "number": orders.order_number,
                    "price": orders.price,
                    "trip":trip_lists,
                    "contact": {
                        "name": orders.contact_name,
                        "email": orders.contact_email,
                        "phone": orders.contact_phone
                    },
                    "status": 1
                }
            }
            trip = {
                "attraction": {
                    "id": attraction.id,
                    "name": attraction.name,
                    "address": attraction.address,
                    "image": image_urls
                },
                "date": booking.date,
                "time": booking.time
            }
            trip_lists.append(trip)
        return orders_query_data   
    except Exception as ex:
        return jsonify(error="true",message=f"{ex}"),500