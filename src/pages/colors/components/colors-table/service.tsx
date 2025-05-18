import { useQuery } from "@tanstack/react-query";
import { Color } from "../../../../types/colors";
import { Response } from "../../../../types/response";
import { potentesApi } from "../../../../utils/api";

const useGetColors = () => {
  return useQuery<Response<Color[]>, Error>({
    queryKey: ["colors"],
    queryFn: async () =>
      (await potentesApi.get<Response<Color[]>>("/colors")).data,
  });
};

export { useGetColors };
