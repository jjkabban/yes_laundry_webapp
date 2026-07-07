import { AddOn } from "./addOn.type";
import { Item } from "./item.type";

export type ServicePriceModel = "PER_ITEM" | "PER_BAG" | "BY_WEIGHT";
export type ServiceMediaType = "COVER_IMAGE" | "WORK";
export type SlotName = "MORNING" | "AFTERNOON" | "EVENING";

export type ServiceMedia = {
  id: string;
  type: ServiceMediaType;
  url: string;
};

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

export type ImageType = {
  url: string;
  type: string;
  mimeType: string;
  size: string;
};

export type Service = {
  slug: string;
  id: string;
  title: string;
  description: string;
  coverImage: ImageType;
  turnaroundTime: string;
  basePrice: number;
  priceModel: ServicePriceModel;
  contextDescription: string;
  icon: string;
  // media?: ServiceMedia[];
  // items?: ServiceItem[];
  // addOns?: AddOn[];
  // availability?: ServiceAvailability;
  // timeSlots?: ServiceTimeSlot[];
};

export type ServiceDetail = Service & {
  media?: ServiceMedia[];
  howItWorks: ServiceHowItWorks[];
  policies: ServicePolicy[];
  handleAndCare: ServiceHandleAndCare[];
  includes: ServiceIncludes[];
};

export type ServiceWizardDetail = Service & {
  items?: ServiceItem[];
  addOns?: AddOn[];
  availability?: ServiceAvailability;
  timeSlots?: ServiceTimeSlot[];
  priceModel: ServicePriceModel;
  coverImage: ImageType;
  turnaroundTime: string;
  basePrice: number;
};
