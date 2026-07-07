import {
  Droplets,
  Shirt,
  Gem,
  WashingMachine,
  Users,
  Building2,
  CalendarCheck,
  Sparkles,
  Truck,
  Wind,
  ShieldCheck,
  PackageCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Service } from "@/types/shared/service.types";

interface ServiceStep {
  icon: LucideIcon;
  label: string;
  title: string;
  description: string;
}

interface DetailedService {
  slug: string;
  title: string;
  summary: string;
  description: string;
  image: string;
  icon: LucideIcon;
  priceFrom: number;
  turnaround: string;
  steps: ServiceStep[]; // always exactly 3
}

const services: DetailedService[] = [
  {
    slug: "stain-treatment",
    title: "Stain Treatment",
    summary: "Removes tough stains and restores freshness.",
    description:
      "Advanced techniques target stubborn stains — oil, wine, ink, grass — without harming fabric fibers or color.",
    image: "/images/stain.jpg",
    icon: Droplets,
    priceFrom: 15,
    turnaround: "24 hrs",
    steps: [
      {
        icon: CalendarCheck,
        label: "Book",
        title: "Schedule a pickup",
        description:
          "Pick a time slot that works for you and we collect the stained item from your doorstep.",
      },
      {
        icon: Sparkles,
        label: "Treat",
        title: "Targeted stain treatment",
        description:
          "Our technicians identify the stain type and apply the right pre-treatment before a careful wash.",
      },
      {
        icon: Truck,
        label: "Deliver",
        title: "Fresh delivery",
        description:
          "Your garment is inspected, packed, and delivered back to you looking spotless.",
      },
    ],
  },
  {
    slug: "pressing-ironing",
    title: "Pressing & Ironing",
    summary: "Perfectly pressed garments, ready to wear.",
    description:
      "Professional steam pressing that leaves your clothes crisp, sharp, and wrinkle-free.",
    image: "/images/ironing.jpg",
    icon: Shirt,
    priceFrom: 10,
    turnaround: "Same day",
    steps: [
      {
        icon: CalendarCheck,
        label: "Book",
        title: "Choose a slot",
        description:
          "Tell us how many pieces you have and when you'd like them picked up.",
      },
      {
        icon: Wind,
        label: "Press",
        title: "Steam & press",
        description:
          "Each garment is steamed and pressed by hand to hold a crisp, lasting finish.",
      },
      {
        icon: Truck,
        label: "Deliver",
        title: "Ready to wear",
        description:
          "Delivered on hangers or neatly folded, straight out of the box ready.",
      },
    ],
  },
  {
    slug: "dry-cleaning",
    title: "Dry Cleaning",
    summary: "Special care for delicate and premium fabrics.",
    description:
      "Expert cleaning for suits, silk, wool, and other delicate garments that need a gentler touch.",
    image: "/images/dry.jpg",
    icon: Gem,
    priceFrom: 25,
    turnaround: "48 hrs",
    steps: [
      {
        icon: CalendarCheck,
        label: "Book",
        title: "Schedule pickup",
        description: "Select your garments and a convenient pickup window.",
      },
      {
        icon: ShieldCheck,
        label: "Clean",
        title: "Gentle solvent clean",
        description:
          "Fabrics are inspected and cleaned using solvent methods safe for delicate materials.",
      },
      {
        icon: Truck,
        label: "Deliver",
        title: "Pressed & delivered",
        description:
          "Returned pressed, on a hanger, and protected in a garment cover.",
      },
    ],
  },
  {
    slug: "personal-laundry",
    title: "Personal Laundry",
    summary: "Convenient laundry care for your everyday needs.",
    description:
      "Washing, drying, and folding services handled with care and attention to every item.",
    image: "/images/personal.jpg",
    icon: WashingMachine,
    priceFrom: 8,
    turnaround: "24 hrs",
    steps: [
      {
        icon: CalendarCheck,
        label: "Book",
        title: "Schedule pickup",
        description: "Bag your laundry and book a pickup time that suits you.",
      },
      {
        icon: WashingMachine,
        label: "Wash",
        title: "Wash, dry & fold",
        description:
          "Sorted by fabric type, washed at the right temperature, dried and neatly folded.",
      },
      {
        icon: Truck,
        label: "Deliver",
        title: "Delivered fresh",
        description: "Clean, folded laundry delivered right back to your door.",
      },
    ],
  },
  {
    slug: "family-laundry",
    title: "Family Laundry",
    summary: "Laundry solutions for the whole household.",
    description:
      "Reliable care for your family's clothes, linens, and everyday essentials, all in one order.",
    image: "/images/family.jpg",
    icon: Users,
    priceFrom: 30,
    turnaround: "24–48 hrs",
    steps: [
      {
        icon: CalendarCheck,
        label: "Book",
        title: "Book a household order",
        description:
          "Add clothes, bedding, and linens for the whole family in a single booking.",
      },
      {
        icon: PackageCheck,
        label: "Sort",
        title: "Sort & wash by family member",
        description:
          "Items are sorted, labeled per family member, and washed with care.",
      },
      {
        icon: Truck,
        label: "Deliver",
        title: "One delivery, everything sorted",
        description:
          "Delivered back neatly bundled and labeled so nothing gets mixed up.",
      },
    ],
  },
  {
    slug: "commercial-laundry",
    title: "Commercial Laundry",
    summary: "Professional laundry services for businesses.",
    description:
      "Efficient, high-quality laundering tailored to hotels, restaurants, and businesses of any size.",
    image: "/images/commercial_laundry.jpg",
    icon: Building2,
    priceFrom: 150,
    turnaround: "Scheduled",
    steps: [
      {
        icon: CalendarCheck,
        label: "Schedule",
        title: "Set up a recurring plan",
        description:
          "We work out volume, frequency, and pickup times that fit your business.",
      },
      {
        icon: PackageCheck,
        label: "Process",
        title: "Bulk processing",
        description:
          "Items are processed in bulk with commercial-grade equipment and quality checks.",
      },
      {
        icon: Truck,
        label: "Deliver",
        title: "On-time delivery",
        description:
          "Delivered back on your schedule, ready to use, every time.",
      },
    ],
  },
];

