"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./database");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003");
});
app.get("/ping", (req, res) => {
    res.send("Pong!");
});
app.get("/users", (req, res) => {
    res.status(200).send(database_1.users);
});
app.post("/users", (req, res) => {
    const id = req.body.id;
    const email = req.body.email;
    const password = req.body.password;
    const newUser = {
        id,
        email,
        password,
    };
    database_1.users.push(newUser);
    res.status(201).send("Cadastro realizado com sucesso");
});
app.delete("/users/:id", (req, res) => {
    const id = req.params.id;
    const userIndex = database_1.users.findIndex(user => user.id === id);
    if (userIndex >= 0) {
        database_1.users.splice(userIndex, 1);
    }
    res.status(200).send("User apagado com sucesso");
});
app.put("/users/:id", (req, res) => {
    const id = req.params.id;
    const newEmail = req.body.email;
    const newPassword = req.body.password;
    const user = database_1.users.find(user => user.id === id);
    if (user) {
        user.email = newEmail || user.email;
        user.password = newPassword || user.password;
    }
    res.status(200).send("Cadastro atualizado com sucesso");
});
app.get("/products", (req, res) => {
    res.status(200).send(database_1.products);
});
app.get("/product/search", (req, res) => {
    const q = req.query.q;
    const result = database_1.products.filter(product => product.name.toLowerCase().includes(q.toLowerCase()));
    res.status(200).send(result);
});
app.post("/products", (req, res) => {
    const id = req.body.id;
    const name = req.body.id;
    const price = req.body.price;
    const category = req.body.category;
    const newProduct = {
        id,
        name,
        price,
        category,
    };
    database_1.products.push(newProduct);
    res.status(201).send("´Produto cadastrado com sucesso");
});
app.get("/products/:id", (req, res) => {
    const id = req.params.id;
    const result = database_1.products.find(product => product.id === id);
    res.status(200).send(result);
});
app.delete("/products/:id", (req, res) => {
    const id = req.params.id;
    const productIndex = database_1.products.findIndex(product => product.id === id);
    if (productIndex >= 0) {
        database_1.products.splice(productIndex, 1);
    }
    res.status(200).send("Produto apagado com sucesso");
});
app.put("/products/:id", (req, res) => {
    const id = req.params.id;
    const newName = req.body.name;
    const newPrice = req.body.price;
    const newCategory = req.body.category;
    const product = database_1.products.find(product => product.id === id);
    if (product) {
        product.name = newName || product.name;
        product.category = newCategory || product.category;
        if (newPrice !== undefined) {
            product.price = isNaN(newPrice) ? product.price : newPrice;
        }
    }
    res.status(200).send("Produto atualizado com sucesso");
});
app.get("/users/:id/purchases", (req, res) => {
    const id = req.params.id;
    const response = database_1.purchases.filter(purchase => purchase.userId.includes(id));
    res.status(200).send(response);
});
app.post("/purchases", (req, res) => {
    const userId = req.body.userId;
    const productId = req.body.productId;
    const quantity = req.body.quantity;
    const totalPrice = req.body.totalPrice;
    const newPurchase = {
        userId,
        productId,
        quantity,
        totalPrice,
    };
    database_1.purchases.push(newPurchase);
    res.status(201).send("Compra realizada com sucesso");
});
