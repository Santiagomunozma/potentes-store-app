import { useMutation, useQuery } from "@tanstack/react-query";
import { potentesApi } from "../../../../utils/api";
import { User } from "../../../../types/users";
import { UserFormData } from "./index";
const useCreateUser = () => {
  return useMutation({
    mutationFn: async (user: UserFormData) => {
      if (user.id) {
        const response = await potentesApi.put<User>(`/users/${user.id}`, {
          ...user,
          userType: user.role,
        });
        return response.data;
      }

      const response = await potentesApi.post<User>("/users", {
        ...user,
        userType: user.role,
      });
      return response.data;
    },
  });
};

const useDeleteUser = () => {
  return useMutation<void, Error, string>({
    mutationFn: async (id: string) =>
      (await potentesApi.delete(`/users/${id}`)).data,
  });
};

const useGetUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await potentesApi.get<User[]>("/users");
      return response.data;
    },
  });
};

const useGetUser = (id: string) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: async () => {
      const response = await potentesApi.get<User>(`/users/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export { useCreateUser, useDeleteUser, useGetUsers, useGetUser };
