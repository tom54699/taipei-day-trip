from api import db


class Orders(db.Model):
    __tablename__ = "orders"
    order_number = db.Column(db.String(50), primary_key=True)
    member_email = db.Column(db.String(100), db.ForeignKey("member.email"), nullable=False)
    contact_name = db.Column(db.String(50), nullable=False)
    contact_email = db.Column(db.String(100), nullable=False)
    contact_phone = db.Column(db.String(30), nullable=False)
    price = db.Column(db.Integer, nullable=False)

    def __init__(self, order_number, member_email, contact_name, contact_email, contact_phone, price):
        self.order_number = order_number
        self.member_email = member_email
        self.contact_name = contact_name
        self.contact_email = contact_email
        self.contact_phone = contact_phone
        self.price = price

    def build_new_order_data(number, member_email, contact_name, contact_email, contact_phone, order_price):
        order_upload_data = Orders(number, member_email, contact_name, contact_email, contact_phone, order_price)
        db.session.add(order_upload_data)
        db.session.commit()
