"use client";
import { useAuth } from "@/context/AuthContext";
import { useOrderContext } from "@/context/OrderContext";
import {
  Bell,
  ChevronRight,
  CreditCard,
  Gift,
  HelpCircle,
  LogOut,
  MapPin,
  MessageSquare,
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
      { icon: Package, label: "My Orders", href: "/user-orders" },
      { icon: MapPin, label: "Addresses", href: "/user-profile/addresses" },
      {
        icon: WashingMachine,
        label: "Recurring orders",
        href: "/user-orders/recurring",
      },
    ],
  },
  {
    id: "itemsee93jdjbbajs",
    items: [
      {
        icon: CreditCard,
        label: "Payment Methods",
        href: "/user-profile/payment",
      },
      {
        icon: MessageSquare,
        label: "Messages",
        href: "/messages/conversations-home",
      },
    ],
  },
  {
    id: "900eskksuess",
    items: [
      { icon: Bell, label: "Notifications", href: "/notifications" },
      { icon: HelpCircle, label: "Help & Support", href: "/messages/" },
    ],
  },
];

export default function ProfileHomePage() {
  const router = useRouter();
  const { orderData: orders } = useOrderContext();
  const { logout } = useAuth();

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
    <div className="relative pb-35">
      <div className="px-4 pt-4 pb-3 fixed top-0 left-0 right-0 z-20 bg-brand">
        <h1 className="text-3xl text-white font-bold">Hi, {user.firstName}</h1>
      </div>

      <div className="pt-20 pb-3 bg-brand px-4">
        <div className="bg-white rounded-3xl border-[1] border-paragraph/20 px-4 py-3 flex items-center justify-between">
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
            onClick={() => router.push("/user-profile/edit")}
            className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg border-[1] border-black/10"
          >
            <Pencil size={13} className="text-paragraph/70" />
            <span className="text-[13px] text-paragraph font-medium">Edit</span>
          </button>
        </div>
      </div>

      <div className=" flex flex-col gap-6 px-4 pt-4">
        {/* Quick overview */}
        <div className="grid grid-cols-2 gap-3">
          <div
            onClick={() => {
              router.push("user-orders?tab=ongoing");
            }}
            className="bg-white rounded-xl border-[1] border-paragraph/20 px-3 py-3 flex flex-col items-center gap-1"
          >
            <span className="text-[22px] font-bold text-brand">
              {activeOrders}
            </span>
            <span className="text-[11px] text-paragraph/60 text-center leading-tight">
              Active orders
            </span>
          </div>
          <div
            onClick={() => {
              router.push("user-orders?tab=all");
            }}
            className="bg-white rounded-xl border-[1] border-paragraph/20 px-3 py-3 flex flex-col items-center gap-1"
          >
            <span className="text-[22px] font-bold text-paragraph">
              {totalOrders}
            </span>
            <span className="text-[11px] text-paragraph/60 text-center leading-tight">
              Total orders
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

        <div className="bg-white rounded-xl border-[1] border-paragraph/30 overflow-hidden">
          <button
            onClick={() => {
              logout();
              router.replace("/");
            }}
            className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-red-50 transition-colors"
          >
            <LogOut size={18} className="text-red-500" />
            <span className="text-[15px] font-medium text-red-500">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
