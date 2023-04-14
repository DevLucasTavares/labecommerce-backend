import express, { Request, Response } from "express";
import cors from "cors";
import { users, products, purchases } from "./database";
import { HARDWARE, TProduct, TPurchase, TUser } from "./types";
import { db } from "./database/knex";

const app = express();

app.use(express.json());
app.use(cors());

// START
app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003");
});

// TEST
app.get("/ping", (req: Request, res: Response) => {
  res.send("Pong!");
});


// ----- USERS

// GET ALL USERS
app.get("/users", async (req:Request, res:Response) => {
  try {
    const result = await db.raw(`
    SELECT * FROM users;
    `)
    res.status(200).send(result)

  } catch (error: any) {
    console.log(error)
    res.status(400).send(error.message)
  }
})

// CREATE USER
app.post("/users", async (req: Request, res: Response) => {
  try{
  const id = req.body.id as string
  const name = req.body.name as string
  const email = req.body.email as string
  const password = req.body.password as string

  if (!id || !name || !email || !password) {
    res.statusCode = 406
    throw new Error("Dados inválidos")
  }

  await db.raw(`
  INSERT INTO users (id, name, email, password, createdAt)
  VALUES ("${id}", "${name}", "${email}", "${password}", DATETIME("now"))
  `)

  res.status(201).send("Cadastro realizado com sucesso");

} catch(error: any) {
  console.log(error)

  if (res.statusCode === 200){
    res.status(500)
  }

  res.send(error.message) 
}
});

// DELETE USER
app.delete("/users/:id", (req: Request, res: Response) => {
  try{
  const id = req.params.id;
  const userIndex = users.findIndex(user => user.id === id);
  const userExists = users.find((user) => user.id === id)

  if (!userExists) {
    res.statusCode = 404
    throw new Error("'id' não encontrado")
  }

  if (userIndex >= 0) {
    users.splice(userIndex, 1);
  }

  res.status(200).send("User apagado com sucesso");

} catch(error: any) {
  console.log(error)

  if (res.statusCode === 200){
    res.status(500)
  }

  res.send(error.message) 
}
});

// EDIT USER BY ID
app.put("/users/:id", (req: Request, res: Response) => {
  try{
  const id = req.params.id;

  const newEmail = req.body.email as string | undefined;
  const newPassword = req.body.password as string | undefined;

  if ( typeof newEmail === "undefined" && typeof newPassword === "undefined" ) {
    res.statusCode = 406
    throw new Error("Dados novos não informados, não houveram alterações")
  }

  const user = users.find((user) => user.id === id);

  if (!user) {
    res.statusCode = 404
    throw new Error("'id' não encontrado")
  } else if (user) {
    user.email = newEmail || user.email;
    user.password = newPassword || user.password; 
  }

  if ( typeof newEmail === "undefined" ) {
    res.status(200).send("Senha atualizada com sucesso")
  }
  if ( typeof newPassword === "undefined" ) {
    res.status(200).send("E-mail atualizado com sucesso")
  }
  res.status(200).send("Cadastro atualizado com sucesso");

} catch(error: any) {
  console.log(error)

  if (res.statusCode === 200){
    res.status(500)
  }

  res.send(error.message) 
}
});



// ----- PRODUCTS

// GET ALL PRODUCTS
app.get("/products", async (req: Request, res: Response) => {
  try {
    const result = await db.raw(`
    SELECT * FROM products;
    `)
    res.status(200).send(result);
  } catch(error: any) {
    console.log(error)
    res.status(400).send(error.message)
  }
});

// SEARCH PRODUCT BY NAME
app.get("/product/search", async (req: Request, res: Response) => {
  try {
  const q = req.query.q as string;

  if(q.length < 1){
    throw new Error("A pesquisa deve possuir no mínimo 1 caractere")
  }

  const result = await db.raw(`
  SELECT * FROM products
  WHERE name LIKE "%${q}%";
  `)

  res.status(200).send(result);

  } catch(error: any) {
    console.log(error)
    res.status(400).send(error.message)
  }
});

