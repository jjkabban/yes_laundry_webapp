"use client";
import Icon from "@/components/icons/LucideIcons";
import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePanel } from "@/context/DashboardContext";
import OrderStepper from "@/components/ui/OrdersStepper";
import {
  LiveOrderPreview,
  PromotionList,
  RecentDraftOrders,
} from "@/components/components";
import { useOrderContext } from "@/context/OrderContext";
import { Order, OrderDraft } from "@/types/shared/order.type";
import ServiceList from "@/components/components/ServiceList";
import { Service } from "@/types/shared/service.types";
import { Promotion } from "@/context/types/promotions";
import { ReferralCard } from "@/components/ui";
import { useRouter } from "next/navigation";
import useWindow from "@/hooks/useWindow";
import { BottomSheet, AddressInput } from "@/components/components";
import { X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useServices } from "@/hooks/useServices";
import { ManualLocationPayload } from "@/lib/api/type/auth.type";
import { useToast } from "@/context/ToastContext";
import { SERVICES } from "../../../../data/objects/services";
import { ORDERS, ORDER_DRAFTS } from "../../../../data/objects/order";
import {
  useCreateDraftOrder,
  useDraftOrders,
  useUpdateOrderDraft,
} from "@/hooks/useDraftOrders";
import useOrders from "@/hooks/useOrders";

export const PROMOTIONS: Promotion[] = [
  {
    id: "promo_first_order",
    campaignName: "First Order Discount",
    description: "Enjoy 15% off your first laundry order.",
    discountType: "PERCENTAGE",
    discountValue: 15,
    minOrderValue: 0,
    startsAt: new Date("2026-01-01"),
    expiresAt: new Date("2026-12-31"),
    isActive: true,
  },
  {
    id: "promo_free_pickup",
    campaignName: "Free Pickup & Delivery",
    description: "Get free pickup and delivery on all orders this week.",
    discountType: "FIXED_AMOUNT",
    discountValue: 20,
    minOrderValue: 80,
    startsAt: new Date("2026-06-20"),
    expiresAt: new Date("2026-06-30"),
    isActive: true,
  },
  {
    id: "promo_weekend_special",
    campaignName: "Weekend Laundry Deal",
    description: "Save 10% on all laundry orders during weekends.",
    discountType: "PERCENTAGE",
    discountValue: 10,
    minOrderValue: 50,
    startsAt: new Date("2026-06-01"),
    expiresAt: new Date("2026-08-31"),
    isActive: true,
  },
  {
    id: "promo_dry_cleaning",
    campaignName: "Dry Cleaning Special",
    description: "Enjoy 20% off all dry cleaning services.",
    discountType: "PERCENTAGE",
    discountValue: 20,
    minOrderValue: 100,
    startsAt: new Date("2026-06-10"),
    expiresAt: new Date("2026-07-10"),
    isActive: true,
  },
  {
    id: "promo_loyalty_reward",
    campaignName: "Loyalty Reward",
    description: "Get GH₵10 off your next order as a returning customer.",
    discountType: "FIXED_AMOUNT",
    discountValue: 10,
    minOrderValue: 60,
    startsAt: new Date("2026-01-01"),
    isActive: true,
  },
  {
    id: "promo_express_service",
    campaignName: "Express Care",
    description: "Fast-track your laundry with priority handling.",
    discountType: "PERCENTAGE",
    discountValue: 5,
    minOrderValue: 120,
    startsAt: new Date("2026-06-01"),
    expiresAt: new Date("2026-09-01"),
    isActive: true,
  },
];

