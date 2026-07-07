import Icon from "@/components/icons/LucideIcons";

type ServiceStatType = {
  icon: string;
  summary: string;
  description: string;
  image: string;
};

export const ServiceStats: Record<string, ServiceStatType> = {
  "stain-treatment": {
    summary: "Removes tough stains and restores freshness.",
    description:
      "Advanced techniques target stubborn stains — oil, wine, ink, grass — without harming fabric fibers or color.",
    image: "/images/stain.jpg",
    icon: "Droplets",
  },
  "commercial-laundry": {
    summary: "Professional laundry services for businesses.",
    description:
      "Efficient, high-quality laundering tailored to hotels, restaurants, and businesses of any size.",
    image: "/images/commercial_laundry.jpg",
    icon: "Building2",
  },
  "dry-cleaning": {
    summary: "Special care for delicate and premium fabrics.",
    description:
      "Expert cleaning for suits, silk, wool, and other delicate garments that need a gentler touch.",
    image: "/images/dry.jpg",
    icon: "Gem",
  },
  "family-laundry": {
    summary: "Laundry solutions for the whole household.",
    description:
      "Reliable care for your family's clothes, linens, and everyday essentials, all in one order.",
    image: "/images/family.jpg",
    icon: "Users",
  },
  "personal-laundry": {
    summary: "Convenient laundry care for your everyday needs.",
    description:
      "Washing, drying, and folding services handled with care and attention to every item.",
    image: "/images/personal.jpg",
    icon: "WashingMachine",
  },
  "pressing-ironing": {
    summary: "Perfectly pressed garments, ready to wear.",
    description:
      "Professional steam pressing that leaves your clothes crisp, sharp, and wrinkle-free.",
    image: "/images/ironing.jpg",
    icon: "Shirt",
  },
};

const defaultStat = {
  summary: "Perfectly pressed garments, ready to wear.",
  description:
    "Professional steam pressing that leaves your clothes crisp, sharp, and wrinkle-free.",
  image: "/images/ironing.jpg",
  icon: "Shirt",
};
export const getServiceStats = (slug: string) => {
  return ServiceStats[slug] ?? defaultStat;
};
