FROM nginx:1.25

RUN apt-get update && apt-get install -y curl

COPY ./html /usr/share/nginx/html

COPY ./conf/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]