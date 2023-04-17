import express, { Request, Response } from "express";
import cors from "cors";
import { db } from "./database/knex";

const app = express();

app.use(express.json());
app.use(cors());

app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003");
});

app.get("/ping", (req: Request, res: Response) => {
  res.send("Pong!");
});


app.get("/users", async (req:Request, res:Response) => {
  try {
    const result = await db("users")
    res.status(200).send(result)
  } catch (error: any) {
    console.log(error)
    res.status(400).send(error.message)
  }
})

app.get("/users/search", async (req: Request, res: Response) => {
  try {
  const q = req.query.q as string;

  if(q.length < 1){
    throw new Error("A pesquisa deve possuir no mínimo 1 caractere")
  }

  const result = await db("users").where( `name`, `like`, `%${q}%` )

  if (result.length < 1) {
    res.statusCode = 404
    throw new Error("'name' não encontrado")
  }

  res.status(200).send(result);

  } catch(error: any) {
    console.log(error)
    res.status(400).send(error.message)
  }
});

app.post("/users", async (req: Request, res: Response) => {
  try{
  const id = req.body.id as string
  const name = req.body.name as string
  const email = req.body.email as string
  const password = req.body.password as string

  if (!id || typeof id !== "string") {
    res.statusCode = 406
    throw new Error("'id' inválido, deve ser uma string")
  }
  const [ checkIfIdAlreadyExists ] = await db("users").where({ id: id })
  if ( checkIfIdAlreadyExists ) {
    res.statusCode = 406
    throw new Error("'id' já registrado")
  }
  if ( id.length !== 4 || !id.startsWith('u') ) {
    res.statusCode = 406
    throw new Error(`'id' deve seguir a formatação 'u000'\n Começar com 'u' e ter 3 números após`)
  }


  if (!name || typeof name !== "string" ) {
    res.statusCode = 406
    throw new Error("'name' inválido, deve ser uma string")
  }
  if ( name.length < 2 ) {
    res.statusCode = 406
    throw new Error("'name' deve possuir 2 ou mais caracteres")
  }


  if (!email || typeof email !== "string") {
    res.statusCode = 406
    throw new Error("'email' inválido, deve ser uma string")
  }
  const [ checkIfEmailAlreadyExists ] = await db("users").where({ email: email })
  if ( checkIfEmailAlreadyExists ) {
    res.statusCode = 406
    throw new Error("'email' já registrado")
  }
  if ( email.includes("@") === false ) {
    res.statusCode = 406
    throw new Error("'email' deve possuir '@'")  
  }

  
  if (!password || typeof password !== "string") {
    res.statusCode = 406
    throw new Error("'password' inválida, deve ser uma string")
  }
  if ( password.length < 5 ) {
    res.statusCode = 406
    throw new Error("'password' deve possuir 5 ou mais caracteres")
  }

  const newUser = {
    id: id,
    name: name,
    email: email,
    password: password,
    createdAt: db.raw(`DATETIME('now', 'localtime')`)
  }
  await db("users").insert(newUser)

  res.status(201).send("Cadastro realizado com sucesso");

} catch(error: any) {
  console.log(error)

  if (res.statusCode === 200){
    res.status(500)
  }

  res.send(error.message) 
}
});

app.get("/users/:id", async (req: Request, res: Response) => {
  try{
  const id = req.params.id;

  const [ user ] = await db("users").where({ id: id })

  if (!user) {
    res.statusCode = 404
    throw new Error("'id' não encontrada")
  }

  res.status(200).send(user);
  
} catch(error: any) {
  console.log(error)

  if (res.statusCode === 200){
    res.status(500)
  }

  res.send(error.message) 
}
});

app.delete("/users/:id", async (req: Request, res: Response) => {
  try{
  const idToDelete = req.params.id;

  const [ user ] = await db("users").where({ id: idToDelete})

  if (!user) {
    res.statusCode = 404
    throw new Error("'id' não encontrada")
  }

  const [ checkIfIsInPurchases ] = await db("purchases").where({ buyer: idToDelete })
  if (checkIfIsInPurchases) {
    res.statusCode = 406
    throw new Error("'id' de usuário vinculada a alguma compra, apague-as primeiro")
  }

  await db("users").del().where({ id: idToDelete })

  res.status(200).send("User apagado com sucesso");

} catch(error: any) {
  console.log(error)

  if (res.statusCode === 200){
    res.status(500)
  }

  res.send(error.message) 
}
});

