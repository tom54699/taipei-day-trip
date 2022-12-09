from api import db

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

