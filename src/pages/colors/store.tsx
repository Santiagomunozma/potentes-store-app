import { create } from "zustand";
import { Color } from "../../types/colors";

interface ColorStore {
  color: Color | null;
  setColor: (color: Color | null) => void;

  openFormModal: boolean;
  setOpenFormModal: (open: boolean) => void;
}

const useColorStore = create<ColorStore>((set) => ({
  color: null,
  setColor: (color: Color | null) => set({ color }),

  openFormModal: false,
  setOpenFormModal: (open: boolean) => set({ openFormModal: open }),
}));

export { useColorStore };
