import {
  CalendarCheck,
  LucideIcon,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Truck,
  WashingMachine,
  Wind,
} from "lucide-react";

export interface ServiceStep {
  icon: LucideIcon;
  label: string;
  title: string;
  description: string;
}

export const ServiceSteps: Record<string, ServiceStep[]> = {
  "stain-treatment": [
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

  "pressing-ironing": [
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

  "dry-cleaning": [
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
  "personal-laundry": [
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
  "family-laundry": [
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
  "commercial-laundry": [
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
      description: "Delivered back on your schedule, ready to use, every time.",
    },
  ],
};

const catchAllStep: ServiceStep[] = [
  {
    icon: CalendarCheck,
    label: "Book",
    title: "Schedule a pickup",
    description:
      "Pick a time slot that works for you and we collect the dirty items from your doorstep.",
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
];

export const getServiceStep = (slug: string): ServiceStep[] => {
  const step = ServiceSteps[slug];
  return step ?? catchAllStep;
};
