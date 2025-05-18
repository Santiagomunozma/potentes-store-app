import { create } from "zustand";
import { User } from "../../types/users";

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;

  openFormModal: boolean;
  setOpenFormModal: (open: boolean) => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user: User | null) => set({ user }),

  openFormModal: false,
  setOpenFormModal: (open: boolean) => set({ openFormModal: open }),
}));

export { useUserStore };
