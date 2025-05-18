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
    // Primero obtenemos los datos básicos del perfil
    const response = await potentesApi.get<{
      success: boolean;
      data: User;
      message: string;
    }>("/auth/profile");

    // Verificamos si el usuario es de tipo Employee
    if (response.data.data.userType === "Employee" && response.data.data.id) {
      try {
        // Intentamos obtener los datos específicos del empleado con un endpoint adicional si es necesario
        // Si tu API ya incluye la información del empleado en la respuesta del perfil, puedes omitir esto
        const employeeResponse = await potentesApi.get<{
          success: boolean;
          data: User;
          message: string;
        }>(`/employees/${response.data.data.id}`);

        if (employeeResponse.data && employeeResponse.data.data) {
          // Combinamos los datos del perfil con los datos del empleado
          return {
            ...response.data.data,
            employee: employeeResponse.data.data.employee,
          };
        }
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    }

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
