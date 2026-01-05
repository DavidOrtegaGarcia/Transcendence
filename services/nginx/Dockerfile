FROM nginx:1.25-bookworm

RUN apt-get update && apt-get install -y 

COPY ./conf/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 433
