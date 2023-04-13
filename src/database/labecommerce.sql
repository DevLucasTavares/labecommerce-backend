-- Active: 1681396072556@@127.0.0.1@3306

CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);
SELECT * FROM users;
DROP TABLE users;

INSERT INTO users (id, email, password)
VALUES 
("u001", "lucas.tavares@email.com", "123"),
("u002", "leticia.tavares@email.com", "123"),
("u003", "henrique.tavares@email.com", "123");



CREATE TABLE products (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL
);
SELECT * FROM products;
DROP TABLE products;

INSERT INTO products (id, name, price, category)
VALUES
("p001", "i7", 2000, "Processador"),
("p002", "Ryzen 7", 2000, "Processador"),
("p003", "i9", 3000, "Processador"),
("p004", "RTX 4080", 10000, "Placa de Vídeo"),
("p005", "RTX 3060", 3000, "Placa de Vídeo");