import { useMutation } from "@tanstack/react-query";
import {
  AuthService,
  LoginData,
  AuthResponse,
} from "../../services/auth.service";
import { Response } from "../../types/response";

const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: LoginData) => {
      const authResponse = await AuthService.login(credentials);
      return authResponse as unknown as Response<{
        user: AuthResponse["data"]["user"];
        token: AuthResponse["data"]["token"];
      }>;
    },
  });
};

export { useLogin };
