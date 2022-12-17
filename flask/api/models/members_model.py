from api import db

print("db_member 運行")

class Member(db.Model):
    __tablename__="member"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    nick_name = db.Column(db.String(100))
    email = db.Column(db.String(100), nullable=False , unique=True)
    password = db.Column(db.String(100), nullable=False)
    birthday = db.Column(db.String(100))
    phone_number = db.Column(db.String(100))
    intro = db.Column(db.String(100))
    verify_code = db.Column(db.String(100))
    bookings = db.relationship("Booking", backref="member")
    orders = db.relationship("Orders", backref="member")

    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.password = password