// CREATE PRODUCT
app.post("/products", async (req: Request, res: Response) => {
  try {
  const id = req.body.id as string;
  const name = req.body.name as string;
  const price = req.body.price as number;
  const description = req.body.description as string;
  const imageUrl = req.body.imageUrl as string;

    if (typeof id !== "string") {res.statusCode = 406; throw new Error("'id' inválido, deve ser uma string")}
    if (typeof name !== "string") {res.statusCode = 406; throw new Error("'name' inválido, deve ser uma string")}
    if (typeof price !== "number") {res.statusCode = 406; throw new Error("'price' deve ser um number")}
    if (typeof description !== "string") {res.statusCode = 406; throw new Error("'description' inválido, deve ser uma string")}
    if (typeof imageUrl !== "string") {res.statusCode = 406; throw new Error("'imageUrl' inválido, deve ser uma string")}

    /*const values = Object.values(HARDWARE)
    if (!values.includes(category)){
      res.statusCode = 406
      throw new Error("'category' deve ser válida")}*/

    /*const idExists = await db.raw (`
    SELECT name FROM users
    WHERE id = "${id}";
    `)*/

    // const idExists = products.find((product)=> product.id === id)
    /*if (idExists === null) {
      res.statusCode = 409
      throw new Error("'id' já cadastrado")
    }*/

  /*const newProduct: TProduct = {
    id,
    name,
    price,
    category,
  };*/
  await db.raw (`
INSERT INTO products ( id, name, price, description, imageUrl )
VALUES ("${id}", "${name}", "${price}", "${description}", "${imageUrl}")
`)
  res.status(201).send("Produto cadastrado com sucesso");

} catch(error: any) {
  console.log(error)

  if (res.statusCode === 200){
    res.status(500)
  }

  res.send(error.message) 
}
});

// SEARCH PRODUCT BY ID
app.get("/products/:id", async (req: Request, res: Response) => {
  try{
  const id = req.params.id;

  // const result = products.find(product => product.id === id);

  /*if (!result) {
    res.statusCode = 404
    throw new Error("'id' não encontrado")
  }*/

  const result = await db.raw(`
    SELECT * FROM products
    WHERE id = "${id}";
  `)

  res.status(200).send(result);
  
} catch(error: any) {
  console.log(error)

  if (res.statusCode === 200){
    res.status(500)
  }

  res.send(error.message) 
}
});

// DELETE PRODUCT
app.delete("/products/:id", (req: Request, res: Response) => {
  try{
  const id = req.params.id;
  const productIndex = products.findIndex(product => product.id === id);
  const productExists = products.find((product)=> product.id === id)

  if(!productExists) {
    res.statusCode = 404
    throw new Error("'id' não encontrado")
  }

  if (productIndex >= 0) {
    products.splice(productIndex, 1);
  }

  res.status(200).send("Produto apagado com sucesso");

} catch(error: any) {
  console.log(error)

  if (res.statusCode === 200){
    res.status(500)
  }

  res.send(error.message) 
}
});

