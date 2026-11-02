import { create } from "zustand";
import { User } from "../types/users";

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isHydrating: boolean;
  setUser: (user: User) => void;
  finishHydration: () => void;
  logout: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isHydrating: !!localStorage.getItem("potentes-access-token"),
  setUser: (user: User) =>
    set({
      user,
      isAuthenticated: true,
      isHydrating: false,
      isAdmin:
        user.userType === "Employee" && user.employee?.employeeType === "Admin",
    }),
  finishHydration: () => set({ isHydrating: false }),
  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      isHydrating: false,
    }),
}));

export default useAuthStore;
