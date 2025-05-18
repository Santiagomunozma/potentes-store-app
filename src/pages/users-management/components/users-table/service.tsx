import { useQuery } from "@tanstack/react-query";
import { User } from "../../../../types/users";
import { potentesApi } from "../../../../utils/api";
import { Response } from "../../../../types/response";

const useGetUsers = () => {
  return useQuery<Response<User[]>, Error>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await potentesApi.get<Response<User[]>>("/users");
      return response.data;
    },
  });
};

export { useGetUsers };
