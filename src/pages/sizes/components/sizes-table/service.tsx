import { useQuery } from "@tanstack/react-query";
import { Size } from "../../../../types/sizes";
import { potentesApi } from "../../../../utils/api";
import { Response } from "../../../../types/response";

const useGetSizes = () => {
  return useQuery<Response<Size[]>, Error>({
    queryKey: ["sizes"],
    queryFn: async () =>
      (await potentesApi.get<Response<Size[]>>("/sizes")).data,
  });
};

export { useGetSizes };
