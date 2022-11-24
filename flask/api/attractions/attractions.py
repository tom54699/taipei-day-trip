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
        page = request.values.get("page")
        keyword = request.values.get("keyword")
        page_data = {
            "nextPage": page,
            "data" : [],
        }
        # 如果沒有輸入page參數 或 如果page小於0 或 如果page不是數字
        if page == None or page.isdigit() != True or int(page)<0:
            page_data["nextPage"] = None
            #page_data["data"].append("參數錯誤，無法搜尋資料")
            return jsonify(page_data),400
        page = int(page)+1
        # 有無keyword
        if keyword == None:
            pages = Attraction.query.paginate(page=page,per_page=12,error_out=False)
        else:
            pages = Attraction.query.filter(or_(Attraction.category==keyword,Attraction.name.like("%"+f"{keyword}"+"%"))).paginate(page=page,per_page=12,error_out=False)
        # 頁數判斷，如果下一頁沒有資料就顯示null
        if page >= pages.pages:
            page_data["nextPage"] = None
        # 如果沒資料，不用再寫判斷式，data會自動留空
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
        return jsonify(page_data),200
    except Exception as ex:
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
        return jsonify(attraction),200
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
        return jsonify(category_data),200
    except Exception as ex:
        return jsonify(error="true",message=f"{ex}"),500
