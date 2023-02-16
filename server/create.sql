CREATE DATABASE mydb;
CREATE USER test WITH ENCRYPTED PASSWORD 'test123';
GRANT ALL PRIVILEGES ON DATABASE mydb TO test;
\c
CREATE TABLE ads (
    id SERIAL PRIMARY KEY,
    ad_id bigint UNIQUE,
    name TEXT,
    location TEXT,
    price TEXT
);