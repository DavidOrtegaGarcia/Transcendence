FROM nginx:1.25

# Build time 
RUN apt-get update && apt-get install -y openssl

COPY ./conf/default.conf /etc/nginx/conf.d/default.conf
COPY ./tools/get_certificate.sh /usr/local/bin/get_certificate.sh
RUN chmod +x /usr/local/bin/get_certificate.sh

EXPOSE 443

# Run time 
ENTRYPOINT ["/usr/local/bin/get_certificate.sh"]