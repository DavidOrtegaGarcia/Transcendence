#!/bin/bash

key="/etc/ssl/private/transcendence.key"
cert="/etc/ssl/certs/transcendence.crt"

if [ ! -f $cert ]; then
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
		-keyout $key -out $cert \
		-subj "/C=ES/ST=BCN/L=BCN/O=42/OU=CC/CN=localhost"
fi

exec "$@"