import re

def check_password_regex(password):
    password_regex = r"[A-Za-z0-9]{5,12}"
    if re.match(password_regex, password):
        return True
    return False

def check_email_regex(email):
    email_regex = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    result = bool(re.match(email_regex, email))
    return result

def check_phone_regex(phone):
    phone_regex = r"^09[0-9]{8}$"
    result = bool(re.match(phone_regex, phone))
    return result