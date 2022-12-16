from api import db,bcrypt,jwt
from api.models.bookings_model import Booking
from api.models.attractions_model import Attraction
from api.models.members_model import Member


class Get_data():
    def get_member_password_by_email(member_email):
        filters = {"email" : member_email}
        member = Member.query.filter_by(**filters).first()
        member_password = member.password
        return member_password

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
            "intro": member.intro
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

class Update_data():
    def update_member_profile(member_email,data):
        new_name = data["name"]
        new_nick_name = data["nick_name"]
        new_birthday = data["birthday"]
        new_phone_number = data["phone_number"]
        new_intro = data["intro"]

        member = Member.query.filter_by(email=member_email).update({
            "name": new_name,
            "nick_name": new_nick_name,
            "birthday": new_birthday,
            "phone_number": new_phone_number,
            "intro": new_intro
        })
        db.session.commit()
        return "ok"

    def update_member_password(member_email,data):
        new_password = data["new_password"]
        pw_hash = bcrypt.generate_password_hash(new_password, 10)
        member = Member.query.filter_by(email=member_email).update({
            "password": pw_hash,
        })
        db.session.commit()
        return "ok"