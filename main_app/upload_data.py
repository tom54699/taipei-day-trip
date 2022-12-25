from api import db, create_app
from api.models.attractions_model import Attraction, Image
import json

# 呼叫app 然後要用with app.app_context() 不然會報錯
app = create_app()


with app.app_context():
    # 打開台北旅遊資訊Json檔案
    with open(
        "D:/Programming/Taipei-day-trip-website/main_app/data/taipei-attractions.json", mode="r", encoding="utf-8"
    ) as file:
        data = json.load(file)
        # 58筆資料
        print("總共有", len(data["result"]["results"]), "筆資料")
        # 開始提取資料
        attractions = []
        for i in data["result"]["results"]:
            id = i["_id"]
            name = i["name"]
            category = i["CAT"]
            description = i["description"]
            address = i["address"]
            transport = i["direction"]
            mrt = i["MRT"]
            lat = i["latitude"]
            lng = i["longitude"]

            # 處理 image 的部分 要處理額外處理url
            image_urls = []
            for n in i["file"].split("https://www"):
                if n.lower().endswith("jpg"):
                    image_url = Image(image_url="https://www" + str(n))
                    image_urls.append(image_url)
            attraction_data = Attraction(
                id=id,
                name=name,
                category=category,
                description=description,
                address=address,
                transport=transport,
                mrt=mrt,
                lat=lat,
                lng=lng,
                images=image_urls,
            )
            # print(attraction_data.images[0].image_url)
            attractions.append(attraction_data)
        print(attractions[0].images)

        db.session.add_all(attractions)
        db.session.add_all(image_urls)
        db.session.commit()
