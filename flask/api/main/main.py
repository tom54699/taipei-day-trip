from flask import Blueprint,render_template,jsonify
from api import jwt

main = Blueprint("main",
    __name__,
    static_folder='static',
    template_folder='templates')

@main.route("/",methods=["GET"])
def frontPage():
    return render_template("index.html")

@main.route("/thankyou/<order_number>")
def thankyou(order_number):
	return render_template("thankyou.html",order_number=order_number)

@main.app_errorhandler(404)
def handle_404(err):
    return render_template("404.html"), 404
@main.app_errorhandler(500)
def handle_500(err):
    return render_template('500.html'), 500


@jwt.invalid_token_loader
def invalid_token_callback(e):
    return jsonify(error="true",message="⚠ 請登入會員"),401

@jwt.expired_token_loader
def expired_token_callback(jwt_header,jwt_data):
    return jsonify(error="true",message="⚠ 請換發token"),403

@jwt.unauthorized_loader
def unauthorized_callback(e):
    return jsonify(error="true",message="⚠ 未登入會員"), 401

 