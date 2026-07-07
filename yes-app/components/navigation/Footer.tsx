import Link from "next/link";
import { Logo } from "../ui";
import {
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaFacebookF,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const services = [
  {
    label: "Stain treatment",
    description: "Everyday laundry, sorted.",
    slug: "stain-treatment",
  },
  {
    label: "Pressing & Ironing",
    description: "For suits, dresses & delicates.",
    slug: "pressing-ironing",
  },
  {
    label: "Dry cleaning",
    description: "Crisp, press-ready garments.",
    slug: "dry-cleaning",
  },
  {
    label: "Personal laundry",
    description: "Duvets, sheets & towels.",
    slug: "personal-laundry",
  },
  {
    label: "Family laundry",
    description: "Duvets, sheets & towels.",
    slug: "family-laundry",
  },
  {
    label: "Commercial laundry",
    description: "Duvets, sheets & towels.",
    slug: "commercial-laundry",
  },
];

const quickLinks = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  {
    label: "Testimonials",
    href: "/testimonials",
  },
  { label: "Contact", href: "/contact" },
];

const socials = [
  {
    icon: FaInstagram,
    href: "https://www.instagram.com/yes.laundry",
    label: "Instagram",
  },
  {
    icon: FaWhatsapp,
    href: "https://api.whatsapp.com/send?phone=233558696943&text=Hello%20Yeslaundry%2C%20I%20just%20visited%20your%20website%20and%20wanted%20to%20you%20a%20message.",
    label: "Whatsapp",
  },
  { icon: MdEmail, href: "mailto:info@yeslaundrygh.com", label: "Email" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0a1929] text-white px-10 flex flex-col items-center">
      {/* Top divider accent */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#0d6efd] via-[#0d6efd]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Col 1 — Brand */}
          <div className="flex flex-col gap-5">
            <div>
              <Logo height={200} width={200} type="light" />
              <p className="mt-3 text-sm text-white/50 leading-relaxed">
                Our mission is simple - to provide you with a hassle-free and
                impeccable laundry experience that exceeds your expectations..
              </p>
            </div>

            <div className="flex items-center gap-3 mt-1">
              {socials.map(({ icon: Icon, label, href }, index) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="h-9 w-9 flex items-center justify-center rounded-full border border-white/10 text-white/50 hover:border-[#0d6efd] hover:text-[#0d6efd] transition-all duration-200"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#0d6efd]">
              Our Services
            </h4>
            <ul className="flex flex-col gap-3">
              {services.map((s) => (
                <Link
                  href={`services/${s.slug}`}
                  key={s.label}
                  className="flex flex-col gap-0.5"
                >
                  <span className="text-sm font-medium text-white/80">
                    {s.label}
                  </span>
                </Link>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#0d6efd]">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#0d6efd]">
              Get in Touch
            </h4>
            <ul className="flex flex-col gap-8 text-sm text-white/50">
              <li>
                <span className="block text-[12px] pb-1 uppercase tracking-wider  mb-0.5">
                  Phone
                </span>
                <a
                  href="tel:+233558696943"
                  className="hover:text-white text-white transition-colors duration-200"
                >
                  +233(0) 558 696 943
                </a>
              </li>
              <li>
                <span className="block text-[12px] pb-1 uppercase tracking-wider mb-0.5">
                  Email
                </span>
                <div className="flex flex-col gap-2">
                  <a
                    href="mailto:yeslaundrygh@gmail.com"
                    className="hover:text-white text-white transition-colors duration-200"
                  >
                    yeslaundrygh@gmail.com
                  </a>
                  <a
                    href="mailto:info@yeslaundrygh.com"
                    className="hover:text-white text-white transition-colors duration-200"
                  >
                    info@yeslaundrygh.com
                  </a>
                </div>
              </li>
              <li>
                <span className="block text-[12px] uppercase tracking-wider  mb-0.5">
                  Location
                </span>
                <div className="flex flex-col py-2">
                  <span className="text-white">
                    No. 19, Fifth Link Rd, Cantonements
                  </span>
                  <span className="text-white">GPS Address: GL-040-2658</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/6">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-white/25">
            © {new Date().getFullYear()} Yes Laundry Ghana. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-[12px] text-white/25 hover:text-white/60 transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-[12px] text-white/25 hover:text-white/60 transition-colors duration-200"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
