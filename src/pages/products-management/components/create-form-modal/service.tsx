import { useMutation } from "@tanstack/react-query";
import { Product } from "../../../../types/product";
import { ProductFormData } from ".";
import { potentesApi } from "../../../../utils/api";

const useCreateProduct = () => {
  return useMutation({
    mutationFn: async (product: ProductFormData) => {
      if (product.id) {
        const response = await potentesApi.put<Product>(
          `/products/${product.id}`,
          product
        );
        return response.data;
      }

      const response = await potentesApi.post<Product>("/products", product);
      return response.data;
    },
  });
};

const useDeleteProduct = () => {
  return useMutation<void, Error, string>({
    mutationFn: async (id: string) =>
      (await potentesApi.delete(`/products/${id}`)).data,
  });
};

export { useCreateProduct, useDeleteProduct };
