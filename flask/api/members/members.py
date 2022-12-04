from flask import Flask,Blueprint,jsonify,request,render_template
from api import db,bcrypt,jwt
from api.models.members_model import Member
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,get_jwt,
    create_refresh_token, get_jwt_identity,unset_access_cookies,unset_refresh_cookies,set_access_cookies,set_refresh_cookies,
)
import re
from datetime import datetime
from datetime import timedelta
from datetime import timezone

members = Blueprint("members",
    __name__,
    static_folder='static',
    template_folder='templates')

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
        regex = r"[A-Za-z0-9]{5,12}"
        if register_email == "" or not bool(re.match(regex, register_password)):
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
            print(data)
            db.session.add(data)
            db.session.commit()
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
@jwt_required(refresh=True)
def get_member():
    try:
        identity = get_jwt_identity()
        member_email =identity
        member = Member.query.filter_by(email=member_email).first()
        member_data ={
            "data": {
                "id": member.id,
                "name": member.name,
                "email": member.email
            }
        }
        return member_data,200
    except Exception as ex:
        return jsonify(error="true", message=f"{ex}"),500



@members.route("api/user/auth",methods=["DELETE"])
def logout():
    try:
        response = jsonify({"ok": "true"})
        unset_refresh_cookies(response)
        return response,200
    except Exception as ex:
        return jsonify(error="true",message=f"{ex}"),500

# 小隱憂 如果有人把refreshtoken拔掉 會無限loop
@members.route("/refresh", methods=["GET"])
@jwt_required(refresh=True)
def refresh():
    try:
        identity = get_jwt_identity()
        access_token = create_access_token(identity=identity, fresh=True)
        resp = jsonify(access_token=access_token,status="success")
        refresh_token = create_refresh_token(identity = identity)
        set_refresh_cookies(resp,refresh_token)
        return resp,200
    except Exception as ex:
        return jsonify(error="true",message=f"{ex}"),500  


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

    