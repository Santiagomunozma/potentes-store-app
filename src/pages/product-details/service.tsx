import { useQuery } from "@tanstack/react-query";
import { Response } from "../../types/response";
import { Product } from "../../types/product";
import { potentesApi } from "../../utils/api";

const useGetProductDetails = (id: string) => {
  return useQuery({
    queryKey: ["product-details", id],
    queryFn: async () => {
      const response = await potentesApi.get<Response<Product>>(
        `/products/${id}`
      );
      return response.data;
    },
  });
};

export { useGetProductDetails };
