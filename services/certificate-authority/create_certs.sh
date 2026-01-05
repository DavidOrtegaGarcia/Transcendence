#!/bin/bash
CERT_DIR_CA="/certs/transcendence-ca"
KEY_DIR_CA="/keys/transcendence-ca"

mkdir -p $CERT_DIR_CA
mkdir -p $KEY_DIR_CA

# Función para generar certificados de servicio
gen_cert() {
    NAME=$1
    DNS=$2
    CERT_SERV_DIR="/certs/${NAME}"
    KEY_SERV_DIR="/keys/${NAME}"


    mkdir -p $CERT_SERV_DIR
    mkdir -p $KEY_SERV_DIR
    if [ ! -f "$CERT_SERV_DIR/${NAME}.crt" ]; then
        # Create keys and csr(Solicitud for certificate)
        openssl req -new -nodes-newkey rsa:2048 \
            -keyout "$KEY_SERV_DIR/${NAME}.key" -out "$KEY_SERV_DIR/${NAME}.csr" \
            -subj "/C=ES/ST=BCN/L=BCN/O=42/OU=CC/CN=${DNS}"

        # Create certificate with CA
        openssl x509 -req -in "$KEY_SERV_DIR/${NAME}.csr" \
            -CA "$CERT_DIR_CA/transcendence-ca.crt" \
            -CAkey "$KEY_DIR_CA/transcendence-ca.key" \
            -CAcreateserial \
            -out "$CERT_SERV_DIR/${NAME}.crt" -days 365
        
        # We remove the csr file
        rm "$KEY_SERV_DIR/${NAME}.csr"
    fi
}

# Create CA(Certification Authotiy) certificate (used to authenticate others certificates)
if [ ! -f $CERT_DIR_CA/"transcendence-ca.crt" ]; then
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
		-keyout "$KEY_DIR_CA/transcendence-ca.key" -out "$CERT_DIR_CA/transcendence-ca.crt" \
		-subj "/C=ES/ST=BCN/L=BCN/O=42/OU=CC/CN=transcendence-ca"
fi

# Create a cert for every container
gen_cert "nginx" "nginx"
gen_cert "adminer" "adminer"
gen_cert "mariadb" "mariadb"

chmod -R 644 "/certs/"*
chmod -R 600 "/keys/"*