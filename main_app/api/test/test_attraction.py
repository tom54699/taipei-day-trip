#  api/attractions GET 測試
import pytest


@pytest.mark.parametrize(
    "page, expected_status_code",
    [
        (None, 400),
        ("呵呵", 400),
        ("-1", 400),
    ],
)
def test_get_all_attractions_with_wrong_page(attractions, page, expected_status_code):
    params = {"page": page}
    resp = attractions.get("api/attractions", query_string=params)
    assert resp.status_code == expected_status_code


def test_get_all_attractions_with_page_zero(attractions):
    params = {"page": "0"}
    resp = attractions.get("api/attractions", query_string=params)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["nextPage"] == "0"
    assert len(data["data"]) == 12


def test_get_all_attractions_with_page_zero_keyword_nothing(attractions):
    params = {"page": "0", "keyword": "Nothing"}
    resp = attractions.get("api/attractions", query_string=params)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["nextPage"] == None
    assert data["data"] == []


def test_get_all_attractions_with_page_zero_keyword_blueRoad(attractions):
    params = {"page": "0", "keyword": "藍色公路"}
    resp = attractions.get("api/attractions", query_string=params)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["nextPage"] == None
    assert len(data["data"]) == 2


# api/attraction/<attractionId> GET 測試
def test_get_attraction_with_no_params(attractions):
    resp = attractions.get("api/attraction")
    assert resp.status_code == 404


def test_get_attraction_with_attraction_id_has_no_data(attractions):
    resp = attractions.get("api/attraction/9999")
    assert resp.status_code == 400
    data = resp.get_json()
    assert data["error"] == "true"
    assert data["message"] == "沒有此景點編號"


def test_get_attraction_with_attraction_id_is_right(attractions):
    resp = attractions.get("api/attraction/1")
    assert resp.status_code == 200
    data = resp.get_json()
    assert len(data) == 1


# api/categories GET 測試
def test_get_attraction_categories(attractions):
    resp = attractions.get("api/categories")
    assert resp.status_code == 200
