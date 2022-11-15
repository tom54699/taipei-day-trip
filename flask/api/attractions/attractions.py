from flask import Flask,Blueprint,jsonify,request
from api.models.attractions_model import Attraction,Image
from sqlalchemy import or_,and_
attractions = Blueprint("attractions",
    __name__,
    static_folder='static',
    template_folder='templates')

# 取得景點資料列表
@attractions.route("api/attractions",methods=["GET"])
def get_all_attractions():
    try:
        # 取得頁數
        page = request.values.get("page")
        page = int(page)
        range_start = 1 + page*12
        range_end = 12 + page*12
        # and
        query_list = Attraction.query.filter(range_start<=Attraction.id,Attraction.id<=range_end).all()
        page_data = {
            "nextPage": page+1,
            "data" : [],
        }
        for data in query_list:
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
            page_data["data"].append(attraction)

        # 如果有keyword搜尋
        selected_page_data = {
            "nextPage": page+1,
            "data" : [],
        }
        keyword = request.values.get("keyword")
        if keyword != None:
            for data in page_data["data"]:
                if data["category"] == keyword:
                    selected_page_data["data"].append(data)
            return jsonify(selected_page_data)
            #query_list = Attraction.query.filter(or_(Attraction.category==keyword,Attraction.category.like("%"+f"{keyword}"+"%"))).all()

        return jsonify(page_data)
    except Exception as ex:
        return jsonify(error="true",message=f"{ex}")

# 根據景點標號取得景點資料
@attractions.route("api/attraction/<attractionId>",methods=["GET"])
def get_attraction(attractionId):
    try:
        query = Attraction.query.filter(Attraction.id==attractionId).first()
        # 錯誤可能
        if query == None:
            return jsonify(error="true",message="沒有此景點編號")
        image_urls = []
        for image in query.images:
            image_urls.append(image.image_url)
        attraction = {
            "id" :query.id,
            "name" : query.name,
            "category" : query.category,
            "description" : query.description,
            "address" : query.address,
            "transport" :query.transport,
            "mrt" : query.mrt,
            "lat" : query.lat,
            "lng" : query.lng,
            "images" : image_urls
        }
        return jsonify(attraction)
    except Exception as ex:
        return jsonify(error="true",message=f"{ex}")
        

# 取得景點分類名稱列表
@attractions.route("api/categories",methods=["GET"])
def get_attraction_categories():
    try:
        # 不重複查詢
        query = Attraction.query.with_entities(Attraction.category).distinct().all()
        categories = []
        for data in query:
           categories.append(data[0])
        category_data = {
            "data" : categories
        }
        return jsonify(category_data)
    except Exception as ex:
        return jsonify(error="true",message=f"{ex}")