function getServiceBySlug(slug: string): DetailedService | undefined {
  return services.find((service) => service.slug === slug);
}

export const SERVICES: Service[] = [
  {
    id: "svc_stain_removal",
    slug: "stain-treatment",
    title: "Stain Removal",
    description:
      "Professional treatment for tough stains — oil, wine, ink, and more. Each item is assessed and treated individually before washing.",
    contextDescription: "Tough stains removed with expert care.",
    coverImage: {
      url: "/images/stain.jpg",
      type: "",
      mimeType: "",
      size: "",
    },
    turnaroundTime: "2 days",
    basePrice: 25,
    priceModel: "PER_ITEM",
    icon: "Droplets",
  },
  {
    id: "svc_dry_cleaning",
    title: "Dry Cleaning",
    slug: "dry-cleaning",
    description:
      "Solvent-based cleaning for delicate fabrics — suits, dresses, silk, and wool that can't be machine washed.",
    contextDescription: "Premium care for delicate garments.",
    coverImage: {
      url: "/images/dry.jpg",
      type: "",
      size: "",
      mimeType: "",
    },
    turnaroundTime: "3 days",
    basePrice: 55,
    priceModel: "PER_ITEM",
    icon: "Gem",
  },
  {
    id: "svc_ironing",
    title: "Ironing & Pressing",
    slug: "pressing-ironing",
    description:
      "Crisp, wrinkle-free results for everyday wear and formal items. Garments are steamed and pressed to a professional finish.",
    contextDescription: "Perfectly pressed and wrinkle-free.",
    coverImage: {
      url: "/images/ironing.jpg",
      mimeType: "",
      type: "",
      size: "",
    },
    turnaroundTime: "Next day",
    basePrice: 15,
    priceModel: "PER_ITEM",
    icon: "Shirt",
  },
  {
    id: "svc_personal_laundry",
    title: "Personal Laundry",
    slug: "personal-laundry",
    description:
      "Wash, dry, and fold service for everyday clothing. Sorted by colour, washed at the right temperature, and neatly folded.",
    contextDescription: "Fresh, clean clothes without the hassle.",
    coverImage: {
      url: "/images/personal.jpg",
      type: "",
      mimeType: "",
      size: "",
    },
    turnaroundTime: "Next day",
    basePrice: 8,
    priceModel: "BY_WEIGHT",
    icon: "Users2",
  },
  {
    id: "svc_commercial_laundry",
    title: "Commercial Laundry",
    slug: "commercial-laundry",
    description:
      "Bulk laundry for businesses — hotels, restaurants, salons, and offices. High-volume washing with consistent quality and fast turnaround.",
    contextDescription: "Reliable laundry solutions for businesses.",
    coverImage: {
      url: "/images/services/commercial-laundry.jpg",
      type: "",
      size: "",
      mimeType: "",
    },
    turnaroundTime: "2 days",
    basePrice: 120,
    priceModel: "PER_BAG",
    icon: "Building2",
  },
];
