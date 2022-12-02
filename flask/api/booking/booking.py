from flask import Blueprint,render_template,request,jsonify
from api import db,bcrypt,jwt
from api.models.bookings_model import Booking
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    create_refresh_token, get_jwt_identity,unset_access_cookies,unset_refresh_cookies,set_access_cookies,set_refresh_cookies
)

booking = Blueprint("booking",
    __name__,
    static_folder='static',
    template_folder='templates')

@booking.route("/booking",methods=["GET"])
def frontPage():
    return render_template("booking.html")

@booking.route("/api/booking",methods=["GET"])
@jwt_required(fresh=True)
def getBookingData():
    return "1"

@booking.route("/api/booking",methods=["POST"])
@jwt_required(fresh=True)
def sendBookingData():
    try:
        data = request.get_json()
        attractionId = data["attractionId"]
        date = data["date"]
        time = data["time"]
        price = data["price"]
        print("Booking Data:",data)
        # 存到資料庫
        if False:
            return jsonify(error="true",message="⚠ 建立失敗"),400
        return jsonify(ok="true"),200
    except Exception as ex:
        return jsonify(error="true",message=f"{ex}"),500

@booking.route("/api/booking",methods=["DELETE"])
def deleteBookingData():
    return "1"

