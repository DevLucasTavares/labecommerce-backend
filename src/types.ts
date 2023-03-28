export type TUser = {
  id: string;
  email: string;
  password: string;
};

export type TProduct = {
  id: string;
  name: string;
  price: number;
  category: HARDWARE;
};

export type TPurchase = {
  userId: string;
  productId: string;
  quantity: number;
  totalPrice: number;
};

export enum HARDWARE {
  COOLER = "Cooler",
  CPU = "Processador",
  FONTE = "Fonte",
  GRAPHICS_CARD = "Placa de Vídeo",
  HD = "Disco Rígido (HD)",
  MOBO = "Placa-mãe",
  RAM = "Memória RAM",
  SSD = "SSD",
}