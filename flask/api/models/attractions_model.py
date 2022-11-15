from api import db

print("db_attraction 運行")

# description 500不夠
class Attraction(db.Model):
    __tablename__="attraction"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    category = db.Column(db.String(50))
    description = db.Column(db.String(2000))
    address = db.Column(db.String(500))
    transport = db.Column(db.String(500))
    mrt = db.Column(db.String(50))
    lat = db.Column(db.Float)
    lng = db.Column(db.Float)
    images = db.relationship("Image", backref="attraction")

    def __init__(self, id, name, category, description, address, transport, mrt, lat, lng,images):
        self.id = id
        self.name = name
        self.category = category
        self.description = description
        self.address = address
        self.transport = transport
        self.mrt = mrt
        self.lat = lat
        self.lng = lng
        self.images = images

class Image(db.Model):
    __tablename__="image"
    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    image_url = db.Column(db.String(500))
    attraction_id = db.Column(db.Integer,db.ForeignKey("attraction.id"))

    def __init__(self, image_url):
        self.image_url = image_url