from flask import Blueprint,render_template
from api.models.bookings_model import Booking

booking = Blueprint("booking",
    __name__,
    static_folder='static',
    template_folder='templates')

@booking.route("/booking",methods=["GET"])
def frontPage():
    return render_template("booking.html")

@booking.route("/api/booking",methods=["GET"])
def getReserveTour():
    return "1"