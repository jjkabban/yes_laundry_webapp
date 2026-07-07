"use client";
import { useOrderContext } from "@/context/OrderContext";
import {
  Bell,
  ChevronRight,
  CreditCard,
  Gift,
  HelpCircle,
  LogOut,
  MapPin,
  Package,
  Pencil,
  ShoppingBag,
  Sparkles,
  WashingMachine,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const menuSections = [
  {
    id: "items88303",
    items: [
      { icon: Package, label: "My Orders", href: "/orders" },
      { icon: MapPin, label: "Addresses", href: "/addresses" },
      {
        icon: WashingMachine,
        label: "Laundry Preferences",
        href: "/preferences",
      },
    ],
  },
  {
    id: "itemsee93jdjbbajs",
    items: [
      { icon: CreditCard, label: "Payment Methods", href: "/payment" },
      { icon: Gift, label: "Rewards & Coupons", href: "/rewards" },
    ],
  },
  {
    id: "900eskksuess",
    items: [
      { icon: Bell, label: "Notifications", href: "/notifications" },
      { icon: HelpCircle, label: "Help & Support", href: "/support" },
    ],
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { orderData: orders } = useOrderContext();

  const user = {
    firstName: "Justice",
    lastName: "Abban",
    phone: "0241234567",
    profileImage: null as string | null,
    loyaltyPoints: 240,
  };

  const activeOrders =
    orders?.filter((o) => !["DELIVERED", "CANCELLED"].includes(o.status))
      .length ?? 0;
  const totalOrders = orders?.length ?? 0;

  const initials = `${user.firstName[0]}${user.lastName[0]}`;

  return (
    <div className=" h-screen pb-6 fixed overflow-y-scroll overflow-x-hidden w-full max-w-2/5">
      <div className="px-4 pt-4 pb-3 fixed min-w-[375]  z-20 bg-foreground">
        <h1 className="text-xl text-black font-bold">Hi, {user.firstName}</h1>
      </div>

      <div className="pt-20 pb-3 px-4">
        <div className="bg-white rounded-3xl border-[1] border-paragraph/60 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {user.profileImage ? (
              <div className="relative h-14 w-14 rounded-full overflow-hidden shrink-0">
                <Image
                  src={user.profileImage}
                  fill
                  alt="profile"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-14 w-14 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                <span className="text-brand font-semibold text-lg">
                  {initials}
                </span>
              </div>
            )}
            <div className="leading-tight">
              <h2 className="font-semibold text-[17px]">
                {user.firstName} {user.lastName}
              </h2>
              <span className="text-[13px] text-paragraph/60">
                {user.phone}
              </span>
            </div>
          </div>

          <button
            onClick={() => router.push("/profile/edit")}
            className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg border-[1] border-black/10"
          >
            <Pencil size={13} className="text-paragraph/70" />
            <span className="text-[13px] text-paragraph font-medium">Edit</span>
          </button>
        </div>
      </div>

      <div className=" flex flex-col gap-6 px-4 pt-4">
        {/* Quick overview */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl border-[1] border-paragraph/20 px-3 py-3 flex flex-col items-center gap-1">
            <span className="text-[22px] font-bold text-brand">
              {activeOrders}
            </span>
            <span className="text-[11px] text-paragraph/60 text-center leading-tight">
              Active orders
            </span>
          </div>
          <div className="bg-white rounded-xl border-[1] border-paragraph/20 px-3 py-3 flex flex-col items-center gap-1">
            <span className="text-[22px] font-bold text-paragraph">
              {totalOrders}
            </span>
            <span className="text-[11px] text-paragraph/60 text-center leading-tight">
              Total orders
            </span>
          </div>
          <div className="bg-white rounded-xl border-[1] border-paragraph/20 px-3 py-3 flex flex-col items-center gap-1">
            <div className="flex items-center gap-0.5">
              <span className="text-[22px] font-bold text-yellow-600">
                {user.loyaltyPoints}
              </span>
              <Sparkles size={14} className="text-yellow-500 mb-1" />
            </div>
            <span className="text-[11px] text-paragraph/60 text-center leading-tight">
              Loyalty points
            </span>
          </div>
        </div>

        {/* menu items */}

        <div className="flex flex-col gap-4 mx-2s">
          {menuSections.map((sec, index) => (
            <div
              key={sec.id + index}
              className="flex flex-col  bg-white shadow-2xs p-4 rounded-2xl border-[1] border-paragraph/30"
            >
              {sec.items.map((itm, idx) => {
                const Icon = itm.icon;
                return (
                  <div
                    key={itm.label}
                    className={`py-4 ${idx !== sec.items.length - 1 && "border-b-[1] border-paragraph/20"}`}
                  >
                    <Link href={itm.href} className="flex items-center gap-2">
                      <Icon size={16} color="#444" />
                      <span>{itm.label}</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
