import { useQuery } from "@tanstack/react-query";
import { Sell } from "../../../../types/sells";
import { potentesApi } from "../../../../utils/api";
import { Response } from "../../../../types/response";

const useGetSell = () => {
  return useQuery<Response<Sell[]>, Error>({
    queryKey: ["sells"],
    queryFn: async () => {
      const response = await potentesApi.get<Response<Sell[]>>("/sells");
      return response.data;
    },
  });
};

export { useGetSell };
