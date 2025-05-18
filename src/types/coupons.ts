type Coupon = {
  id?: string;
  code: string;
  discount: number;
  startDate: Date;
  endDate: Date;
  status: string;
};

export type { Coupon };
