import { useQuery } from "@tanstack/react-query";
import { potentesApi } from "../../../../utils/api";
import { Coupon } from "../../../../types/coupons";
import { Response } from "../../../../types/response";

const useGetCoupons = () => {
  return useQuery<Response<Coupon[]>, Error>({
    queryKey: ["coupons"],
    queryFn: async () => {
      const response = await potentesApi.get<Response<Coupon[]>>("/coupons");
      return response.data;
    },
  });
};

export { useGetCoupons };
