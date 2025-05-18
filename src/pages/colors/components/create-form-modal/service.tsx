import { useMutation } from "@tanstack/react-query";
import { colorFormData } from ".";
import { potentesApi } from "../../../../utils/api";
import { Color } from "../../../../types/colors";

const useCreateColors = () => {
  return useMutation({
    mutationFn: async (color: colorFormData) => {
      if (color.id) {
        const response = await potentesApi.put<Color>(
          `/colors/${color.id}`,
          color
        );
        return response.data;
      }

      const response = await potentesApi.post<Color>("/colors", color);
      return response.data;
    },
  });
};

const useDeleteColor = () => {
  return useMutation<void, Error, string>({
    mutationFn: async (id: string) =>
      (await potentesApi.delete(`/colors/${id}`)).data,
  });
};

export { useCreateColors, useDeleteColor };
