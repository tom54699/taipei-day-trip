from api import db, bcrypt, jwt
from .bookings_model import Booking
from .attractions_model import Attraction

print("db_member 運行")


class Member(db.Model):
    __tablename__ = "member"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    nick_name = db.Column(db.String(100))
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)
    birthday = db.Column(db.String(100))
    phone_number = db.Column(db.String(100))
    intro = db.Column(db.String(100))
    verify_code = db.Column(db.String(100))
    headshot = db.Column(db.String(500))
    bookings = db.relationship("Booking", backref="member")
    orders = db.relationship("Orders", backref="member")

    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.password = password

    def get_not_pay_booking_data(member_email):
        booking_lists = []
        query_booking_lists = (
            db.session.query(Booking, Attraction, Member)
            .select_from(Booking)
            .join(Attraction)
            .join(Member)
            .filter(Booking.member_email == member_email, Booking.order_number == None)
            .all()
        )
        if len(query_booking_lists) == 0:
            return "no_data"
        for booking, attraction, member in query_booking_lists:
            image_urls = []
            for image in attraction.images:
                image_urls.append(image.image_url)
            booking_data = {
                "data": {
                    "member": {"name": member.name, "email": member.email},
                    "attraction": {
                        "id": attraction.id,
                        "name": attraction.name,
                        "address": attraction.address,
                        "image": image_urls,
                    },
                    "id": booking.id,
                    "date": booking.date,
                    "time": booking.time,
                    "price": booking.price,
                }
            }
            booking_lists.append(booking_data)
        return booking_lists

    def get_member_auth_data(member_email):
        member = Member.query.filter_by(email=member_email).first()
        member_data = {
            "data": {
                "id": member.id,
                "name": member.name,
                "email": member.email,
            }
        }
        return member_data

    def get_member_headshot(member_email):
        member = Member.query.filter_by(email=member_email).first()
        if member.headshot == None:
            return "no_data"
        member_data = {
            "data": {
                "headshot": member.headshot,
            }
        }
        return member_data

    def get_member_password_by_email(member_email):
        filters = {"email": member_email}
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
            "intro": member.intro,
        }
        return member_info

    def get_member_bookings_by_email(member_email):
        booking_lists = []
        query_data = (
            db.session.query(Booking, Attraction, Member)
            .select_from(Booking)
            .join(Attraction)
            .join(Member)
            .filter(Booking.member_email == member_email, Booking.order_number != None)
            .all()
        )
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
            order_data = {"order_number": order.order_number, "price": order.price}
            order_lists.append(order_data)
        return order_lists

    def update_member_register_data(register_name, register_email, pw_hash):
        data = Member(register_name, register_email, pw_hash)
        db.session.add(data)
        db.session.commit()

    def update_member_profile(member_email, data):
        new_name = data["name"]
        new_nick_name = data["nick_name"]
        new_birthday = data["birthday"]
        new_phone_number = data["phone_number"]
        new_intro = data["intro"]

        Member.query.filter_by(email=member_email).update(
            {
                "name": new_name,
                "nick_name": new_nick_name,
                "birthday": new_birthday,
                "phone_number": new_phone_number,
                "intro": new_intro,
            }
        )
        db.session.commit()
        return "ok"

    def update_member_password(member_email, new_password):
        pw_hash = bcrypt.generate_password_hash(new_password, 10)
        member = Member.query.filter_by(email=member_email).update(
            {
                "password": pw_hash,
            }
        )
        db.session.commit()
        return "ok"

    def update_member_verify_code(member_email, verify_code):
        member = Member.query.filter_by(email=member_email).update(
            {
                "verify_code": verify_code,
            }
        )
        db.session.commit()
        return "ok"

    def update_member_headshot(member_email, headshot):
        member = Member.query.filter_by(email=member_email).update(
            {
                "headshot": headshot,
            }
        )
        db.session.commit()
        return "ok"

    def check_member_email(member_email):
        response = Member.query.filter_by(email=member_email).all()
        return response

    def check_verify_code(confirm_email, verify_code):
        response = Member.query.filter_by(email=confirm_email, verify_code=verify_code).all()
        return response
