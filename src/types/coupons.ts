type Coupon = {
  id?: string;
  code: string;
  discount: number;
  startDate: Date;
  endDate: Date;
  status: string;
  maxUses?: number | null;
  usedCount?: number;
};

export type { Coupon };
