export type ServicePriceModel = "PER_ITEM" | "PER_BAG" | "BY_WEIGHT";

export type Service = {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  turnaroundTime: string;
  basePrice: number;
  priceModel: ServicePriceModel;
  isActive: boolean;
  contextDescription: string;
  icon?: string;
};
