import { Color } from "./colors";
import { Product } from "./product";
import { Size } from "./sizes";

type ProductSell = {
  id?: string;
  product: Product;
  quantity: number;
  color: Color;
  size: Size;
  totalPrice: number;
};

export type { ProductSell };
