import { useQuery } from "@tanstack/react-query";
import { Product } from "../../../../types/product";
import { potentesApi } from "../../../../utils/api";
import { Response } from "../../../../types/response";

const useGetProducts = () => {
  return useQuery<Response<Product[]>, Error>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await potentesApi.get<Response<Product[]>>("/products");
      return response.data;
    },
  });
};

export { useGetProducts };
