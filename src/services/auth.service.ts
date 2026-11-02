import { potentesApi } from "../utils/api";
import { User } from "../types/users";

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message: string;
}

export const AuthService = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await potentesApi.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  register: async (userData: Partial<User>): Promise<AuthResponse> => {
    const response = await potentesApi.post<AuthResponse>(
      "/auth/register",
      userData
    );
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await potentesApi.get<{
      data: User;
      message: string;
      status: string;
    }>("/auth/profile");

    return response.data.data;
  },

  logout: (): void => {
    localStorage.removeItem("potentes-access-token");
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("potentes-access-token");
  },

  setToken: (token: string): void => {
    localStorage.setItem("potentes-access-token", token);
  },
};