// EDIT PRODUCT
app.put("/products/:id", (req: Request, res: Response) => {
  try{
  const id = req.params.id;

  const newName = req.body.name as string | undefined;
  const newPrice = req.body.price as number | undefined;
  const newCategory = req.body.category as HARDWARE

  if (typeof newName === "undefined" && typeof newPrice === "undefined" && typeof newCategory === "undefined" ) {
    res.statusCode = 406
    throw new Error("Dados novos não informados, não houveram alterações")
  }

  const product = products.find(product => product.id === id);

  if (!product) {
    res.statusCode = 404
    throw new Error("'id' não encontrado")
  }

  if (typeof newName !== "string") {
      res.statusCode = 406
      throw new Error("'name' deve ser uma string")
    }

  if (typeof newPrice !== "number") {
      res.statusCode = 406
      throw new Error("'price' deve ser um number")
  }
  
  if (newPrice <= 0) {
      res.statusCode = 406
      throw new Error("'price' deve ser maior que zero")
    }

  const values = Object.values(HARDWARE)
  if (!values.includes(newCategory)){
      res.statusCode = 406
      throw new Error("'category' deve ser válida")
    }

  if (product) {
    product.name = newName || product.name;
    product.category = newCategory || product.category;
    if (newPrice !== undefined) {
      product.price = isNaN(newPrice) ? product.price : newPrice;
    }
  }

  res.status(200).send("Produto atualizado com sucesso");

} catch(error: any) {
  console.log(error)

  if (res.statusCode === 200){
    res.status(500)
  }

  res.send(error.message) 
}
});



// ----- PURCHASES

// ALL PURCHASES BY USER ID
app.get("/users/:id/purchases", async (req: Request, res: Response) => {
  try{
  const id = req.params.id;

  // const userExists = users.find((user) => user.id === id)

  /*if (!userExists) {
    res.statusCode = 404
    throw new Error("'id' não encontrado")
  }*/

  // const response = purchases.filter(purchase => purchase.userId.includes(id));

  const response = await db.raw(`
    SELECT * FROM purchases
    WHERE buyer = "${id}";
  `)


  res.status(200).send(response);

} catch(error: any) {
  console.log(error)

  if (res.statusCode === 200){
    res.status(500)
  }

  res.send(error.message) 
}
});

// CREATE PURCHASE
app.post("/purchases", async (req: Request, res: Response) => {
  try{
  const id = req.body.id as string
  const buyer = req.body.buyer as string
  // const userId = req.body.userId as string;
  // const productId = req.body.productId as string;
  // const quantity = req.body.quantity as number;
  const totalPrice = req.body.totalPrice as number;

  if (typeof id !== "string") {res.statusCode = 406; throw new Error("'id' inválido, deve ser uma string")}
  if (typeof buyer !== "string") {res.statusCode = 406; throw new Error("'buyer' inválido, deve ser uma string")}
  if (typeof totalPrice !== "number") {res.statusCode = 406; throw new Error("'totalPrice' inválido, deve ser um number")}


  /*if ( typeof userId !== "string" && typeof productId !== "string" ) {
    res.statusCode = 406
    throw new Error("'userId' e 'productId' devem ser uma string")
  }*/

  /*if ( typeof quantity !== "number" && typeof totalPrice !== "number" ) {
    res.statusCode = 406
    throw new Error("'quantity' e 'totalPrice' devem ser um number")
  }*/

  /*const userIdExists = users.find((user)=> user.id === userId)
  const productIdExists = products.find((product)=> product.id === productId)
  if (!userIdExists || !productIdExists) {
    res.statusCode = 404
    throw new Error("'id' de usuário ou produto inexistente")
  }*/

  /*let productPrice = 0
  for (let i in products) {
    if (products[i].id === productId) {
      productPrice = products[i].price
    }
  }
  if (productPrice * quantity !== totalPrice) {
    res.statusCode = 406
    throw new Error("A quantidade total da compra não está com o cálculo correto\n Esse produto custa R$"+productPrice)
  }*/


  /*const newPurchase: TPurchase = {
    userId,
    productId,
    quantity,
    totalPrice,
  };
  purchases.push(newPurchase);*/

  await db.raw (`
INSERT INTO purchases ( id, buyer, totalPrice, createdAt, paid )
VALUES ("${id}", "${buyer}", "${totalPrice}", DATETIME('now', 'localtime'), "0")
`)

  res.status(201).send("Compra realizada com sucesso");

} catch(error: any) {
  console.log(error)

  if (res.statusCode === 200){
    res.status(500)
  }

  res.send(error.message) 
}
});
