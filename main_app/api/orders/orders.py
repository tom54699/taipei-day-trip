from flask import Blueprint, jsonify, request
from api.models.bookings_model import Booking
from api.models.orders_model import Orders
from flask_jwt_extended import jwt_required, get_jwt_identity
import time
from api.utils.utils import check_email_regex, check_phone_regex
import os
from dotenv import load_dotenv
import requests

load_dotenv()


orders = Blueprint("orders", __name__, static_folder="static", template_folder="templates")


@orders.route("api/orders", methods=["POST"])
@jwt_required(fresh=True)
def create_new_order():
    try:
        member_email = get_jwt_identity()
        data = request.get_json()
        contact_email = data["order"]["contact"]["email"]
        contact_phone = data["order"]["contact"]["phone"]
        contact_name = data["order"]["contact"]["name"]
        order_price = data["order"]["price"]
        phone_regex_result = check_phone_regex(contact_phone)
        mail_regex_result = check_email_regex(contact_email)
        if not mail_regex_result or not phone_regex_result:
            return jsonify(error="true", message="⚠ 信箱或密碼格式不正確"), 400
        data_length = len(data["order"]["trip"])
        booking_id_list = []
        for i in range(data_length):
            booking_id = data["order"]["trip"][i]["attraction"]["bookingId"]
            booking_id_list.append(booking_id)
            query_order_number = Booking.get_payed_bookingId(booking_id_list[i], member_email)
            result = len(query_order_number)
            if result != 0:
                return jsonify(error="true", message="⚠ 請勿重複付款"), 400

        order_data = {
            "prime": data["prime"],
            "partner_key": os.getenv("PARTNER_KEY"),
            "merchant_id": os.getenv("MERCHANT_ID"),
            "details": "TaiPei Day Trip Booking",
            "amount": order_price,
            "cardholder": {
                "phone_number": contact_phone,
                "name": contact_name,
                "email": contact_email,
            },
        }
        headers = {
            "Content-Type": "application/json",
            "x-api-key": os.getenv("PARTNER_KEY"),
        }
        url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
        req = requests.post(url, headers=headers, json=order_data, timeout=30)
        status_code = req.json()["status"]
        if status_code == 0:
            localtime = time.localtime()
            number = time.strftime("%Y%m%d%H%M%S", localtime)
            success = {
                "data": {
                    "number": number,
                    "payment": {"status": status_code, "message": "付款成功"},
                }
            }
            Orders.build_new_order_data(
                number,
                member_email,
                contact_name,
                contact_email,
                contact_phone,
                order_price,
            )
            for i in range(data_length):
                Booking.update_booking_order_number(booking_id_list[i], member_email, number)
            return success, 200
        else:
            return jsonify(error="true", message=req.json()["msg"])
    except Exception as ex:
        return jsonify(error="true", message=f"{ex}"), 500


@orders.route("api/orders/<orderNumber>", methods=["GET"])
@jwt_required(fresh=True)
def get_new_order(orderNumber):
    try:
        orders_query_data = Booking.get_order_data_by_id(orderNumber)
        if orders_query_data == "no_data":
            return jsonify(error="true", message="沒有此訂單編號"), 400
        return orders_query_data
    except Exception as ex:
        return jsonify(error="true", message=f"{ex}"), 500
