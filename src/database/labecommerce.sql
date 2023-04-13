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



--------------------------------------------------------------------------------------------
CREATE TABLE products (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL
);
SELECT
    id AS ID,
    name AS Nome,
    price AS Preço,
    category AS Categorias
FROM products;
DROP TABLE products;

INSERT INTO products (id, name, price, category)
VALUES
("p001", "i7", 2000, "Processador"),
("p002", "Ryzen 7", 2000, "Processador"),
("p003", "i9", 3000, "Processador"),
("p004", "RTX 4080", 10000, "Placa de Vídeo"),
("p005", "RTX 3060", 3000, "Placa de Vídeo");



--------------------------------------------------------------------------------------------
CREATE TABLE purchases (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    total_price REAL NOT NULL,
    paid INTEGER NOT NULL,
    delivered_at TEXT,
    buyer_id TEXT NOT NULL,
    FOREIGN KEY (buyer_id) REFERENCES users(id)
);
SELECT * FROM purchases;
DROP TABLE purchases;

INSERT INTO purchases (id, total_price, paid, buyer_id)
VALUES 
("s001", 100, 0, "u001"),
("s002", 200, 0, "u001"),
("s003", 600, 0, "u002"),
("s004", 400, 0, "u002"),
("s005", 900, 0, "u003"),
("s006", 300, 0, "u003");

UPDATE purchases
SET delivered_at = DATETIME()
WHERE buyer_id = "u001";

SELECT * FROM users
INNER JOIN purchases
ON users.id = buyer_id;




--------------------------------------------------------------------------------------------



-- GET ALL USERS
SELECT * FROM users
ORDER BY email ASC;

-- GEL ALL PRODUCTS V1
SELECT * FROM products
ORDER BY price ASC
LIMIT 20
OFFSET 0;

-- GEL ALL PRODUCTS V2
SELECT * FROM products
WHERE price <= 3000 AND price >= 1000
ORDER BY price ASC;

-- SEARCH PRODUCT BY NAME
SELECT * FROM products
WHERE name LIKE "%RTX%";

-- CREATE USER
INSERT INTO users (id, email, password)
VALUES 
("u004", "milton.tavares@email.com", "123");

-- CREATE PRODUCT
INSERT INTO products (id, name, price, category)
VALUES
("p006", "RX 580", 1000, "Placa de Vídeo");

-- GET PRODUCTS BY ID
SELECT * FROM products
WHERE id = "p001";

-- DELETE USER BY ID
DELETE FROM users
WHERE id = "u001";

-- DELETE PRODUCT BY ID
DELETE FROM products
WHERE id = "p001";

-- EDIT USER BY ID
UPDATE users
SET password = "321"
WHERE id = "u001";

-- EDIT PRODUCT BY ID
UPDATE products
SET price = 1000
WHERE id = "p001"