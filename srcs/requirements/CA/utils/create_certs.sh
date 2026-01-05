#!/bin/bash
CERT_DIR="requirements/CA/certs"
KEY_DIR="requirements/CA/keys"

mkdir -p $CERT_DIR
mkdir -p $KEY_DIR

# Función para generar certificados de servicio
gen_cert() {
    NAME=$1
    DNS=$2

    if [ ! -f "$CERT_DIR/${NAME}.crt" ]; then
        # Create keys and csr(Solicitud for certificate)
        openssl req -new -nodes-newkey rsa:2048 \
            -keyout "$KEY_DIR/${NAME}.key" -out "$KEY_DIR/${NAME}.csr" \
            -subj "/C=ES/ST=BCN/L=BCN/O=42/OU=CC/CN=${DNS}"

        # Create certificate with CA
        openssl x509 -req -in "$KEY_DIR/${NAME}.csr" \
            -CA "$CERT_DIR/transcendence.crt" \
            -CAkey "$KEY_DIR/transcendence.key" \
            -CAcreateserial \
            -out "$CERT_DIR/${NAME}.crt" -days 365
        
        # We remove the csr file
        rm "$KEY_DIR/${NAME}.csr"
    fi
}

# Create CA(Certification Authotiy) certificate (used to authenticate others certificates)
if [ ! -f $CERT_DIR/"transcendence.crt" ]; then
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
		-keyout "$KEY_DIR/transcendence.key" -out "$CERT_DIR/transcendence.crt" \
		-subj "/C=ES/ST=BCN/L=BCN/O=42/OU=CC/CN=transcendence.42.fr"
fi

# Create a cert for every container
gen_cert "nginx" "nginx"
gen_cert "adminer" "adminer"
gen_cert "mariadb" "mariadb"

chmod -R 644 $CERT_DIR/*
chmod -R 600 $KEY_DIR/*