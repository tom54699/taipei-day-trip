FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/

COPY private.key /etc/ssl/private.key
COPY certificate.crt /etc/ssl/certificate.crt

