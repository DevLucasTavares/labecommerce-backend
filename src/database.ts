import { TProduct, TPurchase, TUser } from "./types";

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
    category: "cpu",
  },
  {
    id: "p002",
    name: "rtx 3060",
    price: 15,
    category: "graphics card",
  },
];

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
//   const checkQt: boolean = qt === purchases[0].quantity || qt === purchases[1].quantity;
//   const checkPr: boolean = pr === products[0].price || pr === products[1].price;
//   if (checkQt && checkPr) {
    // return qt * pr;
//   } else {
    // return 0;
//   }
return qt * pr;
}

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
