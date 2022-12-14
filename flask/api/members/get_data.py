from api import db,bcrypt,jwt
from api.models.bookings_model import Booking
from api.models.attractions_model import Attraction
from api.models.members_model import Member

class Get_data():
    def get_member_info_by_email(member_email):
        member = Member.query.filter_by(email=member_email).first() 
        member_info = {
            "id": member.id,
            "name": member.name,
            "nick_name": member.nick_name,
            "email": member.email,
            "password": member.password,
            "birthday": member.birthday,
            "phone_number": member.phone_number,
            "country": member.country
        }
        return member_info
    def get_member_bookings_by_email(member_email):
        booking_lists = []
        query_data = db.session.query(Booking, Attraction,Member). \
            select_from(Booking).join(Attraction).join(Member).filter(Booking.member_email == member_email,Booking.order_number != None).all()
        for booking, attraction, member in query_data:
            booking_data = {
                "attraction": {
                    "id": attraction.id,
                    "name": attraction.name,
                    "address": attraction.address,
                },
                "date": booking.date,
                "time": booking.time,
            }
            booking_lists.append(booking_data)
        return booking_lists
    def get_member_orders_by_email(member_email):
        order_lists = []
        member = Member.query.filter_by(email=member_email).first() 
        for order in member.orders:
            order_data = {
                "order_number": order.order_number,
                "price": order.price
            }
            order_lists.append(order_data)
        return order_lists