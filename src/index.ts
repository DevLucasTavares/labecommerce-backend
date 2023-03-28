import { users, products, purchases, createUser, getAllUsers, createProduct, getAllProducts, getProductById, queryProductsByName, createPurchase, getAllPurchasesFromUserId } from "./database"
import { HARDWARE } from "./types"

console.log("App iniciado!")

// console.log (users)
// console.log(products)
// console.log(purchases)

// console.log("\n")

// console.log(createUser("u003", "henrique.tavares@gmail.com", "37184"))
// console.log(getAllUsers())
// console.log(createProduct("p003", "8gb ddr5", 22, HARDWARE.RAM))
// console.log(getAllProducts())
// console.log(getProductById("p003"))

// console.log("\n")

// console.log(queryProductsByName("tx"))
// console.log(createPurchase("u002", "p002", 2, 30))
// console.log(getAllPurchasesFromUserId("u002"))