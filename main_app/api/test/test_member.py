#  api/attractions GET 測試
import pytest
from api.mail.send_mail import Email
from api.models.members_model import Member
from api import bcrypt
from flask_jwt_extended import utils
from flask_jwt_extended import view_decorators


@pytest.mark.parametrize(
    "register_name, register_email, register_password",
    [
        ("789", "789@gmail.com", "789789"),
        ("toml", "toml@gmail.com", "123456"),
        ("jack", "jack@gmail.com", "fgh5454"),
    ],
)
# api/user POST 測試
def test_register_with_right_params(members, mocker, register_name, register_email, register_password):
    mocker.patch.object(Email, "send_register_email", autospec=True, return_value="success")
    data = {"name": register_name, "email": register_email, "password": register_password}
    resp = members.post("api/user", json=data)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["ok"] == "true"


def test_register_with_wrong_email_regex(members):
    data = {"name": "tom", "email": "789@789", "password": "123456"}
    resp = members.post("api/user", json=data)
    assert resp.status_code == 400
    data = resp.get_json()
    assert data["error"] == "true"
    assert data["message"] == "⚠ 信箱或密碼格式不正確"


def test_register_with_wrong_password_regex(members):
    data = {"name": "tom", "email": "tom@gmail.com", "password": "111"}
    resp = members.post("api/user", json=data)
    assert resp.status_code == 400
    data = resp.get_json()
    assert data["error"] == "true"
    assert data["message"] == "⚠ 信箱或密碼格式不正確"


def test_register_with_duplicate_registration(members):
    data = {"name": "tom", "email": "tom@gmail.com", "password": "123456"}
    resp = members.post("api/user", json=data)
    assert resp.status_code == 400
    data = resp.get_json()
    assert data["error"] == "true"
    assert data["message"] == "⚠ 信箱已被註冊"


@pytest.mark.parametrize(
    "login_name, login_email, login_password",
    [
        ("tom", "tom@gmail.com", "123456"),
    ],
)
# api/user/auth PUT 測試
def test_login_with_right_params(members, mocker, login_name, login_email, login_password):
    mocker.patch.object(bcrypt, "check_password_hash", autospec=True, return_value=True)
    data = {"name": login_name, "email": login_email, "password": login_password}
    resp = members.put("api/user/auth", json=data)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["ok"] == "true"


def test_login_with_unregister_account(members):
    data = {"name": "789", "email": "789@789.com", "password": "123456"}
    resp = members.put("api/user/auth", json=data)
    assert resp.status_code == 400
    data = resp.get_json()
    assert data["error"] == "true"
    assert data["message"] == "⚠ 未註冊的信箱，或是輸入錯誤"


def test_login_with_wrong_password(members, mocker):
    mocker.patch.object(bcrypt, "check_password_hash", autospec=True, return_value=False)
    data = {"name": "tom", "email": "tom@gmail.com", "password": "123456"}
    resp = members.put("api/user/auth", json=data)
    assert resp.status_code == 400
    data = resp.get_json()
    assert data["error"] == "true"
    assert data["message"] == "⚠ 密碼輸入錯誤"


# api/user/auth GET 測試
def test_get_member_with_right_params(members, mocker, test_create_access_token):
    mocker.patch.object(utils, "get_jwt_identity", autospec=True, return_value="tom@gmail.com")
    resp = members.get("api/user/auth", json=test_create_access_token)
    assert resp.status_code == 200
    data = resp.get_json()
    name = data["data"]["name"]
    assert name == "tom"


def test_get_member_with_invalid_auth(members, mocker):
    mocker.patch.object(utils, "get_jwt_identity", autospec=True, return_value="tom@gmail.com")
    resp = members.get("api/user/auth")
    assert resp.status_code == 401


# api/user/auth GET 測試
def test_logout_with_auth(members, test_create_refresh_token):
    resp = members.delete("api/user/auth", json=test_create_refresh_token)
    assert resp.status_code == 200


# api/refresh GET 測試
def test_refresh_with_auth(members, test_create_refresh_token):
    resp = members.get("api/refresh", json=test_create_refresh_token)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["status"] == "success"


def test_refresh_with_invalid_auth(members):
    resp = members.get("api/refresh")
    assert resp.status_code == 401


# api/user/membercenter GET 測試
def test_get_member_center_data_with_auth(members, mocker, test_create_access_token):
    mocker.patch.object(utils, "get_jwt_identity", autospec=True, return_value="tom@gmail.com")
    resp = members.get("api/user/membercenter", json=test_create_access_token)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["ok"] == "true"
    assert len(data["data"]) == 3


def test_get_member_center_data_with_invalid_auth(members):
    resp = members.get("api/user/membercenter")
    assert resp.status_code == 401


# api/user/profile PUT 測試
def test_update_member_profile_data_with_auth_and_required_data(members, mocker, test_create_access_token):
    mocker.patch.object(utils, "get_jwt_identity", autospec=True, return_value="tom@gmail.com")
    access_token = test_create_access_token
    data = {"name": "toml", "nick_name": "test1", "birthday": "1994.02.03", "phone_number": "0965255458", "intro": ""}
    data.update(access_token)
    resp = members.put("api/user/profile", json=data)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["ok"] == "true"


def test_update_member_profile_data_with_invalid_auth(members):
    resp = members.put("api/user/profile")
    assert resp.status_code == 401


