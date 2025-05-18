import { useMutation } from "@tanstack/react-query";
import { potentesApi } from "../../utils/api";
import { User } from "../../types/users";
import { RegisterFormData } from "./index";

const useCreateUser = () => {
  return useMutation({
    mutationFn: async (user: RegisterFormData) => {
      const response = await potentesApi.post<User>("/users", {
        ...user,
        userType: "Customer",
      });
      return response.data;
    },
  });
};

export { useCreateUser };
