FROM python:3.9-alpine3.17 as base
FROM base as builder
COPY requirements.txt /requirements.txt
RUN pip install --user -r /requirements.txt

FROM base
WORKDIR /app
COPY --from=builder /root/.local /root/.local
RUN apk add uwsgi-python3
COPY . /app


CMD ["uwsgi","app.ini"]