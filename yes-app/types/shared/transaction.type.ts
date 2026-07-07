export type PaymentMethod = "CASH" | "CARD" | "MOBILE_MONEY";
export type PaymentProvider = "MTN" | "AIRTELTIGO" | "TELECEL";
export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

export interface Transaction {
  id: string;
  orderId: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  reference?: string | null;
  failureReason?: string | null;
  provider: PaymentProvider;
  createdAt: string;
  updatedAt: string;
}