export default function CustomerHomePage() {
  const [draftAddress, setDraftAddress] = useState<ManualLocationPayload>({
    label: "",
    isDefault: true,
    address: "",
  });

  const [promotions, setPromotions] = useState<Promotion[]>(PROMOTIONS);
  const [loyaltyPoints, setLoyaltyPoints] = useState();
  const [referralPoints, setReferralPoints] = useState();

  const [openSheet, setOpenSheet] = useState(false);
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);

  const { isMobile } = useWindow();
  const { user, refetchUser, isUserLoading } = useAuth();
  const { submitDefaultLocation, error, requestLocation, result, status } =
    useGeolocation();

  const { mutate: updateDraftOrder } = useUpdateOrderDraft();
  const { mutate: createDraftOrder } = useCreateDraftOrder();
  const { orderData, isOrdersLoading } = useOrderContext();
  const {
    data: draftOrderData,
    isLoading: isDraftOrderLoading,
    isError: draftOrderError,
  } = useDraftOrders();
  const router = useRouter();
  const { data: servicesData, isError, isLoading } = useServices();
  const { showToast } = useToast();
  const { panel, onPanelSelect, openPanel } = usePanel();

  const services =
    servicesData?.data ??
    (process.env.NODE_ENV === "development" ? SERVICES : []);

  const orders =
    orderData ?? (process.env.NODE_ENV === "development" ? ORDERS : []);

  const draftOrders =
    draftOrderData?.data ??
    (process.env.NODE_ENV === "development" ? ORDER_DRAFTS : []);

  const closeSheet = useCallback(() => {
    setOpenSheet(false);
  }, []);

  useEffect(() => {
    console.log("the orders fetched are ", orderData);
  }, [orderData]);

  const pickupAddress = useMemo(() => {
    const addresses = user?.address;
    if (!addresses || addresses.length === 0) return null;

    const defaultAddress = addresses.find((a) => a.isDefault);
    return defaultAddress?.address ?? addresses[0].address;
  }, [user]);

  useEffect(() => {
    if (
      !isUserLoading &&
      user &&
      (!user.address || user.address.length === 0)
    ) {
      requestLocation();
    }
  }, [isUserLoading, user]);

  useEffect(() => {
    if (status === "success" && result?.address) {
      setDraftAddress((prev) => ({
        ...prev,
        address: result.address ?? prev.address,
      }));
    }
  }, [status, result]);

  const handleAddAddress = async () => {
    if (!draftAddress.address.trim()) return;

    setIsSubmittingAddress(true);
    try {
      const res = await submitDefaultLocation({
        ...draftAddress,
        address: draftAddress.address.trim(),
      });

      refetchUser();
      showToast("Address added successfully", "success", 2000);
      closeSheet();

      setDraftAddress({ label: "", isDefault: true, address: "" });
    } catch (err) {
      showToast("Failed to save pickup address", "error", 300);
    } finally {
      setIsSubmittingAddress(false);
    }
  };

  return (
    <div className="pb-30">
      <div className="bg-brand/90 px-3">
        <div className=" pt-5 pb-16 md:max-w-3xl  mx-auto md:mx-auto ">
          <div className=" text-white flex flex-row justify-between ">
            <div
              onClick={() => {
                setOpenSheet(true);
              }}
              className="flex flex-row py-1 items-center gap-2 bg-brand/50 px-2 rounded-full"
            >
              <Icon name={"MapPin"} />

              <div className="flex flex-col gap-0">
                <span className="text-xs text-white/80">Pickup from</span>
                <span className="font-semibold text-sm">
                  {pickupAddress ?? "Not set"}
                </span>
              </div>

              <Icon name="ChevronDown" size={18} />
            </div>
            <div className="flex flex-row items-center gap-4 pr-2">
              <motion.button
                whileHover={{ backgroundColor: "#0561bd", scale: 1.04 }}
                className={`cursor-pointer p-2 rounded-full  ${panel === "messages" ? "bg-[#0876e4]" : "bg-transparent"} `}
                onClick={() => {
                  if (!isMobile) {
                    onPanelSelect("messages");
                  } else {
                    router.push("/messages");
                  }
                }}
              >
                <Icon name="MessageCircle" />
              </motion.button>
              <motion.button
                whileHover={{ backgroundColor: "#0561bd", scale: 1.04 }}
                onClick={() => {
                  if (!isMobile) {
                    onPanelSelect("notifications");
                  } else {
                    router.push("/notifications");
                  }
                }}
                className={`cursor-pointer p-2 rounded-full ${panel === "notifications" && "bg-[#0876e4]"}`}
              >
                <Icon name="Bell" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        whileTap={{ scale: 1.04 }}
        className="mt-[-26]"
        onClick={() => {
          router.push("/select-service");
        }}
      >
        <div
          className={`flex flex-row bg-background md:max-w-3xl md:mx-auto xl:max-w-6xl   mx-3 xl:mx-auto justify-between px-4 py-3 border border-paragraph/40 shadow-sm rounded-2xl ${openPanel ? "mx-6" : "md:mx-auto"}`}
        >
          <div className="flex flex-row gap-3 items-center">
            <div className="bg-brand/10 flex items-center px-3 py-3 rounded-3xl">
              <Icon name="ShoppingBag" className="" color="#004a94" />
            </div>

            <div className="flex flex-col">
              <span className="font-semibold text-[16px]">
                Ready for a fresh load?
              </span>
              <span className="text-paragraph/80 text-[13px]">
                Schedule a pickup today
              </span>
            </div>
          </div>

          <button className="px-1 rounded-full py-2">
            <Icon name="ChevronRight" size={20} color="#666" />
          </button>
        </div>
      </motion.div>

      {/* content */}
      <div className="max-w-4xl mx-auto md:mx-5 py-5">
        {(orders?.length ?? 0) > 0 && (
          <div>
            <LiveOrderPreview orders={orders as Order[]} />
          </div>
        )}

        {draftOrders.length > 0 && (
          <div>
            <RecentDraftOrders draftOrder={draftOrders} />
          </div>
        )}

        <div>
          <ServiceList services={services} />
        </div>

        {promotions && (
          <div>
            <PromotionList promotions={promotions} />
          </div>
        )}

        <div>
          <ReferralCard />
        </div>
      </div>

      <BottomSheet open={openSheet} onClose={closeSheet} height="90%">
        <div className="flex flex-col p-5 h-full w-full relative">
          <div className="flex items-end justify-end pb-4" onClick={closeSheet}>
            <X size={20} />
          </div>

          <div>
            <h2 className="text-[20px] font-medium">Add pickup address</h2>
            <p className="text-[14px] text-paragraph/80 py-2 mb-5">
              This address will be your default pickup address. You can update
              it anytime.
            </p>
          </div>

          <div className="mb-3">
            <input
              type="text"
              value={draftAddress.label}
              onChange={(e) =>
                setDraftAddress((prev) => ({ ...prev, label: e.target.value }))
              }
              placeholder="Label (e.g. Home, Work)"
              className="rounded-lg border border-paragraph/10 bg-[#FBFAF7] px-4 py-2.5 text-[13.5px] w-full outline-none focus:border-brand"
            />
          </div>

          <AddressInput
            onChangeValue={(value) => {
              setDraftAddress((prev) => ({ ...prev, address: value }));
            }}
          />

          {status === "denied" && (
            <p className="text-[12.5px] text-[#8a92a0] mt-2">
              Location access was denied — you can still enter your address
              manually above.
            </p>
          )}
          {error && status === "error" && (
            <p className="text-[12.5px] text-red-600 mt-2">{error}</p>
          )}

          <button
            onClick={handleAddAddress}
            disabled={isSubmittingAddress || !draftAddress.address.trim()}
            className="bg-brand font-medium flex items-center text-center bottom-10 text-white w-[90%] absolute rounded-full py-3 px-3 justify-center self-center disabled:opacity-60"
          >
            {isSubmittingAddress ? "Saving..." : "Add address"}
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}
