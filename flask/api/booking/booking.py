from flask import Blueprint,render_template,request,jsonify
from api import db,bcrypt,jwt
from api.models.bookings_model import Booking
from api.models.attractions_model import Attraction
from api.models.members_model import Member
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    create_refresh_token, get_jwt_identity,unset_access_cookies,unset_refresh_cookies,set_access_cookies,set_refresh_cookies
)

booking = Blueprint("booking",
    __name__,
    static_folder='static',
    template_folder='templates')

@booking.route("/booking",methods=["GET"]) 
@jwt_required(refresh=True)
def frontPage():
    return render_template("booking.html")

@booking.route("/api/booking",methods=["GET"])
@jwt_required(fresh=True)
def getBookingData():
    try:
        booking_lists = []
        identity = get_jwt_identity()
        member_email =identity
        query_booking_lists = db.session.query(Booking, Attraction,Member). \
            select_from(Booking).join(Attraction).join(Member).filter(Booking.member_email==member_email).all()
        for booking, attraction, member in query_booking_lists:
            image_urls = []
            for image in attraction.images:
                image_urls.append(image.image_url)
            booking_data = {
                "data": {
                    "member":{
                        "name":member.name
                    },
                    "attraction": {
                        "id": attraction.id,
                        "name": attraction.name,
                        "address": attraction.address,
                        "image": image_urls
                    },
                    "date": booking.date,
                    "time": booking.time,
                    "price": booking.price
                }
            }
            booking_lists.append(booking_data)
        return jsonify(booking_lists)
    except Exception as ex:
        return jsonify(error="true",message=f"{ex}"),500

@booking.route("/api/booking",methods=["POST"])
@jwt_required(fresh=True)
def sendBookingData():
    try:
        data = request.get_json()
        attraction_id = data["attractionId"]
        date = data["date"]
        time = data["time"]
        price = data["price"]
        identity = get_jwt_identity()
        member_email =identity
        print("Booking Data:",data,member_email)
        # 存到資料庫
        filters = {"member_email" : member_email}
        result = Booking.query.filter_by(**filters).all()
        data = Booking(member_email, attraction_id, date, time, price)
        print(data)
        db.session.add(data)
        db.session.commit()
        return jsonify(ok="true"),200
    except Exception as ex:
        return jsonify(error="true",message=f"{ex}"),500

@booking.route("/api/booking",methods=["DELETE"])
def deleteBookingData():
    return "1"
