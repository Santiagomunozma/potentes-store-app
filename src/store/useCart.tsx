import { create } from "zustand";
import { ProductSell } from "../types/product-sell";
import { TAX_RATE } from "../app/constants";

interface CartStore {
  cart: ProductSell[];
  subtotal: number;
  taxes: number;
  total: number;
  addToCart: (productSell: ProductSell) => void;
  removeFromCart: (productSell: ProductSell) => void;
  clearCart: () => void;
}

const useCartStore = create<CartStore>((set) => ({
  cart: [],
  subtotal: 0,
  taxes: 0,
  total: 0,
  addToCart: (productSell: ProductSell) =>
    set((state) => {
      const newSubtotal = state.subtotal + productSell.totalPrice;
      const newTaxes = newSubtotal * TAX_RATE;
      return {
        cart: [...state.cart, productSell],
        subtotal: newSubtotal,
        taxes: newTaxes,
        total: newSubtotal + newTaxes,
      };
    }),
  removeFromCart: (productSell: ProductSell) =>
    set((state) => {
      const newSubtotal = state.subtotal - productSell.totalPrice;
      const newTaxes = newSubtotal * TAX_RATE;
      return {
        cart: state.cart.filter((item) => item.id !== productSell.id),
        subtotal: newSubtotal,
        taxes: newTaxes,
        total: newSubtotal + newTaxes,
      };
    }),
  clearCart: () => set({ cart: [], subtotal: 0, taxes: 0, total: 0 }),
}));

export default useCartStore;
