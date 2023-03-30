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