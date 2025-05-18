import { useMutation } from "@tanstack/react-query";
import { SellsService, CreateSellRequest } from "../../services/sells.service";
import { potentesApi } from "../../utils/api";

interface CouponResponse {
  id: string;
  code: string;
  discount: number;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Hook para crear una nueva venta
 */
export const useCreateSell = () => {
  return useMutation({
    mutationFn: async (sellData: CreateSellRequest) => {
      return await SellsService.createSell(sellData);
    },
  });
};

/**
 * Hook para validar un cupón
 */
export const useValidateCoupon = () => {
  return useMutation({
    mutationFn: async (code: string) => {
      const response = await potentesApi.get<CouponResponse>(
        `/coupons/code/${code}`
      );
      return response.data;
    },
  });
};
