from api import db

print("db_order 運行")

class Orders(db.Model):
    __tablename__="orders"
    order_number = db.Column(db.String(50), primary_key=True)
    contact_name = db.Column(db.String(50), nullable=False)
    contact_email = db.Column(db.String(100), nullable=False)
    contact_phone = db.Column(db.String(30), nullable=False)
    price = db.Column(db.Integer, nullable=False)


    def __init__(self, order_number, contact_name, contact_email, contact_phone, price):
        self.order_number  = order_number
        self.contact_name = contact_name
        self.contact_email = contact_email
        self.contact_phone = contact_phone
        self.price = price