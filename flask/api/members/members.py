from flask import Flask,Blueprint,jsonify,request,render_template
from api import db,bcrypt,jwt
from api.models.members_model import Member
from sqlalchemy import or_,and_
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    create_refresh_token, get_jwt_identity,unset_access_cookies,unset_refresh_cookies,set_access_cookies,set_refresh_cookies,
)

members = Blueprint("members",
    __name__,
    static_folder='static',
    template_folder='templates')

@members.route("api/member",methods=["POST"])
def register():
    try:
        # 拿使用者輸入的資料
        data = request.get_json()
        register_name = data["registerName"]
        register_email = data["registerEmail"]
        register_password = data["registerPassword"]
        print(register_name,register_email,register_password)
        # 確認account、email有無重複
        filters = {"email" : register_email}
        result = Member.query.filter_by(**filters).all()
        print("篩選結果:",len(result))
        if len(result) != 0:
            return jsonify(status="emailDuplicate",message="⚠ 信箱已被註冊"),400
        else:
            pw_hash = bcrypt.generate_password_hash(register_password, 10)
            data = Member(register_name,register_email,pw_hash)
            db.session.add(data)
            db.session.commit()
            return jsonify(status="success"),200
    except Exception as ex:
        return jsonify(status="error",message=f"{ex}"),500
  
@members.route("api/member",methods=["PATCH"])
def login():
    try:
        # 拿使用者輸入的資料
        data = request.get_json()
        login_email = data["loginEmail"]
        login_password = data["loginPassword"]

        filters = {"email" : login_email}
        result = Member.query.filter_by(**filters).all()
        for i in result:
            login_name = i.name
        print("篩選結果:",len(result)) 
        if len(result) == 0:
            return jsonify(status="noAccount",message="⚠ 未註冊的信箱，或是輸入錯誤"),400
        if bcrypt.check_password_hash(result[0].password,login_password):
            # 帶JWT
            access_token = create_access_token(identity = login_email, fresh=True)
            refresh_token = create_refresh_token(identity = login_email)
            # 把access_token和status都弄成json傳過去
            status = "success"
            resp = jsonify(access_token=access_token,status=status,name=login_name)
            set_refresh_cookies(resp,refresh_token)
        else:
            return jsonify(status="wrongPassword",message="⚠ 密碼輸入錯誤"),400
        return resp,200
    except Exception as ex:
        return jsonify(status="error",message=f"{ex}"),500

@members.route("api/member",methods=["GET"])
@jwt_required(refresh=True)
def get_member():
    try:
        identity = get_jwt_identity()
        member_email =identity
        member = Member.query.filter_by(email=member_email).first()
        return jsonify(status="success", id=member.id, name=member.name, email=member.email),200
    except Exception as ex:
        return jsonify(status="error",message=f"{ex}"),500



@members.route("api/member",methods=["DELETE"])
def logout():
    try:
        response = jsonify({"status": "success"})
        unset_refresh_cookies(response)
        return response,200
    except Exception as ex:
        return jsonify(status="error",message=f"{ex}"),500
