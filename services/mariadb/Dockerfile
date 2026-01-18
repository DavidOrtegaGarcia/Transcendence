FROM mariadb:10.11

# Build time 
COPY ./conf/50-server.cnf /etc/mysql/mariadb.conf.d/50-server.cnf
COPY ./tools/create_tables.sql /docker-entrypoint-initdb.d/create_tables.sql

EXPOSE 3306

# Run time 
CMD ["mariadbd"]