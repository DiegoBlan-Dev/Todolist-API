FROM postgres:14.20-trixie
RUN apt update && apt install -y vim less

COPY ./src/v1/db/init.sql /docker-entrypoint-initdb.d
