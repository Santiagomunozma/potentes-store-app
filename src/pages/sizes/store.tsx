import { create } from "zustand";
import { Size } from "../../types/sizes";

interface SizeStore {
  size: Size | null;
  setSize: (size: Size | null) => void;

  openFormModal: boolean;
  setOpenFormModal: (open: boolean) => void;
}

const useSizeStore = create<SizeStore>((set) => ({
  size: null,
  setSize: (size: Size | null) => set({ size }),

  openFormModal: false,
  setOpenFormModal: (open: boolean) => set({ openFormModal: open }),
}));

export { useSizeStore };
