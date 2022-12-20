from api import db
from sqlalchemy import or_,and_

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

    def attraction_json_data(data):
        image_urls = []
        for image in data.images:
            image_urls.append(image.image_url)
        attraction = {
            "id" : data.id,
            "name" : data.name,
            "category" : data.category,
            "description" : data.description,
            "address" : data.address,
            "transport" : data.transport,
            "mrt" : data.mrt,
            "lat" : data.lat,
            "lng" : data.lng,
            "images" : image_urls
        }
        return attraction

    def get_attraction_pages(page):
        page_data = {
            "nextPage": page,
            "data" : [],
        }
        page = int(page)+1
        pages = Attraction.query.paginate(page=page,per_page=12,error_out=False)
        if page >= pages.pages:
            page_data["nextPage"] = None
        for data in pages:
            attraction = Attraction.attraction_json_data(data)
            page_data["data"].append(attraction)
        return page_data

    def get_attraction_pages_by_keywords(keyword,page):
        page_data = {
            "nextPage": page,
            "data" : [],
        }
        page = int(page)+1
        pages = Attraction.query.filter(or_(Attraction.category==keyword,Attraction.name.like("%"+f"{keyword}"+"%"))).paginate(page=page,per_page=12,error_out=False)
        if page >= pages.pages:
            page_data["nextPage"] = None
        for data in pages:
            attraction = Attraction.attraction_json_data(data)
            page_data["data"].append(attraction)
        return page_data
    
    def get_attraction_data_by_attractionId(attractionId):
        query = Attraction.query.filter(Attraction.id==attractionId).first()
        if query == None:
            attraction_data = "no_data"
            return attraction_data
        attraction = Attraction.attraction_json_data(query)
        attraction_data = {
            "data": attraction
        }
        return attraction_data

    def get_attraction_categories():
        categories = []
        query = Attraction.query.with_entities(Attraction.category).distinct().all()
        for data in query:
            categories.append(data[0])
        category_data = {
            "data" : categories
        }
        return category_data


class Image(db.Model):
    __tablename__="image"
    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    image_url = db.Column(db.String(500))
    attraction_id = db.Column(db.Integer,db.ForeignKey("attraction.id"))
    def __init__(self, image_url):
        self.image_url = image_url