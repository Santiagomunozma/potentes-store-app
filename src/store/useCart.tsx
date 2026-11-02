import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProductSell } from "../types/product-sell";
import { TAX_RATE } from "../app/constants";

export type CartLine = ProductSell & { maxStock?: number };

interface CartStore {
  cart: CartLine[];
  subtotal: number;
  taxes: number;
  total: number;
  addToCart: (productSell: CartLine) => void;
  removeFromCart: (productSell: ProductSell) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const lineKey = (item: ProductSell) =>
  `${item.product.id}-${item.size.id ?? item.size.size}-${item.color.id ?? item.color.color}`;

const withTotals = (cart: CartLine[]) => {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const taxes = subtotal * TAX_RATE;
  return { cart, subtotal, taxes, total: subtotal + taxes };
};

const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cart: [],
      subtotal: 0,
      taxes: 0,
      total: 0,
      addToCart: (productSell) =>
        set((state) => {
          const id = lineKey(productSell);
          const existing = state.cart.find((item) => lineKey(item) === id);
          const maxStock = productSell.maxStock ?? existing?.maxStock;

          if (existing) {
            const requested = existing.quantity + productSell.quantity;
            const quantity = Math.min(maxStock ?? requested, requested);
            const next = state.cart.map((item) =>
              lineKey(item) === id
                ? {
                    ...item,
                    ...productSell,
                    id,
                    quantity,
                    maxStock,
                    totalPrice: productSell.product.price * quantity,
                  }
                : item
            );
            return withTotals(next);
          }

          const quantity = Math.min(
            maxStock ?? productSell.quantity,
            productSell.quantity
          );
          return withTotals([
            ...state.cart,
            {
              ...productSell,
              id,
              quantity,
              maxStock,
              totalPrice: productSell.product.price * quantity,
            },
          ]);
        }),
      removeFromCart: (productSell) =>
        set((state) =>
          withTotals(
            state.cart.filter(
              (item) => item.id !== productSell.id && lineKey(item) !== lineKey(productSell)
            )
          )
        ),
      updateQuantity: (id, quantity) =>
        set((state) =>
          withTotals(
            state.cart.map((item) => {
              if (item.id !== id) return item;
              const nextQty = Math.max(
                1,
                Math.min(quantity, item.maxStock ?? quantity)
              );
              return {
                ...item,
                quantity: nextQty,
                totalPrice: item.product.price * nextQty,
              };
            })
          )
        ),
      clearCart: () => set({ cart: [], subtotal: 0, taxes: 0, total: 0 }),
    }),
    { name: "potentes-cart" }
  )
);

export default useCartStore;
export { lineKey };
