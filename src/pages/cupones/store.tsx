import { create } from "zustand";
import { Coupon } from "../../types/coupons";

interface CouponStore {
  coupon: Coupon | null;
  setCoupon: (coupon: Coupon | null) => void;

  openFormModal: boolean;
  setOpenFormModal: (open: boolean) => void;
}

const useCouponStore = create<CouponStore>((set) => ({
  coupon: null,
  setCoupon: (coupon: Coupon | null) => set({ coupon }),

  openFormModal: false,
  setOpenFormModal: (open: boolean) => set({ openFormModal: open }),
}));

export { useCouponStore };
