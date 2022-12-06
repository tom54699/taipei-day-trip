from api import db

print("db_member 運行")

class Member(db.Model):
    __tablename__="member"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False , unique=True)
    password = db.Column(db.String(100), nullable=False)
    bookings = db.relationship("Booking", backref="member")

    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.password = password


