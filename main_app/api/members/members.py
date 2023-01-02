from flask import Blueprint, jsonify, request, render_template
from api import bcrypt, jwt
from api.models.members_model import Member
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
from api.mail.send_mail import *
from api.utils.utils import check_password_regex, check_email_regex
from datetime import timedelta
import redis
import requests

members = Blueprint("members", __name__, static_folder="static", template_folder="templates")


@members.route("/user", methods=["GET"])
def enterMemberCenter():
    return render_template("memberCenter.html")


@members.route("api/user", methods=["POST"])
def register():
    try:
        data = request.get_json()
        register_name = data["name"]
        register_email = data["email"]
        register_password = data["password"]
        # 確保格式正確
        password_regex_result = check_password_regex(register_password)
        email_regex_result = check_email_regex(register_email)
        if not email_regex_result or not password_regex_result:
            return jsonify(error="true", message="⚠ 信箱或密碼格式不正確"), 400
        # 確認account、email有無重複
        result = Member.check_member_email(register_email)
        if len(result) != 0:
            return jsonify(error="true", message="⚠ 信箱已被註冊"), 400
        else:
            pw_hash = bcrypt.generate_password_hash(register_password, 10)
            Member.update_member_register_data(register_name, register_email, pw_hash)
            Email.send_register_email(register_email)
            return jsonify(ok="true"), 200
    except Exception as ex:
        return jsonify(error="true", message=f"{ex}"), 500


@members.route("api/user/auth", methods=["PUT"])
def login():
    try:
        # 拿使用者輸入的資料
        data = request.get_json()
        login_email = data["email"]
        login_password = data["password"]
        result = Member.check_member_email(login_email)
        if len(result) == 0:
            return jsonify(error="true", message="⚠ 未註冊的信箱，或是輸入錯誤"), 400
        if bcrypt.check_password_hash(result[0].password, login_password):
            access_token = create_access_token(identity=login_email, fresh=True)
            refresh_token = create_refresh_token(identity=login_email)
            status = "true"
            resp = jsonify(access_token=access_token, ok=status)
            set_refresh_cookies(resp, refresh_token)
        else:
            return jsonify(error="true", message="⚠ 密碼輸入錯誤"), 400
        return resp, 200
    except Exception as ex:
        return jsonify(error="true", message=f"{ex}"), 500


@members.route("api/user/auth", methods=["GET"])
@jwt_required(fresh=True)
def get_member():
    try:
        member_email = get_jwt_identity()
        member_data = Member.get_member_auth_data(member_email)
        return member_data, 200
    except Exception as ex:
        return jsonify(error="true", message=f"{ex}"), 500


jwt_redis_blocklist = redis.StrictRedis(host="redis", port=6379, db=0, decode_responses=True)


@jwt.token_in_blocklist_loader
def check_if_token_is_revoked(jwt_header, jwt_payload: dict):
    if os.environ["CONFIG_NAME"] == "testing":
        return None
    jti = jwt_payload["jti"]
    token_in_redis = jwt_redis_blocklist.get(jti)
    return token_in_redis is not None


@members.route("api/user/auth", methods=["DELETE"])
@jwt_required(refresh=True, optional=True)
def logout():
    try:
        response = jsonify({"ok": "true"})
        unset_refresh_cookies(response)
        unset_access_cookies(response)
        a = get_jwt()
        if a == {}:
            return response, 200
        jti = get_jwt()["jti"]
        if os.environ["CONFIG_NAME"] == "testing":
            return response, 200
        jwt_redis_blocklist.set(jti, "", ex=timedelta(days=7))
        return response, 200
    except Exception as ex:
        return jsonify(error="true", message=f"{ex}"), 500


@members.route("api/refresh", methods=["GET"])
@jwt_required(refresh=True)
def refresh():
    try:
        identity = get_jwt_identity()
        access_token = create_access_token(identity=identity, fresh=True)
        resp = jsonify(access_token=access_token, status="success")
        refresh_token = create_refresh_token(identity=identity)
        set_refresh_cookies(resp, refresh_token)
        return resp, 200
    except Exception as ex:
        return jsonify(error="true", message=f"{ex}"), 500


# 會員中心拿全部資料


@members.route("api/user/membercenter", methods=["GET"])
@jwt_required(fresh=True)
def get_member_center_data():
    try:
        member_email = get_jwt_identity()

        member_info = Member.get_member_info_by_email(member_email)
        bookings = Member.get_member_bookings_by_email(member_email)
        orders = Member.get_member_orders_by_email(member_email)

        member_center_data = {
            "member": member_info,
            "bookings": bookings,
            "orders": orders,
        }
        return jsonify(ok="true", data=member_center_data), 200
    except Exception as ex:
        return jsonify(error="true", message=f"{ex}"), 500


