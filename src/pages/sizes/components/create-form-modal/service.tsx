import { useMutation } from "@tanstack/react-query";
import { potentesApi } from "../../../../utils/api";
import { Size } from "../../../../types/sizes";
import { SizeFormData } from ".";

const useCreateSize = () => {
  return useMutation({
    mutationFn: async (size: SizeFormData) => {
      if (size.id) {
        const response = await potentesApi.put<Size>(`/sizes/${size.id}`, size);
        return response.data;
      }

      const response = await potentesApi.post<Size>("/sizes", size);
      return response.data;
    },
  });
};

const useDeleteSize = () => {
  return useMutation<void, Error, string>({
    mutationFn: async (id: string) =>
      (await potentesApi.delete(`/sizes/${id}`)).data,
  });
};

export { useCreateSize, useDeleteSize };
