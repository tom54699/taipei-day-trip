FROM mysql:latest

ENV MYSQL_ROOT_PASSWORD=1m2o3o4n 
# 初始化建立database
COPY create.sql /docker-entrypoint-initdb.d 
# 要匯入的sql
COPY taipei_attractions.sql /var/lib/
# 匯入指令
COPY import.sh /docker-entrypoint-initdb.d