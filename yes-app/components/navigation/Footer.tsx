import Link from "next/link";
import { Logo } from "../ui";

const services = [
  { label: "Stain treatment", description: "Everyday laundry, sorted." },
  {
    label: "Pressing & Ironing",
    description: "For suits, dresses & delicates.",
  },
  { label: "Dry cleaning", description: "Crisp, press-ready garments." },
  { label: "Personal laundry", description: "Duvets, sheets & towels." },
  { label: "Family laundry", description: "Duvets, sheets & towels." },
  { label: "Commercial laundry", description: "Duvets, sheets & towels." },
];

const quickLinks = [
  { label: "About", href: "https://www.yeslaundrygh.com/about.html" },
  { label: "Services", href: "https://www.yeslaundrygh.com/services.html" },
  {
    label: "Testimonials",
    href: "https://www.yeslaundrygh.com/testimonials.html",
  },
  { label: "Contact", href: "https://www.yeslaundrygh.com/contact.html" },
];

const socials = [
  { icon: "", href: "#", label: "Facebook" },
  { icon: "", href: "#", label: "Instagram" },
  { icon: "", href: "#", label: "Twitter" },
  { icon: "", href: "#", label: "YouTube" },
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
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="h-9 w-9 flex items-center justify-center rounded-full border border-white/10 text-white/50 hover:border-[#0d6efd] hover:text-[#0d6efd] transition-all duration-200"
                ></a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#0d6efd]">
              Our Services
            </h4>
            <ul className="flex flex-col gap-3">
              {services.map((s) => (
                <li key={s.label} className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-white/80">
                    {s.label}
                  </span>
                </li>
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
            <ul className="flex flex-col gap-3 text-sm text-white">
              <li>
                <span className="block text-[11px] uppercase tracking-wider text-white mb-0.5">
                  Phone
                </span>
                <a
                  href="tel:+233000000000"
                  className="hover:text-white transition-colors duration-200"
                >
                  +233 00 000 0000
                </a>
              </li>
              <li>
                <span className="block text-[11px] uppercase tracking-wider text-white mb-0.5">
                  Email
                </span>
                <a
                  href="mailto:hello@yeslaundrygh.com"
                  className="hover:text-white transition-colors duration-200"
                >
                  hello@yeslaundrygh.com
                </a>
              </li>
              <li>
                <span className="block text-[11px] uppercase tracking-wider text-white mb-0.5">
                  Location
                </span>
                Accra, Ghana
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
