FROM postgres:latest
# COPY docker-entrypoint-initdb.d /docker-entrypoint-initdb.d
WORKDIR /docker-entrypoint-initdb.d
COPY create.sql ./
EXPOSE 5432

FROM node:14
# RUN apt-get update && apt-get install -yq libgconf-2-4
RUN apt-get update && apt-get install -y libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2
WORKDIR /serverApp
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8081

ENV DB_HOST=db
ENV DB_PORT=5432
ENV DB_NAME=mydb
ENV DB_USER=test
ENV DB_PASSWORD=test123

CMD ["npm", "start"]
