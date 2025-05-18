import { potentesApi } from "../../../utils/api";

export interface CouponStats {
  label: string;
  value: string;
  change: string;
}

export const getCouponStats = async (): Promise<CouponStats[]> => {
  const { data } = await potentesApi.get<CouponStats[]>("/coupons/stats");
  return data;
};
