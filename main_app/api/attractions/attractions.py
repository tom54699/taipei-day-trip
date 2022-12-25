from flask import Blueprint, jsonify, request, render_template
from api.models.attractions_model import Attraction


attractions = Blueprint("attractions", __name__, static_folder="static", template_folder="templates")


@attractions.route("/attraction/<id>", methods=["GET"])
def attraction_page(id):
    return render_template("attraction.html")


# 取得景點資料列表
@attractions.route("api/attractions", methods=["GET"])
def get_all_attractions():
    try:
        page = request.values.get("page")
        keyword = request.values.get("keyword")
        page_data = {
            "nextPage": page,
            "data": [],
        }
        # 如果沒有輸入page參數 或 如果page小於0 或 如果page不是數字
        if page == None or page.isdigit() != True or int(page) < 0:
            page_data["nextPage"] = None
            return jsonify(page_data), 400
        # 有無keyword
        if keyword == None:
            page_data = Attraction.get_attraction_pages(page)
        else:
            page_data = Attraction.get_attraction_pages_by_keywords(keyword, page)
        return jsonify(page_data), 200
    except Exception as ex:
        return jsonify(error="true", message=f"{ex}"), 500


# 根據景點編號取得景點資料
@attractions.route("api/attraction/<attractionId>", methods=["GET"])
def get_attraction(attractionId):
    try:
        attraction_data = Attraction.get_attraction_data_by_attractionId(attractionId)
        if attraction_data == "no_data":
            return jsonify(error="true", message="沒有此景點編號"), 400
        return jsonify(attraction_data), 200
    except Exception as ex:
        return jsonify(error="true", message=f"{ex}"), 500


# 取得景點分類名稱列表
@attractions.route("api/categories", methods=["GET"])
def get_attraction_categories():
    try:
        category_data = Attraction.get_attraction_categories()
        return jsonify(category_data), 200
    except Exception as ex:
        return jsonify(error="true", message=f"{ex}"), 500
