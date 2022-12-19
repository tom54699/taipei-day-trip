from flask import Blueprint,render_template

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