FROM python:3.10-slim-buster
WORKDIR /app
COPY . /app
RUN apt-get update && \
    apt-get -y install gcc && \
    pip3 install uwsgi && \
    pip3 install -r requirements.txt
CMD ["uwsgi","app.ini"]