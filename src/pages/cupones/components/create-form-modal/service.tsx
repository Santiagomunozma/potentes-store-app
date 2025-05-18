import { useMutation } from "@tanstack/react-query";
import { potentesApi } from "../../../../utils/api";
import { Coupon } from "../../../../types/coupons";
import { CouponFormData } from ".";

const useCreateCoupons = () => {
  return useMutation({
    mutationFn: async (coupon: CouponFormData) => {
      if (coupon.id) {
        const response = await potentesApi.put<Coupon>(
          `/coupons/${coupon.id}`,
          coupon
        );
        return response.data;
      }

      const response = await potentesApi.post<Coupon>("/coupons", coupon);
      return response.data;
    },
  });
};

const useDeleteCoupon = () => {
  return useMutation<void, Error, string>({
    mutationFn: async (id: string) =>
      (await potentesApi.delete(`/coupons/${id}`)).data,
  });
};

export { useCreateCoupons, useDeleteCoupon };