app.put("/users/:id", async (req: Request, res: Response) => {
  try{
  const id = req.params.id;

  const newName = req.body.name as string | undefined
  const newEmail = req.body.email as string | undefined;
  const newPassword = req.body.password as string | undefined;

  if ( 
    typeof newName === "undefined" && 
    typeof newEmail === "undefined" && 
    typeof newPassword === "undefined" 
    ) {
      res.statusCode = 406; 
      throw new Error("Dados novos não informados, não houveram alterações")
    }

  if ( newName !== undefined ) {
    if (typeof newName !== "string") {
      res.statusCode = 400
      throw new Error("'name' deve ser string")
    }
    if (newName.length < 2) {
      res.statusCode = 406; 
      throw new Error("'name' deve possuir 2 ou mais caracteres")
    }
  }

  if ( newEmail !== undefined ) {
  if (typeof newEmail !== "string") {
    res.statusCode = 406
    throw new Error("'email' inválido, deve ser uma string")
  }
  const [ checkIfEmailAlreadyExists ] = await db("users").where({ email: newEmail })
  if ( checkIfEmailAlreadyExists ) {
    res.statusCode = 406
    throw new Error("'email' já registrado")
  }
  if ( newEmail.includes("@") === false ) {
    res.statusCode = 406
    throw new Error("'email' deve possuir '@'")  
  }}


  if ( newPassword !== undefined ) {
  if (typeof newPassword !== "string") {
    res.statusCode = 406
    throw new Error("'password' inválida, deve ser uma string")
  }
  if ( newPassword.length < 5 ) {
    res.statusCode = 406
    throw new Error("'password' deve possuir 5 ou mais caracteres")
  }}

  const [ user ] = await db("users").where({ id: id})

  if (user) {
    const updatedUser = {
      name: newName || user.name,
      email: newEmail || user.email,
      password: newPassword || user.password
    }
    await db("users").update(updatedUser).where({ id: id })

  } else {
    res.statusCode = 404
    throw new Error("'id' não encontrado")
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



app.get("/products", async (req: Request, res: Response) => {
  try {
    const result = await db("products")

    res.status(200).send(result);
  } catch(error: any) {
    console.log(error)
    res.status(400).send(error.message)
  }
});


app.get("/products/search", async (req: Request, res: Response) => {
  try {
  const q = req.query.q as string;

  if(q.length < 1){
    throw new Error("A pesquisa deve possuir no mínimo 1 caractere")
  }

  const result = await db("products").where( `name`, `like`, `%${q}%` )

  if (result.length < 1) {
    res.statusCode = 404
    throw new Error("'name' não encontrado")
  }

  res.status(200).send(result);

  } catch(error: any) {
    console.log(error)
    res.status(400).send(error.message)
  }
});

app.post("/products", async (req: Request, res: Response) => {
  try {
  const id = req.body.id as string;
  const name = req.body.name as string;
  const price = req.body.price as number;
  const description = req.body.description as string;
  const imageUrl = req.body.imageUrl as string;

    if (typeof id !== "string") {
      res.statusCode = 406; 
      throw new Error("'id' inválido, deve ser uma string")
    }
    const [ checkIfIdAlreadyExists ] = await db("products").where({ id: id })
    if ( checkIfIdAlreadyExists ) {
      res.statusCode = 406
      throw new Error("'id' já registrado")
    }
    if ( id.length !== 4 || !id.startsWith('p') ) {
      res.statusCode = 406
      throw new Error(`'id' deve seguir a formatação 'p000'\n Começar com 'p' e ter 3 números após`)
    }

    if (typeof name !== "string") {
      res.statusCode = 406; 
      throw new Error("'name' inválido, deve ser uma string")
    }
    if (name.length < 2) {
      res.statusCode = 406; 
      throw new Error("'name' deve possuir 2 ou mais caracteres")
    }

    if (typeof price !== "number") {
      res.statusCode = 406; 
      throw new Error("'price' deve ser um number")
    }
    if ( price <= 0 ){
      res.statusCode = 406; 
      throw new Error("'price' deve possuir um valor maior do que 0")
    }

    if (typeof description !== "string") {
      res.statusCode = 406; 
      throw new Error("'description' inválido, deve ser uma string")
    }
    if (description.length < 2) {
      res.statusCode = 406; 
      throw new Error("'description' deve possuir 2 ou mais caracteres")
    }

    if (typeof imageUrl !== "string") {
      res.statusCode = 406; 
      throw new Error("'imageUrl' inválido, deve ser uma string")
    }
    if (imageUrl.length < 2) {
      res.statusCode = 406; 
      throw new Error("'imageUrl' deve possuir 2 ou mais caracteres")
    }

  const newProduct = {
    id: id,
    name: name,
   price: price,
    description: description,
    imageUrl: imageUrl
  }
  await db("products").insert(newProduct)

  res.status(201).send("Produto cadastrado com sucesso");

} catch(error: any) {
  console.log(error)

  if (res.statusCode === 200){
    res.status(500)
  }

  res.send(error.message) 
}
});

app.get("/products/:id", async (req: Request, res: Response) => {
  try{
  const id = req.params.id;

  const [result] = await db("products").where({ id: id })

  if (!result) {
    res.statusCode = 404
    throw new Error("'id' não encontrada")
  }

  res.status(200).send(result);
  
} catch(error: any) {
  console.log(error)

  if (res.statusCode === 200){
    res.status(500)
  }

  res.send(error.message) 
}
});

app.delete("/products/:id", async (req: Request, res: Response) => {
  try{
  const id = req.params.id;

  const [ product ] = await db("products").where({ id: id })

  if (!product) {
    res.statusCode = 404
    throw new Error("'id' não encontrada")
  }

  const [ checkIfIsInPurchases ] = await db("purchases_products").where({ product_id: id })
  if (checkIfIsInPurchases) {
    res.statusCode = 406
    throw new Error("'id' de produto vinculada a alguma compra, apague-as primeiro")
  }

  await db("products").del().where({ id: id })

  res.status(200).send("Produto apagado com sucesso");

} catch(error: any) {
  console.log(error)

  if (res.statusCode === 200){
    res.status(500)
  }

  res.send(error.message) 
}
});

app.put("/products/:id", async (req: Request, res: Response) => {
  try{
  const id = req.params.id;

  const newId = req.body.id as string | undefined;
  const newName = req.body.name as string | undefined;
  const newPrice = req.body.price as number | undefined;
  const newDescription = req.body.description as string | undefined;
  const newImageUrl = req.body.imageUrl as string | undefined;

  if (
    typeof newId === "undefined" && 
    typeof newName === "undefined" && 
    typeof newPrice === "undefined" && 
    typeof newDescription === "undefined" &&
    typeof newImageUrl === "undefined"
    ) {
    res.statusCode = 406
    throw new Error("Dados novos não informados, não houveram alterações")
  }

  const [ product ] = await db("products").where({ id: id})
  if (!product) {
    res.statusCode = 404
    throw new Error("'id' não encontrado")
  }

  if (newId !== undefined) {
    if (typeof newId !== "string") {
      res.statusCode = 406
      throw new Error("'id' deve ser uma string")
    }
    const [ checkIfNewIdAlreadyExists ] = await db("products").where({ id: newId })
    if (checkIfNewIdAlreadyExists) {
      res.statusCode = 406
      throw new Error("'id' já registrado")
    }
    if ( newId.length !== 4 || !newId.startsWith('p') ) {
      res.statusCode = 406
      throw new Error(`'id' deve seguir a formatação 'p000'\n Começar com 'p' e ter 3 números após`)
    }}

  if (newName !== undefined) {
  if (typeof newName !== "string") {
      res.statusCode = 406
      throw new Error("'name' deve ser uma string")
    }
    if (newName.length < 2) {
      res.statusCode = 406; 
      throw new Error("'name' deve possuir 2 ou mais caracteres")
    }}

  if (newPrice !== undefined) {
  if (typeof newPrice !== "number") {
      res.statusCode = 406
      throw new Error("'price' deve ser um number")
  }
  if (newPrice <= 0) {
      res.statusCode = 406
      throw new Error("'price' deve ser maior que zero")
    }}

  if (newDescription !== undefined) {
    if (typeof newDescription !== "string") {
      res.statusCode = 406
      throw new Error("'description' deve ser uma string")
    }
    if (newDescription.length < 1) {
      res.statusCode = 406
      throw new Error("'description' não pode estar em branco")
    }}

  if (newImageUrl !== undefined) {
    if (typeof newImageUrl !== "string") {
      res.statusCode = 406
      throw new Error("'imageUrl' deve ser uma string")
    }
    if (newImageUrl.length < 1) {
      res.statusCode = 406
      throw new Error("'imageUrl' não pode estar em branco")
    }}

  if (product) {
    const updatedProduct = {
      id: newId || product.id,
      name: newName || product.name,
      price: newPrice || product.price,
      description: newDescription || product.description,
      imageUrl: newImageUrl || product.imageUrl
    }

    await db("products").update(updatedProduct).where({ id: id })
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



app.get("/purchases", async (req:Request, res:Response) => {
  try {
    const result = await db("purchases")
    res.status(200).send(result)
  } catch(error: any) {
    console.log(error)
  
    if (res.statusCode === 200){
      res.status(500)
    }
  
    res.send(error.message) 
  }
})

app.get("/purchases/:id", async (req: Request, res: Response) => {
  try{
  const id = req.params.id;

  const [ purchaseInfo ] = await db
  .select(
    "purchases.id AS purchaseId",
    "purchases.totalPrice",
    "purchases.createdAt",
    "purchases.paid AS isPaid",
    "purchases.buyer AS buyerId",
    "users.email",
    "users.name"
  )
  .from("purchases")
  .where( "purchases.id", id )
  .innerJoin(
    "users",
    "purchases.buyer",
    "=",
    "users.id"
  )

  const products = await db("purchases_products")
  .where( "purchases_products.purchase_id", id )
  .select(
    "products.id",
    "products.name",
    "products.price",
    "products.description",
    "products.imageUrl",
    "purchases_products.quantity"
  )
  .innerJoin(
    "products",
    "purchases_products.product_id",
    "=",
    "products.id"
  )

  if (!purchaseInfo) {
    res.statusCode = 404
    throw new Error("'id' da compra não encontrado")
  }

  if (!products) {
    res.statusCode = 404
    throw new Error("Não há produtos nesse 'id' da compra")
  }

  const result = {
    purchaseId: purchaseInfo.purchaseId,
    buyerId: purchaseInfo.buyerId,
    buyerName: purchaseInfo.name,
    buyerEmail: purchaseInfo.email,
    totalPrice: purchaseInfo.totalPrice,
    createdAt: purchaseInfo.createdAt,
    paid: purchaseInfo.isPaid,
    products
  }

  res.status(200).send(result);

} catch(error: any) {
  console.log(error)

  if (res.statusCode === 200){
    res.status(500)
  }

  res.send(error.message) 
}
});

app.get("/users/:id/purchases", async (req: Request, res: Response) => {
  try{
  const id = req.params.id;

  const result = await db("purchases").where({ buyer: id })
  const [ checkIfExists ] = await db("purchases").where({ buyer: id })

  if (!checkIfExists) {
    res.statusCode = 404
    throw new Error("Compras nesse 'id' não encontradas")
  }

  res.status(200).send(result);

} catch(error: any) {
  console.log(error)

  if (res.statusCode === 200){
    res.status(500)
  }

  res.send(error.message) 
}
});

app.post("/purchases", async (req: Request, res: Response) => {
  try{
  const id = req.body.id as string
  const buyer = req.body.buyer as string
  const totalPrice = req.body.totalPrice as number;
  const products = req.body.products;

  if (typeof id !== "string") {res.statusCode = 406; throw new Error("'id' inválido, deve ser uma string")}
  if (typeof buyer !== "string") {res.statusCode = 406; throw new Error("'buyer' inválido, deve ser uma string")}
  if (typeof totalPrice !== "number") {res.statusCode = 406; throw new Error("'totalPrice' inválido, deve ser um number")}
  if (!products || products.length === 0) {res.statusCode = 406; throw new Error("'products' inválido, deve haver algum produto na compra")}
  

  const [ checkIfPurchaseIdAlreadyExists ] = await db("purchases").where({ id: id })
  if (checkIfPurchaseIdAlreadyExists) {
    res.statusCode = 404
    throw new Error("'id' da compra já registrado")
  }

const idsExistentes = new Set();
for (const objeto of products) {
    if (idsExistentes.has(objeto.id)) {
        res.statusCode = 406
        throw new Error(`Produtos duplicados encontrados\n Caso queira adicionar o produto mais de uma vez, use o parâmetro 'quantity'`)
    } else {
        idsExistentes.add(objeto.id);
    }
}

for (let i in products){

  if (typeof products[i].id !== "string") {
    res.statusCode = 406
    throw new Error("'id' do produto deve ser uma string")
  }
  if ( products[i].id.length !== 4 || !products[i].id.startsWith('p') ) {
    res.statusCode = 406
    throw new Error(`'id' do produto deve seguir a formatação 'p000'\n Começar com 'p' e ter 3 números após`)
  }
  const [ checkIfProductIdExists ] = await db("products").where({ id: products[i].id })
  if (!checkIfProductIdExists) {
    res.statusCode = 404
    throw new Error("'id' do produto não encontrado")
  }

  if (typeof products[i].name !== "string") {
    res.statusCode = 406
    throw new Error("'name' do produto deve ser uma string")
  }
  if (products[i].name.length < 2) {
    res.statusCode = 406; 
    throw new Error("'name' do produto deve possuir 2 ou mais caracteres")
  }
  const [ checkIfProductNameExists ] = await db("products")
  .where({ id: products[i].id })
  .andWhere({ name: products[i].name })
  if (!checkIfProductNameExists) {
    res.statusCode = 404
    throw new Error("'name' do produto não corresponde ao 'name' relacionado a esse 'id' de produto")
  }

  if (typeof products[i].price !== "number") {
    res.statusCode = 406
    throw new Error("'price' do produto deve ser um number")
  }
  if (products[i].price <= 0) {
    res.statusCode = 406
    throw new Error("'price' do produto deve ser maior que zero")
  }
  const [ checkIfProductPriceExists ] = await db("products")
  .where({ id: products[i].id })
  .andWhere({ price: products[i].price })

  if (!checkIfProductPriceExists) {
    res.statusCode = 404
    throw new Error("'price' do produto não corresponde ao 'price' relacionado a esse 'id' de produto")
  }

  if (typeof products[i].description !== "string") {
    res.statusCode = 406
    throw new Error("'description' do produto deve ser uma string")
  }
  const [ checkIfProductDescExists ] = await db("products")
  .where({ id: products[i].id })
  .andWhere({ description: products[i].description })

  if (!checkIfProductDescExists) {
    res.statusCode = 404
    throw new Error("'description' do produto não corresponde a 'description' relacionada a esse 'id' de produto")
  }

  if (typeof products[i].imageUrl !== "string") {
    res.statusCode = 406
    throw new Error("'imageUrl' do produto deve ser uma string")
  }
  const [ checkIfProductImageUrlExists ] = await db("products")
  .where({ id: products[i].id })
  .andWhere({ imageUrl: products[i].imageUrl })

  if (!checkIfProductImageUrlExists) {
    res.statusCode = 404
    throw new Error("'imageUrl' do produto não corresponde a 'imageUrl' relacionada a esse 'id' de produto")
  }

  if (typeof products[i].quantity !== "number") {
    res.statusCode = 406
    throw new Error("'quantity' do produto deve ser um number")
  }
  if ( products[i].quantity <= 0 ) {
    res.statusCode = 406
    throw new Error(`'quantity' deve ser maior que zero`)
  }
}

let realTotalPrice = 0
for (let i in products){
const productTotalPrice = products[i].price * products[i].quantity
realTotalPrice = realTotalPrice + productTotalPrice
}
console.log(realTotalPrice)
if (totalPrice !== realTotalPrice) {
  res.statusCode = 406
  throw new Error(`'totalPrice' com valor errado \n Seu valor deve ser ${realTotalPrice}`)
}

const newPurchase = {
  id: id,
  buyer: buyer,
  totalPrice: totalPrice,
  createdAt: db.raw(`DATETIME('now', 'localtime')`),
  paid: 0
}
await db("purchases").insert(newPurchase)

const [ checkIfWasCreated ] = await db("purchases").where({ id: id })
if (checkIfWasCreated) {
  console.log("chegou")

  for(let i in products){
    const newPurchasedProduct = {
      purchase_id: id,
      product_id: products[i].id,
      quantity: products[i].quantity
    }
    await db("purchases_products").insert(newPurchasedProduct)
  }
}

res.status(201).send("Compra realizada com sucesso");

} catch(error: any) {
  console.log(error)

  if (res.statusCode === 200){
    res.status(500)
  }

  res.send(error.message) 
}
});

app.delete("/purchases/:id", async (req:Request, res:Response) => {
  try {
    const id = req.params.id

    const [ purchaseInPurchases ] = await db("purchases").where({ id: id })
    const [ purchaseInPurchasesProducts ] = await db("purchases_products").where({ purchase_id: id })


    if ( !purchaseInPurchases || !purchaseInPurchasesProducts ) {
      res.statusCode = 404
      throw new Error("'id' não encontrada")
    }

    await db("purchases_products").del().where({ purchase_id: id })
    await db("purchases").del().where({ id: id })

    res.status(200).send("Compra apagada com sucesso")

  } catch(error: any) {
    console.log(error)
  
    if (res.statusCode === 200){
      res.status(500)
    }
  
    res.send(error.message) 
  }
})