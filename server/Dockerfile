FROM postgres:latest
COPY create.sql /docker-entrypoint-initdb.d/
EXPOSE 5432

FROM node:latest
RUN apt-get update && apt-get install -yq libgconf-2-4
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
