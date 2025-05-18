import { create } from "zustand";
import { User } from "../types/users";

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setUser: (user: User) => void;
  logout: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  setUser: (user: User) =>
    set({
      user,
      isAuthenticated: true,
      isAdmin:
        user.userType === "Employee" && user.employee?.employeeType === "Admin",
    }),
  logout: () => set({ user: null, isAuthenticated: false, isAdmin: false }),
}));

export default useAuthStore;
