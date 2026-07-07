import { AddOn } from "@/types/shared/addOn.type";
import { Order } from "@/types/shared/order.type";
import { PaymentMethod } from "@/types/shared/transaction.type";
export type OrderDraftDataType = {
  quantities: Record<string, number>;
  pickupAddress: string;
  pickupTime: string;
  pickupDate: string;
  deliveryAddress: string;
  note: string;
  addOns: AddOn[];
  totalPrice: number;
  paymentMethod: PaymentMethod;
};

export type OrderContextType = {
  isOrdersLoading: boolean;
  orderData?: Order[] | null;
  error: string | null;
};

export type OrderDraftContextType = {
  data: OrderDraftDataType | null;
  saveOrder: (data: OrderDraftDataType) => void;
  clearOrder: () => void;
};
