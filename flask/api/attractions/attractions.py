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
        # 取得頁數 使用paginate()
        page = request.values.get("page")
        page_data = {
            "nextPage": page,
            "data" : [],
        }
        # 如果沒有輸入page參數
        if page == None:
            page_data["nextPage"] = None
            return jsonify(page_data),400
        page = int(page)+1
        pages = Attraction.query.paginate(page=page,per_page=12,error_out=False)
        # 頁數判斷
        if page >= pages.pages:
            page_data["nextPage"] = None
        # 判斷有無資料
        if pages.items == []:
            #page_data["data"].append("null")
            return jsonify(page_data),400
        for data in pages:
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
            "nextPage": page,
            "data" : [],
        }
        keyword = request.values.get("keyword")
        if keyword != None:
            query_list = Attraction.query.filter(or_(Attraction.category==keyword,Attraction.name.like("%"+f"{keyword}"+"%"))).paginate(page=page,per_page=12)
            # 頁數判斷
            if page >= query_list.pages:
                selected_page_data["nextPage"] = None
            # 判斷一下有沒有資料
            if query_list.items == []:
                return jsonify(error="true",message="沒有此關鍵字能找到的資訊"),400
            # 如果有資料
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
                selected_page_data["data"].append(attraction)
            return jsonify(selected_page_data)
        return jsonify(page_data)
    except Exception as ex:
        # 如果沒資料
        if str(ex) =="404 Not Found: The requested URL was not found on the server. If you entered the URL manually please check your spelling and try again.":
            page_data = {
                "nextPage": page,
                "data" : [],
            }
            #page_data["data"].append("null")
            page_data["nextPage"] = None
            return jsonify(page_data),400
        return jsonify(error="true",message=f"{ex}"),500

# 根據景點編號取得景點資料
@attractions.route("api/attraction/<attractionId>",methods=["GET"])
def get_attraction(attractionId):
    try:
        query = Attraction.query.filter(Attraction.id==attractionId).first()
        # 錯誤可能
        if query == None:
            return jsonify(error="true",message="沒有此景點編號"),400
        image_urls = []
        for image in query.images:
            image_urls.append(image.image_url)
        attraction = {
            "data": {
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
        }
        return jsonify(attraction)
    except Exception as ex:
        return jsonify(error="true",message=f"{ex}"),500
        

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
        return jsonify(error="true",message=f"{ex}"),500
