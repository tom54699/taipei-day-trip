from flask import Blueprint, render_template, request, jsonify
from api.models.bookings_model import Booking
from api.models.members_model import Member
from flask_jwt_extended import jwt_required, get_jwt_identity

booking = Blueprint("booking", __name__, static_folder="static", template_folder="templates")


@booking.route("/booking", methods=["GET"])
def frontPage():
    return render_template("booking.html")


@booking.route("/api/booking", methods=["GET"])
@jwt_required(fresh=True)
def getBookingData():
    try:
        member_email = get_jwt_identity()
        booking_lists = Member.get_not_pay_booking_data(member_email)
        if booking_lists == "no_data":
            query = Member.get_member_auth_data(member_email)
            return jsonify(status="noData", name=query["data"]["name"])
        return jsonify(booking_lists)
    except Exception as ex:
        return jsonify(error="true", message=f"{ex}"), 500


@booking.route("/api/booking", methods=["POST"])
@jwt_required(fresh=True)
def sendBookingData():
    try:
        data = request.get_json()
        member_email = get_jwt_identity()
        result = Booking.check_booking_data_by_time(data, member_email)
        if len(result) >= 1:
            return jsonify(error="true", message="⚠ 已在這個時段預約行程"), 400

        Booking.build_new_booking_data(data, member_email)
        return jsonify(ok="true"), 200
    except Exception as ex:
        return jsonify(error="true", message=f"{ex}"), 500


@booking.route("/api/booking", methods=["DELETE"])
@jwt_required(fresh=True)
def deleteBookingData():
    try:
        data = request.get_json()
        member_email = get_jwt_identity()
        query = Booking.delete_booking_data_by_bookingId(data, member_email)
        return jsonify(ok="true")
    except Exception as ex:
        return jsonify(error="true", message=f"{ex}"), 500
