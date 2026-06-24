import { number } from "framer-motion";

export type DiscountType = "PERCENTAGE" | "FIXED_AMOUNT";

export type Promotion = {
  id: string;
  description?: string;
  campaignName: string;
  minOrderValue: number;
  discountType: DiscountType;
  discountValue: number;
  startsAt: Date;
  expiresAt?: Date;
  isActive?: boolean;
};
