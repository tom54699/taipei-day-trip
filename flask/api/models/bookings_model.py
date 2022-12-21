from api import db
from api.models.attractions_model import Attraction
from api.models.orders_model import Orders

print("db_booking 運行")

class Booking(db.Model):
    __tablename__="booking"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    member_email = db.Column(db.String(100), db.ForeignKey("member.email"), nullable=False)
    attraction_id = db.Column(db.Integer, db.ForeignKey("attraction.id"), nullable=False)
    order_number = db.Column(db.String(50),db.ForeignKey("orders.order_number"))
    date = db.Column(db.String(50), nullable=False)
    time = db.Column(db.String(30), nullable=False)
    price = db.Column(db.Integer, nullable=False)

    def __init__(self, member_email , attraction_id, date, time, price):
        self.member_email  = member_email 
        self.attraction_id = attraction_id
        self.date = date
        self.time = time
        self.price = price

    def get_order_data_by_id(orderNumber):
        trip_lists = []
        query_booking_lists = db.session.query(Orders,Booking, Attraction). \
        select_from(Orders).join(Booking).join(Attraction).filter(Orders.order_number == orderNumber).all()
        if len(query_booking_lists) == 0:
            return "no_data"
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
                "booking_id": booking.id,
                "booking_price": booking.price,
                "date": booking.date,
                "time": booking.time
            }
            trip_lists.append(trip)
        return orders_query_data
        
    def get_payed_bookingId(booking_id, member_email):
        query_order_number = Booking.query.filter(Booking.id == booking_id, Booking.member_email == member_email, Booking.order_number != None).all()
        return query_order_number

    def build_new_booking_data(data, member_email):
        attraction_id = data["attractionId"]
        date = data["date"]
        time = data["time"]
        price = data["price"]
        data = Booking(member_email, attraction_id, date, time, price)
        db.session.add(data)
        db.session.commit()
        return 
    
    def update_booking_order_number(booking_id, member_email, number):
        Booking.query.filter_by(id=booking_id, member_email=member_email).update({"order_number":number})
        db.session.commit()

    def check_booking_data_by_time(data, member_email):
        date = data["date"]
        time = data["time"]
        filters = {"member_email": member_email, "date": date, "time": time}
        result = Booking.query.filter_by(**filters).all()
        return result
    
    def delete_booking_data_by_bookingId(data, member_email):
        booking_id = data["bookingId"]
        query = Booking.query.filter_by(member_email=member_email,id=booking_id).first()
        db.session.delete(query)
        db.session.commit()