# 會員中心更新個人資料
@members.route("api/user/profile", methods=["PUT"])
@jwt_required(fresh=True)
def update_member_profile_data():
    try:
        member_email = get_jwt_identity()
        data = request.get_json()
        Member.update_member_profile(member_email, data)
        return jsonify(ok="true"), 200
    except Exception as ex:
        return jsonify(error="true", message=f"{ex}"), 500


@members.route("api/user/password", methods=["PUT"])
@jwt_required(fresh=True)
def update_member_password_data():
    try:
        member_email = get_jwt_identity()
        data = request.get_json()
        # 驗證
        old_password = data["old_password"]
        new_password = data["new_password"]
        check_password = data["check_password"]
        if new_password != check_password:
            return jsonify(error="true", message="⚠ 確認密碼輸入錯誤"), 400
        if old_password == new_password:
            return jsonify(error="true", message="⚠ 請勿與舊密碼重複"), 400

        # 確保格式正確
        password_regex_result = check_password_regex(new_password)
        if not password_regex_result:
            return jsonify(error="true", message="⚠ 密碼格式不正確"), 400

        member_password = Member.get_member_password_by_email(member_email)
        if bcrypt.check_password_hash(member_password, old_password):
            # 更新
            Member.update_member_password(member_email, new_password)
            # 寄信
            Email.send_update__password_email(member_email)
            return jsonify(ok="true"), 200
        else:
            return jsonify(error="true", message="⚠ 舊密碼輸入錯誤"), 400
    except Exception as ex:
        return jsonify(error="true", message=f"{ex}"), 500


# 忘記密碼拿驗證碼
@members.route("api/user/verifycode", methods=["POST"])
def get_verify_code_for_password():
    try:
        # 拿使用者輸入的資料
        data = request.get_json()
        confirm_email = data["confirm_email"]
        response = Member.check_member_email(confirm_email)
        if len(response) <= 0:
            return jsonify(error="true", message="⚠ 這組信箱沒有註冊過"), 400
        verify_code = Email.random_code_generate(6)
        Member.update_member_verify_code(confirm_email, verify_code)
        Email.send_verify_code_email(confirm_email, verify_code)
        return jsonify(ok="true"), 200
    except Exception as ex:
        return jsonify(error="true", message=f"{ex}"), 500


@members.route("api/user/verifycode", methods=["PUT"])
def check_verify_code_for_password():
    try:
        # 拿使用者輸入的資料
        data = request.get_json()
        confirm_email = data["confirm_email"]
        verify_code = data["verify_code"]
        response = Member.check_verify_code(confirm_email, verify_code)
        if len(response) <= 0:
            return jsonify(error="true", message="⚠ 驗證碼錯誤"), 400
        new_password = Email.random_code_generate(8)
        Member.update_member_password(confirm_email, new_password)
        return jsonify(ok="true", data=new_password), 200
    except Exception as ex:
        return jsonify(error="true", message=f"{ex}"), 500


@members.route("api/user/headshot", methods=["PUT"])
@jwt_required(fresh=True)
def put_member_headshot():
    try:
        data = request.get_json()
        image_type = data["image_type"]
        uint8array = data["headshot"]
        image_binary_data = bytes(uint8array)
        member_email = get_jwt_identity()
        member_data = Member.get_member_auth_data(member_email)
        member_id = member_data["data"]["id"]
        headers = {
            "Content-Type": f"image/{image_type}",
            "x-api-key": os.getenv("AWS_API_KEY"),
        }
        api_url = f"https://p61fyrmslb.execute-api.us-west-2.amazonaws.com/v1/wehelp-taipei-day-trip/upload/{member_id}.{image_type}"
        req = requests.put(api_url, headers=headers, data=image_binary_data, timeout=30)
        s3_url = f"https://wehelp-taipei-day-trip.s3.us-west-2.amazonaws.com/upload/{member_id}.{image_type}"
        if req.status_code == 200:
            Member.update_member_headshot(member_email, s3_url)
            return jsonify(ok="true"), 200
    except Exception as ex:
        return jsonify(error="true", message=f"{ex}"), 500


@members.route("api/user/headshot", methods=["GET"])
@jwt_required(fresh=True)
def get_member_headshot():
    try:
        member_email = get_jwt_identity()
        member_data = Member.get_member_headshot(member_email)
        if member_data == "no_data":
            return jsonify(error="true"), 400
        member_headshot = member_data["data"]["headshot"]
        return jsonify(ok="true", headshot=member_headshot), 200
    except Exception as ex:
        return jsonify(error="true", message=f"{ex}"), 500
