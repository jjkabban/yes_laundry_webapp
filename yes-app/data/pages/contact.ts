import { Phone, Mail } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
export const contactInfo = [
  {
    icon: Phone,
    label: "Call us",
    value: "+233(0) 558 696 943",
    href: "tel:+233558696943",
  },
  {
    icon: FaWhatsapp,
    label: "WhatsApp",
    value: "+233 55 869 6943",
    href: "https://api.whatsapp.com/send?phone=233558696943&text=Hello%20Yeslaundry%2C%20I%20just%20visited%20your%20website%20and%20wanted%20to%20you%20a%20message.",
  },
  {
    icon: Mail,
    label: "Email us",
    value: "yeslaundrygh@gmail.com",
    href: "mailto:yeslaundrygh@gmail.com",
  },
];

export const locations = [
  {
    city: "Accra",
    area: "No. 19, Fifth Link Rd, Cantonements",
    gps: "GL-040-2658",
  },
];

export const hours = [
  { day: "Monday – Saturday", time: "7:00 AM – 8:00 PM" },
  { day: "Sunday", time: "9:00 AM – 4:00 PM" },
];

export const subjects = [
  "General inquiry",
  "Order issue",
  "Partnership",
  "Feedback",
];
