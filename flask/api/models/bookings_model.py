from api import db

print("db_booking 運行")

class Booking(db.Model):
    __tablename__="booking"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    price = db.Column(db.Integer, nullable=False)
    number = db.Column(db.String(50))
    attraction_id = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(50), nullable=False)
    address = db.Column(db.String(100), nullable=False)
    image = db.Column(db.String(500), nullable=False)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.String(30), nullable=False)
    member_email = db.Column(db.String(100), db.ForeignKey("member.email"))

def __init__(self, number, attraction_id, name, address, image, date, time, price):
    self.number = number
    self.attraction_id = attraction_id
    self.name = name
    self.address = address
    self.image = image
    self.date = date
    self.time = time
    self.price = price

