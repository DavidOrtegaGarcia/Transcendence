FROM debian:12.11

RUN apt-get update && apt-get install -y openssl

COPY ./tools/create_certs.sh /usr/local/bin/create_certs.sh

ENTRYPOINT ["/usr/local/bin/create_certs.sh"]