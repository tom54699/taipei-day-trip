FROM python:3.9-buster
WORKDIR /app
COPY . /app

RUN pip3 install uwsgi
RUN pip3 install -r requirements.txt
CMD ["uwsgi","app.ini"]
