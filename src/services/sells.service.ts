import { potentesApi } from "../utils/api";
import { Sell } from "../types/sells";
import { ProductSell } from "../types/product-sell";

export interface CreateSellRequest {
  customerId: string;
  employeeId?: string;
  totalPrice: number;
  couponCode?: string;
  products: {
    productId: string;
    colorId: string;
    sizeId: string;
    quantity: number;
    totalPrice: number;
  }[];
}

export interface SellResponse {
  success: boolean;
  data: Sell;
  message: string;
}

export interface SellsHistoryResponse {
  success: boolean;
  data: Sell[];
  message: string;
}

export const SellsService = {
  /**
   * Crea una nueva venta en el sistema
   * @param sellData Datos de la venta a crear
   * @returns La venta creada
   */
  createSell: async (sellData: CreateSellRequest): Promise<SellResponse> => {
    const response = await potentesApi.post<SellResponse>("/sells", sellData);
    return response.data;
  },

  /**
   * Obtiene el historial de compras del usuario actual
   * @returns Lista de ventas del usuario
   */
  getUserPurchaseHistory: async (): Promise<SellsHistoryResponse> => {
    const response =
      await potentesApi.get<SellsHistoryResponse>("/sells/my-sells");
    return response.data;
  },

  /**
   * Convierte los items del carrito al formato requerido por la API
   * @param cartItems Items del carrito
   * @returns Items formateados para la API
   */
  formatCartItemsForAPI: (cartItems: ProductSell[]) => {
    return cartItems.map((item) => ({
      productId: item.product.id!, // Asumimos que el producto siempre tiene un ID
      colorId: item.color.id!, // Incluimos el ID del color seleccionado
      sizeId: item.size.id!, // Incluimos el ID de la talla seleccionada
      quantity: item.quantity,
      totalPrice: item.totalPrice,
    }));
  },
};
