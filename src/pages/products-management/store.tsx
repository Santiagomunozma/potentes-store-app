import { create } from "zustand";
import { Product } from "../../types/product";

interface ProductStore {
  product: Product | null;
  setProduct: (product: Product | null) => void;

  openFormModal: boolean;
  setOpenFormModal: (open: boolean) => void;
}

const useProductStore = create<ProductStore>((set) => ({
  product: null,
  setProduct: (product: Product | null) => set({ product }),

  openFormModal: false,
  setOpenFormModal: (open: boolean) => set({ openFormModal: open }),
}));

export { useProductStore };
