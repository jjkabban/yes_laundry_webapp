import {
  LucideIcon,
  CalendarCheck,
  Truck,
  Sparkles,
  PackageCheck,
} from "lucide-react";

interface Step {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
  image: string;
}

export const steps: Step[] = [
  {
    number: "01",
    title: "Schedule",
    description:
      "Book a laundry pickup through our app or website in just seconds with the 'Book Now' button.",
    icon: CalendarCheck,
    image: "/images/schedule_laundry.jpg",
  },
  {
    number: "02",
    title: "Pickup",
    description: "Our team collects your laundry right from your doorstep.",
    icon: Truck,
    image: "/images/pickup_laundry.jpg",
  },
  {
    number: "03",
    title: "Professional clean",
    description: "We expertly clean your clothes — delicate fabrics included.",
    icon: Sparkles,
    image: "/images/laundry_cleaning.jpg",
  },
  {
    number: "04",
    title: "Delivery & Payment",
    description: "Fresh laundry delivered back to you, folded and spotless.",
    icon: PackageCheck,
    image: "/images/laundry_delivery.jpg",
  },
];
