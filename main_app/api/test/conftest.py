from api import create_app, db
from api.models.attractions_model import Attraction, Image
from api.models.members_model import Member
import json
import pytest
import os
from flask_jwt_extended import (
    jwt_required,
    create_access_token,
    get_jwt,
    create_refresh_token,
    get_jwt_identity,
    unset_access_cookies,
    unset_refresh_cookies,
    set_refresh_cookies,
)


def add_init_attractions(db):
    with open(
        "D:/Programming/Taipei-day-trip-website/main_app/data/taipei-attractions.json", mode="r", encoding="utf-8"
    ) as file:
        data = json.load(file)
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
            attractions.append(attraction_data)

        db.session.add_all(attractions)
        db.session.add_all(image_urls)
        db.session.commit()


def add_init_members(db):
    memberData = Member(
        name="tom",
        email="tom@gmail.com",
        password="$2b$10$Cv.IqEyvc4YFqTH21rDoge0c4wp5PYXJUPHUp7VAHK3/9WlkIFkWy",
    )
    db.session.add(memberData)
    db.session.commit()
    Member.query.filter_by(email="tom@gmail.com").update(
        {
            "verify_code": "abc123",
        }
    )
    db.session.commit()


@pytest.fixture
def attractions():
    os.environ["CONFIG_NAME"] = "testing"
    app = create_app()
    app.config["SERVER_NAME"] = "localhost"

    with app.test_client() as attractions:
        with app.app_context():
            db.create_all()
            add_init_attractions(db)
            yield attractions
            db.session.remove()
            db.drop_all()


@pytest.fixture
def members():
    os.environ["CONFIG_NAME"] = "testing"
    app = create_app()
    app.config["SERVER_NAME"] = "localhost"
    app.config["JWT_TOKEN_LOCATION"] = "json"

    with app.test_client() as members:
        with app.app_context():
            db.create_all()
            add_init_members(db)
            yield members
            db.session.remove()
            db.drop_all()


@pytest.fixture
def test_create_access_token(members):
    access_token = create_access_token(identity="tom@gmail.com", fresh=True)
    return {"access_token": access_token}


@pytest.fixture
def test_create_refresh_token(members):
    refresh_token = create_refresh_token(identity="tom@gmail.com")
    return {"refresh_token": refresh_token}