def test_update_member_profile_data_with_auth_but_no_data(members, mocker, test_create_access_token):
    mocker.patch.object(utils, "get_jwt_identity", autospec=True, return_value="tom@gmail.com")
    resp = members.put("api/user/profile", json=test_create_access_token)
    assert resp.status_code == 500


# api/user/password PUT 測試
def test_update_member_password_data_with_auth_and_required_data(members, mocker, test_create_access_token):
    mocker.patch.object(utils, "get_jwt_identity", autospec=True, return_value="tom@gmail.com")
    mocker.patch.object(Member, "get_member_password_by_email", autospec=True, return_value="123456")
    mocker.patch.object(bcrypt, "check_password_hash", autospec=True, return_value=True)
    mocker.patch.object(Email, "send_update__password_email", autospec=True, return_value="success")
    access_token = test_create_access_token
    data = {"old_password": "123456", "new_password": "789789", "check_password": "789789"}
    data.update(access_token)
    resp = members.put("api/user/password", json=data)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["ok"] == "true"


def test_update_member_password_data_with_invalid_auth(members):
    resp = members.put("api/user/password")
    assert resp.status_code == 401


def test_update_member_password_data_with_auth_but_newpassword_oldpassword_are_same(
    members, mocker, test_create_access_token
):
    mocker.patch.object(utils, "get_jwt_identity", autospec=True, return_value="tom@gmail.com")
    access_token = test_create_access_token
    data = {"old_password": "123456", "new_password": "123456", "check_password": "123456"}
    data.update(access_token)
    resp = members.put("api/user/password", json=data)
    assert resp.status_code == 400
    data = resp.get_json()
    assert data["error"] == "true"
    assert data["message"] == "⚠ 請勿與舊密碼重複"


def test_update_member_password_data_with_auth_but_new_check_password_not_match(
    members, mocker, test_create_access_token
):
    mocker.patch.object(utils, "get_jwt_identity", autospec=True, return_value="tom@gmail.com")
    access_token = test_create_access_token
    data = {"old_password": "789789", "new_password": "123456", "check_password": "789789"}
    data.update(access_token)
    resp = members.put("api/user/password", json=data)
    assert resp.status_code == 400
    data = resp.get_json()
    assert data["error"] == "true"
    assert data["message"] == "⚠ 確認密碼輸入錯誤"


def test_update_member_password_data_with_auth_but_invalid_password_regex(members, mocker, test_create_access_token):
    mocker.patch.object(utils, "get_jwt_identity", autospec=True, return_value="tom@gmail.com")
    access_token = test_create_access_token
    data = {"old_password": "123456", "new_password": "99", "check_password": "99"}
    data.update(access_token)
    resp = members.put("api/user/password", json=data)
    data = resp.get_json()
    assert resp.status_code == 400
    assert data["error"] == "true"
    assert data["message"] == "⚠ 密碼格式不正確"


def test_update_member_password_data_with_auth_but_invalid_oldpassword(members, mocker, test_create_access_token):
    mocker.patch.object(utils, "get_jwt_identity", autospec=True, return_value="tom@gmail.com")
    mocker.patch.object(Member, "get_member_password_by_email", autospec=True, return_value="456456")
    mocker.patch.object(bcrypt, "check_password_hash", autospec=True, return_value=False)
    mocker.patch.object(Email, "send_update__password_email", autospec=True, return_value="success")
    access_token = test_create_access_token
    data = {"old_password": "123456", "new_password": "789789", "check_password": "789789"}
    data.update(access_token)
    resp = members.put("api/user/password", json=data)
    data = resp.get_json()
    assert resp.status_code == 400
    assert data["error"] == "true"
    assert data["message"] == "⚠ 舊密碼輸入錯誤"


# api/user/verifycode POST 測試
def test_get_verify_code_for_password_with_required_data(members, mocker):
    mocker.patch.object(Email, "send_verify_code_email", autospec=True, return_value="success")
    data = {"confirm_email": "tom@gmail.com"}
    resp = members.post("api/user/verifycode", json=data)
    data = resp.get_json()
    assert resp.status_code == 200
    assert data["ok"] == "true"


def test_get_verify_code_for_password_with_invalid_email(members, mocker):
    mocker.patch.object(Email, "send_verify_code_email", autospec=True, return_value="success")
    data = {"confirm_email": "123@gmail.com"}
    resp = members.post("api/user/verifycode", json=data)
    data = resp.get_json()
    assert resp.status_code == 400
    assert data["error"] == "true"
    assert data["message"] == "⚠ 這組信箱沒有註冊過"


# api/user/verifycode PUT 測試
def test_check_verify_code_for_password_with_required_data(members):
    data = {"confirm_email": "tom@gmail.com", "verify_code": "abc123"}
    resp = members.put("api/user/verifycode", json=data)
    data = resp.get_json()
    assert resp.status_code == 200
    assert data["ok"] == "true"


def test_check_verify_code_for_password_with_invalid_verify_code(members):
    data = {"confirm_email": "tom@gmail.com", "verify_code": "999123"}
    resp = members.put("api/user/verifycode", json=data)
    data = resp.get_json()
    assert resp.status_code == 400
    assert data["error"] == "true"
    assert data["message"] == "⚠ 驗證碼錯誤"
