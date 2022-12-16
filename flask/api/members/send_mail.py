import email.message
import smtplib
import os 
from dotenv import load_dotenv
load_dotenv()
# 寄修改密碼信件
def send_update__password_email(member_email):
    msg=email.message.EmailMessage()
    msg["From"] = os.getenv("EMAIL_ACCOUNT")
    msg["To"] = member_email
    msg["Subject"] = "台北一日遊"
    msg.set_content("您的密碼已修改，如果您認為有人取得或竄改您的密碼，請盡快修跟客服人員聯絡。")
    server=smtplib.SMTP_SSL("smtp.gmail.com", 465)
    server.login(os.getenv("EMAIL_ACCOUNT") ,os.getenv("EMAIL_KEY"))
    server.send_message(msg)
    server.close 

# 寄修創會員信件
def send_register_email(member_email):
    msg=email.message.EmailMessage()
    msg["From"] = os.getenv("EMAIL_ACCOUNT")
    msg["To"] = member_email
    msg["Subject"] = "台北一日遊"
    msg.set_content("恭喜您，註冊成功，祝您下來的旅途一切順心愉快!!")
    server=smtplib.SMTP_SSL("smtp.gmail.com", 465)
    server.login(os.getenv("EMAIL_ACCOUNT") ,os.getenv("EMAIL_KEY"))
    server.send_message(msg)
    server.close 