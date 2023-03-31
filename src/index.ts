import express, { Request, Response} from 'express'
import cors from 'cors'
import { users, products, purchases } from './database'
import { HARDWARE, TProduct, TPurchase, TUser } from './types'

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, ()=>{
    console.log("Servidor rodando na porta 3003")
})

app.get("/ping", (req:Request, res:Response)=>{
    res.send("Pong!")
})

// USERS
app.get("/users", (req:Request, res:Response)=>{
    res.status(200).send(users)
})

app.post("/users", (req:Request, res:Response)=>{
    const id = req.body.id as string
    const email = req.body.email as string
    const password = req.body.password as string

    const newUser: TUser = {
        id,
        email,
        password
    }

    users.push(newUser)
    res.status(201).send("Cadastro realizado com sucesso")
})

app.delete("/users/:id",(req:Request, res:Response)=>{
    const id = req.params.id
    const userIndex = users.findIndex((user)=>user.id === id)

    if (userIndex >= 0) {
        users.splice(userIndex, 1)
    }

    res.status(200).send("User apagado com sucesso")
})

app.put("/users/:id", (req:Request, res:Response)=>{
    const id = req.params.id

    const newEmail = req.body.email as string | undefined
    const newPassword = req.body.password as string | undefined

    const user = users.find((user)=> user.id === id)

    if (user) {
        user.email = newEmail || user.email
        user.password = newPassword || user.password
    }

    res.status(200).send("Cadastro atualizado com sucesso")
})

// PRODUCTS
app.get("/products", (req:Request, res:Response)=>{
    res.status(200).send(products)
})

app.get("/product/search", (req:Request, res:Response)=>{
    const q = req.query.q as string

    const result = products.filter((product)=>product.name.toLowerCase().includes(q.toLowerCase()))

    res.status(200).send(result)
})

app.post("/products", (req:Request, res:Response)=>{
    const id = req.body.id as string
    const name = req.body.id as string
    const price = req.body.price as number
    const category = req.body.category as HARDWARE

    const newProduct: TProduct = {
        id, name, price, category
    }

    products.push(newProduct)
    res.status(201).send("´Produto cadastrado com sucesso")
})

app.get("/products/:id", (req:Request,res:Response)=>{
    const id = req.params.id

    const result = products.find((product)=> product.id === id)

    res.status(200).send(result)
})

app.delete("/products/:id",(req:Request,res:Response)=>{
    const id = req.params.id
    const productIndex = products.findIndex((product)=>product.id === id)

    if (productIndex >= 0) {
        products.splice(productIndex, 1)
    }

    res.status(200).send("Produto apagado com sucesso")
})

app.put("/products/:id", (req:Request, res:Response)=>{
    const id = req.params.id

    const newName = req.body.name as string | undefined
    const newPrice = req.body.price as number | undefined
    const newCategory = req.body.category as HARDWARE | undefined

    const product = products.find((product)=> product.id === id)

    if (product){
        product.name = newName || product.name
        product.category = newCategory || product.category
        if (newPrice !== undefined) {
            product.price = isNaN(newPrice) ? product.price : newPrice
        }
    }

    res.status(200).send("Produto atualizado com sucesso")

})

// PURCHASES
app.post("/purchases", (req:Request, res:Response)=>{
    const userId = req.body.userId as string
    const productId = req.body.productId as string
    const quantity = req.body.quantity as number
    const totalPrice = req.body.totalPrice as number

    const newPurchase: TPurchase = {
        userId, productId, quantity, totalPrice
    }

    purchases.push(newPurchase)
    res.status(201).send("Compra realizada com sucesso")
})

app.get("/users/:id/purchases",(req:Request, res:Response)=>{
    const id = req.params.id

    const response = purchases.filter((purchase)=> purchase.userId.includes(id))

    res.status(200).send(response)
})