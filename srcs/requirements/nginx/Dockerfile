FROM nginx:debian:12.11

RUN apt-get update && apt-get install -y openssl

#COPY ./conf/default /etc/nginx/sites-enabled/default
COPY ./tools/get_certificate.sh /usr/local/bin/get_certificate.sh
RUN chmod +x /usr/local/bin/get_certificate.sh

EXPOSE 433

ENTRYPOINT ["/usr/local/bin/get_certificate.sh"]