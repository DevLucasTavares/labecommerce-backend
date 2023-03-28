import { HARDWARE, TProduct, TPurchase, TUser } from "./types";

export const users: TUser[] = [
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

export const products: TProduct[] = [
  {
    id: "p001",
    name: "i5",
    price: 10,
    category: HARDWARE.CPU,
  },
  {
    id: "p002",
    name: "rtx 3060",
    price: 15,
    category: HARDWARE.GRAPHICS_CARD,
  },
];

export const purchases: TPurchase[] = [
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
];

///////////////////////////////////////////////////////////////////////////////////

function checkId(id: string): string {
  const findPID: boolean = id === products[0].id || id === products[1].id;
  const findUID: boolean = id === users[0].id || id === users[1].id;
  if (findUID || findPID) {
    return id;
  } else {
    return "not found";
  }
}

function calculator(qt: number, pr: number): number {
  return qt * pr;
}

export function createUser(
  newId: string,
  newEmail: string,
  newPassword: string
): string {
  const novoUsuario: TUser = {
    id: newId,
    email: newEmail,
    password: newPassword,
  };
  users.push(novoUsuario);
  return "Cadastro realizado com sucesso";
}

export function getAllUsers(): TUser[] {
  return users;
}

export function createProduct(
  newId: string,
  newName: string,
  newPrice: number,
  newCategory: HARDWARE
): string {
  const novoProduto: TProduct = {
    id: newId,
    name: newName,
    price: newPrice,
    category: newCategory,
  };
  products.push(novoProduto);
  return "Produto criado com sucesso";
}

export function getAllProducts(): TProduct[] {
  return products;
}

export function getProductById(idToSearch: string): TProduct | undefined {
  const productToFind: TProduct | undefined = products.find(
    product => product.id === idToSearch
  );
  return productToFind;
}

export function queryProductsByName(q: string): TProduct[] {
  const qProduct: string = q.toLowerCase();
  const filteredProducts: TProduct[] = products.filter(productFiltered =>
    productFiltered.name.includes(qProduct)
  );
  return filteredProducts;
}

export function createPurchase(
  newUserId: string,
  newProductId: string,
  newQuantity: number,
  newTotalPrice: number
): string {
 const novaCompra: TPurchase = {
  userId: newUserId,
  productId: newProductId,
  quantity: newQuantity,
  totalPrice: newTotalPrice
 }
 purchases.push(novaCompra)
  return "Compra realizada com sucesso"
}

export function getAllPurchasesFromUserId (userIdToSearch:string): TPurchase[] {
  const filteredPurchases: TPurchase[] = purchases.filter(purchaseFiltered => purchaseFiltered.userId === userIdToSearch)
  return filteredPurchases
}
