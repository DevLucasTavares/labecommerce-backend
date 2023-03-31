"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPurchasesFromUserId = exports.createPurchase = exports.queryProductsByName = exports.getProductById = exports.getAllProducts = exports.createProduct = exports.getAllUsers = exports.createUser = exports.purchases = exports.products = exports.users = void 0;
const types_1 = require("./types");
exports.users = [
    {
        id: "u001",
        email: "lucas.tavares@gmail.com",
        password: "21379",
    },
    {
        id: "u002",
        email: "leticia.menezes@gmail.com",
        password: "18385",
    },
];
exports.products = [
    {
        id: "p001",
        name: "i5",
        price: 10,
        category: types_1.HARDWARE.CPU,
    },
    {
        id: "p002",
        name: "rtx 3060",
        price: 15,
        category: types_1.HARDWARE.GRAPHICS_CARD,
    },
];
exports.purchases = [
    {
        userId: checkId("u002"),
        productId: checkId("p001"),
        quantity: 2,
        totalPrice: calculator(2, 10),
    },
    {
        userId: checkId("u001"),
        productId: checkId("p002"),
        quantity: 3,
        totalPrice: calculator(3, 15),
    },
    {
        userId: checkId("u001"),
        productId: checkId("p001"),
        quantity: 1,
        totalPrice: calculator(1, 10),
    }
];
function checkId(id) {
    const findPID = id === exports.products[0].id || id === exports.products[1].id;
    const findUID = id === exports.users[0].id || id === exports.users[1].id;
    if (findUID || findPID) {
        return id;
    }
    else {
        return "not found";
    }
}
function calculator(qt, pr) {
    return qt * pr;
}
function createUser(newId, newEmail, newPassword) {
    const novoUsuario = {
        id: newId,
        email: newEmail,
        password: newPassword,
    };
    exports.users.push(novoUsuario);
    return "Cadastro realizado com sucesso";
}
exports.createUser = createUser;
function getAllUsers() {
    return exports.users;
}
exports.getAllUsers = getAllUsers;
function createProduct(newId, newName, newPrice, newCategory) {
    const novoProduto = {
        id: newId,
        name: newName,
        price: newPrice,
        category: newCategory,
    };
    exports.products.push(novoProduto);
    return "Produto criado com sucesso";
}
exports.createProduct = createProduct;
function getAllProducts() {
    return exports.products;
}
exports.getAllProducts = getAllProducts;
function getProductById(idToSearch) {
    const productToFind = exports.products.find(product => product.id === idToSearch);
    return productToFind;
}
exports.getProductById = getProductById;
function queryProductsByName(q) {
    const qProduct = q.toLowerCase();
    const filteredProducts = exports.products.filter(productFiltered => productFiltered.name.includes(qProduct));
    return filteredProducts;
}
exports.queryProductsByName = queryProductsByName;
function createPurchase(newUserId, newProductId, newQuantity, newTotalPrice) {
    const novaCompra = {
        userId: newUserId,
        productId: newProductId,
        quantity: newQuantity,
        totalPrice: newTotalPrice
    };
    exports.purchases.push(novaCompra);
    return "Compra realizada com sucesso";
}
exports.createPurchase = createPurchase;
function getAllPurchasesFromUserId(userIdToSearch) {
    const filteredPurchases = exports.purchases.filter(purchaseFiltered => purchaseFiltered.userId === userIdToSearch);
    return filteredPurchases;
}
exports.getAllPurchasesFromUserId = getAllPurchasesFromUserId;
