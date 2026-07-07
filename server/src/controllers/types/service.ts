import { AddOn } from "./addOn";
import { Item } from "./item";

export type ServicePriceModel = "PER_ITEM" | "PER_BAG" | "BY_WEIGHT";
export type ServiceMediaType = "COVER_IMAGE" | "WORK";
export type SlotName = "MORNING" | "AFTERNOON" | "EVENING";

export type ServiceItem = {
  categoryName: string;
  items: Item[];
};

export type ServiceAvailability = {
  id: string;
  windowDays: number; // how many days ahead can be booked
  blockedDays: number[]; // 0 = Sunday, 6 = Saturday
  blockedDates: string[]; // ISO date strings e.g. "2026-12-25"
};

export type ServiceTimeSlot = {
  id: string;
  startTime: string;
  endTime: string;
  name: SlotName;
  isOverriden: boolean;
  date?: string;
};

export type ImageType = {
  url: string;
  type: string;
  mimeType: string;
  size: string;
};

export type Service = {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: ImageType | null;
  turnaroundTime: string;
  basePrice: number;
  priceModel: ServicePriceModel;
  contextDescription: string;
  icon: string | null;
};

export type ServiceIncludes = {
  id: string;
  name: string;
};

export type PolicyTitle =
  | "CANCELLATION"
  | "DAMAGED_AND_LOST_ITEMS"
  | "SPECIAL_CARE_ITEMS"
  | "REWASH_GUARANTEE";

export type ServicePolicy = {
  id: string;
  type: PolicyTitle;
  title: string;
  icon: string | null;
  description: string;
};
export type ServiceHowItWorks = {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
};
export type ServiceHandleAndCare = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export type ServiceDetail = Service & {
  media?: ImageType[];
  howItWorks: ServiceHowItWorks[];
  policies: ServicePolicy[];
  handleAndCare: ServiceHandleAndCare[];
  includes: ServiceIncludes[];
};

export type ServiceResponsePayload = Service[];
export type ServiceDetailResponsePayload = ServiceDetail;
