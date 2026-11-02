import { Customer, User } from "../types/users";

type ProductSell = {
  id?: string;
  productId: string;
  quantity: number;
  totalPrice: number; // Total price for the product in the sell
};

type Sell = {
  id?: string;
  customerId: string;
  customer?: Customer & { user?: User };
  employeeId?: string;
  totalPrice: number; // Total price for the entire sell
  productSells: ProductSell[];
  createdAt?: string; // Fecha de creación
  status?: "paid" | "preparing" | "shipped" | "cancelled" | "completed" | "pending";
  orderNumber?: string; // Número de orden para referencia
};

export type { Sell, ProductSell };
