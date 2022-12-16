from flask import Flask,Blueprint,jsonify,request,render_template
from api import db,bcrypt,jwt
from api.models.members_model import Member
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,get_jwt,
    create_refresh_token, get_jwt_identity,unset_access_cookies,unset_refresh_cookies,set_access_cookies,set_refresh_cookies,
)
from .get_data import Get_data,Update_data
from .send_mail import send_update__password_email,send_register_email
import re
import redis
from datetime import timedelta

members = Blueprint("members",
    __name__,
    static_folder='static',
    template_folder='templates')

@members.route("/user",methods=["GET"])
def enterMemberCenter():
    return render_template("memberCenter.html")


@members.route("api/user",methods=["POST"])
def register():
    try:
        # 拿使用者輸入的資料
        data = request.get_json()
        register_name = data["name"]
        register_email = data["email"]
        register_password = data["password"]
        print(register_name,register_email,register_password)
        # 確保格式正確
        password_regex = r"[A-Za-z0-9]{5,12}"
        if register_email == "" or not bool(re.match(password_regex, register_password)):
            return jsonify(error="true", message="⚠ 信箱或密碼格式不正確"),400
        # 確認account、email有無重複
        filters = {"email" : register_email}
        result = Member.query.filter_by(**filters).all()
        print("篩選結果:",len(result))
        if len(result) != 0:
            return jsonify(error="true",message="⚠ 信箱已被註冊"),400
        else:
            pw_hash = bcrypt.generate_password_hash(register_password, 10)
            data = Member(register_name,register_email,pw_hash)
            db.session.add(data)
            db.session.commit()
            send_register_email(register_email)
            return jsonify(ok="true"),200
    except Exception as ex:
        return jsonify(error="true",message=f"{ex}"),500
  
@members.route("api/user/auth",methods=["PUT"])
def login():
    try:
        # 拿使用者輸入的資料
        data = request.get_json()
        login_email = data["email"]
        login_password = data["password"]
        filters = {"email" : login_email}
        result = Member.query.filter_by(**filters).all()
        print("篩選結果:",len(result)) 
        if len(result) == 0:
            return jsonify(error="true", message="⚠ 未註冊的信箱，或是輸入錯誤"),400
        if bcrypt.check_password_hash(result[0].password,login_password):
            # 帶JWT
            access_token = create_access_token(identity = login_email, fresh=True)
            refresh_token = create_refresh_token(identity = login_email)
            # 把access_token和status都弄成json傳過去
            status = "true"
            resp = jsonify(access_token=access_token,ok=status)
            set_refresh_cookies(resp,refresh_token)
        else:
            return jsonify(error="true" ,message="⚠ 密碼輸入錯誤"),400
        return resp,200
    except Exception as ex:
        return jsonify(error="true" ,message=f"{ex}"),500

@members.route("api/user/auth",methods=["GET"])
@jwt_required(fresh=True)
def get_member():
    try:
        identity = get_jwt_identity()
        member_email =identity
        member = Member.query.filter_by(email=member_email).first()
        member_data ={
            "data": {
                "id": member.id,
                "name": member.name,
                "email": member.email,
            }
        }
        return member_data,200
    except Exception as ex:
        return jsonify(error="true", message=f"{ex}"),500



@members.route("api/user/auth",methods=["DELETE"])
@jwt_required(refresh=True,optional=True)
def logout():
    try:
        response = jsonify({"ok": "true"})
        unset_refresh_cookies(response)
        unset_access_cookies(response)
        a = get_jwt()
        if a == {}:
            return response,200
        jti = get_jwt()["jti"]
        jwt_redis_blocklist.set(jti, "", ex=timedelta(days=7))
        return response,200
    except Exception as ex:
        return jsonify(error="true",message=f"{ex}"),500

# 小隱憂 如果有人把refreshtoken拔掉 會無限loop
@members.route("api/refresh", methods=["GET"])
@jwt_required(refresh=True)
def refresh():
    try:
        identity = get_jwt_identity()
        access_token = create_access_token(identity = identity, fresh=True)
        resp = jsonify(access_token=access_token,status="success")
        refresh_token = create_refresh_token(identity = identity)
        set_refresh_cookies(resp,refresh_token)
        return resp,200
    except Exception as ex:
        return jsonify(error="true",message=f"{ex}"),500  

# JWT Auth Setting

@jwt.invalid_token_loader
def invalid_token_callback(e):
    return jsonify(error="true",message="⚠ 請登入會員"),401

@jwt.expired_token_loader
def expired_token_callback(jwt_header,jwt_data):
    return jsonify(error="true",message="⚠ 請換發token"),403


@jwt.unauthorized_loader
def unauthorized_callback(e):
    #return render_template("error.html"),401
    return jsonify(error="true",message="⚠ 未登入會員"), 401


jwt_redis_blocklist = redis.StrictRedis(
    host="localhost", port=6379, db=0, decode_responses=True
)

 
@jwt.token_in_blocklist_loader
def check_if_token_is_revoked(jwt_header, jwt_payload: dict):
    print(jwt_redis_blocklist.ping())
    jti = jwt_payload["jti"]
    token_in_redis = jwt_redis_blocklist.get(jti)
    return token_in_redis is not None



# 會員中心拿全部資料 

@members.route("api/user/membercenter",methods=["GET"])
@jwt_required(fresh=True)
def get_member_center_data():
    try:
        identity = get_jwt_identity()
        member_email =identity

        member_info = Get_data.get_member_info_by_email(member_email)
        bookings = Get_data.get_member_bookings_by_email(member_email)
        orders = Get_data.get_member_orders_by_email(member_email)

        member_center_data = {
            "member": member_info,
            "bookings": bookings,
            "orders": orders
        }
        return jsonify(ok="true",data=member_center_data),200
    except Exception as ex:
        return jsonify(error="true", message=f"{ex}"),500

# 會員中心更新個人資料
@members.route("api/user/profile",methods=["PUT"])
@jwt_required(fresh=True)
def update_member_profile_data():
    try:
        identity = get_jwt_identity()
        member_email =identity

        # 拿使用者輸入的資料
        data = request.get_json()
        Update_data.update_member_profile(member_email,data)

        return jsonify(ok="true"),200
    except Exception as ex:
        return jsonify(error="true", message=f"{ex}"),500

@members.route("api/user/password",methods=["PUT"])
@jwt_required(fresh=True)
def update_member_password_data():
    try:
        identity = get_jwt_identity()
        member_email =identity
        # 拿使用者輸入的資料
        data = request.get_json()
        # 驗證
        old_password = data["old_password"]
        new_password = data["new_password"]
        check_password = data["check_password"]
        if new_password != check_password:
            return jsonify(error="true" ,message="⚠ 確認密碼輸入錯誤"),400
        if old_password == new_password:
            return jsonify(error="true" ,message="⚠ 請勿與舊密碼重複"),400

        # 確保格式正確
        password_regex = r"[A-Za-z0-9]{5,12}"
        if not bool(re.match(password_regex, new_password)):
            return jsonify(error="true", message="⚠ 密碼格式不正確"),400

        member_password = Get_data.get_member_password_by_email(member_email)
        if bcrypt.check_password_hash(member_password, old_password):
            # 更新
            Update_data.update_member_password(member_email,data)
            # 寄信
            send_update__password_email(member_email)
            return jsonify(ok="true"),200
        else:
            return jsonify(error="true" ,message="⚠ 舊密碼輸入錯誤"),400
    except Exception as ex:
        return jsonify(error="true", message=f"{ex}"),500