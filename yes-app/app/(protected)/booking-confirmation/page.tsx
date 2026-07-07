"use client";
import { useOrderDraft } from "@/context/OrderDraftContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  CheckCircle,
  XCircle,
  MapPin,
  Clock,
  Package,
  ChevronRight,
  Home,
} from "lucide-react";
import { motion } from "framer-motion";

export default function BookingConfirmationPage() {
  const { data, clearOrder } = useOrderDraft();
  const router = useRouter();
  const params = useSearchParams();
  const type = params.get("type");
  const orderId = params.get("oid");
  const isSuccess = type === "success";

  // if no order in context at all, redirect home
  const isNavigatingAway = useRef(false);

  function handleDone() {
    isNavigatingAway.current = true;
    clearOrder();
    router.replace("/user-home");
  }

  function handleViewOrder() {
    isNavigatingAway.current = true;
    clearOrder();
    router.replace("/user-orders");
  }

  useEffect(() => {
    if (!data && !isNavigatingAway.current) {
      router.replace("/");
    }
  }, [data]);

  if (!data) return null;

  const {
    pickupAddress,
    deliveryAddress,
    pickupDate,
    pickupTime,
    note,
    addOns,
    quantities,
    totalPrice,
    paymentMethod,
  } = data;

  const selectedItems = Object.entries(quantities ?? {}).filter(
    ([_, qty]) => qty > 0,
  );

  const formattedDate = pickupDate
    ? new Date(pickupDate).toLocaleDateString("en-GB", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <div className="min-h-screen bg-foreground pb-45">
      {/* hero status section */}
      <div
        className={`w-full px-6 pt-16 pb-10 flex flex-col items-center text-center
          ${isSuccess ? "bg-brand" : "bg-red-500"}`}
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: 0.1,
          }}
        >
          {isSuccess ? (
            <CheckCircle size={64} color="#fff" strokeWidth={1.5} />
          ) : (
            <XCircle size={64} color="#fff" strokeWidth={1.5} />
          )}
        </motion.div>

        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-4"
        >
          <h1 className="text-white text-[22px] font-semibold">
            {isSuccess ? "Order placed!" : "Something went wrong"}
          </h1>
          <p className="text-white/70 text-[14px] mt-1 leading-snug">
            {isSuccess
              ? `Order #${orderId?.slice(-8).toUpperCase()} is confirmed and scheduled for pickup.`
              : "We couldn't place your order. Please try again."}
          </p>
        </motion.div>
      </div>

      {isSuccess && (
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="px-5 mt-4 flex flex-col gap-4"
        >
          {/* pickup & delivery */}
          <div className="bg-white rounded-2xl px-4 py-4">
            <h2 className="font-semibold text-[15px] mb-3">
              Pickup & delivery
            </h2>

            <div className="flex gap-3 items-start py-2 border-b border-paragraph/8">
              <div className="mt-0.5 bg-brand/10 p-1.5 rounded-full shrink-0">
                <MapPin size={18} color="#004a94" />
              </div>
              <div className="leading-tight">
                <p className="text-[13px] text-paragraph/70 mb-0.5">
                  Pickup address
                </p>
                <p className="text-[14px] font-medium">{pickupAddress}</p>
              </div>
            </div>

            <div className="flex gap-3 items-start py-2 border-b border-paragraph/8">
              <div className="mt-0.5 bg-brand/10 p-1.5 rounded-full shrink-0">
                <MapPin size={18} color="#004a94" />
              </div>
              <div className="leading-tight">
                <p className="text-[13px] text-paragraph/70 mb-0.5">
                  Delivery address
                </p>
                <p className="text-[14px] font-medium">{deliveryAddress}</p>
              </div>
            </div>

            <div className="flex gap-3 items-start pt-2">
              <div className="mt-0.5 bg-brand/10 p-1.5 rounded-full shrink-0">
                <Clock size={18} color="#004a94" />
              </div>
              <div className="leading-tight">
                <p className="text-[13px] text-paragraph/50 mb-0.5">
                  Pickup window
                </p>
                <p className="text-[14px] font-medium">
                  {formattedDate} • {pickupTime}
                </p>
              </div>
            </div>
          </div>

          {/* items ordered */}
          {selectedItems.length > 0 && (
            <div className="bg-white rounded-2xl px-4 py-4">
              <h2 className="font-semibold text-[15px] mb-3">Items</h2>
              {selectedItems.map(([itemId, qty], idx) => (
                <div
                  key={itemId}
                  className="flex justify-between items-center py-2 border-b border-paragraph/8 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <div className="relative h-8 w-8 rounded-md overflow-hidden bg-gray-100 shrink-0">
                      <Image
                        src={`/images/s2.jpg`}
                        fill
                        alt={itemId}
                        className="object-cover"
                      />
                    </div>
                    <p className="text-[13px] font-medium capitalize">
                      {itemId}
                    </p>
                  </div>
                  <span className="text-[14px] text-paragraph/60">{qty}</span>
                </div>
              ))}
            </div>
          )}

          {/* add-ons */}
          {addOns && addOns.length > 0 && (
            <div className="bg-white rounded-2xl px-4 py-4">
              <h2 className="font-semibold text-[15px] mb-3">Add-ons</h2>
              {addOns.map((adn) => (
                <div
                  key={adn.id}
                  className="flex justify-between items-center py-2 border-b border-paragraph/8 last:border-0"
                >
                  <p className="text-[13px] font-medium">{adn.name}</p>
                  <span className="text-[13px] text-paragraph/60">
                    GHS {adn.price}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* note */}
          {note && (
            <div className="bg-white rounded-2xl px-4 py-4">
              <h2 className="font-semibold text-[15px] mb-2">
                Special instructions
              </h2>
              <p className="text-[13px] text-paragraph/70 leading-relaxed">
                {note}
              </p>
            </div>
          )}

          {/* total */}
          <div className="bg-white rounded-2xl px-4 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-[15px]">
                  {data?.paymentMethod === "pickup"
                    ? "Amount due at pickup"
                    : "Total paid"}
                </h2>
                <p className="text-[12px] text-paragraph/50 mt-0.5">
                  {selectedItems.length} item
                  {selectedItems.length !== 1 ? "s" : ""}
                  {addOns &&
                    addOns.length > 0 &&
                    ` • ${addOns.length} add-on${addOns.length !== 1 ? "s" : ""}`}
                  {data?.paymentMethod === "pickup" && " • Pay at pickup"}
                </p>
              </div>
              <span className="text-[18px] font-semibold text-brand">
                GHS {totalPrice}
              </span>
            </div>
          </div>

          {/* what's next */}
          <div className="bg-brand/5 border border-brand/15 rounded-2xl px-4 py-4">
            <h2 className="font-semibold text-[14px] text-brand mb-3">
              What happens next
            </h2>
            <div className="flex flex-col gap-3">
              {[
                "Your order is confirmed — no further action needed",
                "A driver will be assigned before your pickup window",
                "You'll get a notification when the driver is on the way",
                "Your clothes are returned within the agreed timeframe",
              ].map((step, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-white text-[10px] font-semibold">
                      {i + 1}
                    </span>
                  </div>
                  <p className="text-[13px] text-paragraph/70 leading-snug">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* CTAs */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-paragraph/10 px-5 py-4 flex flex-col gap-2">
        {isSuccess ? (
          <>
            <button
              onClick={handleViewOrder}
              className="w-full bg-brand text-white py-3.5 rounded-full text-[15px] font-medium flex items-center justify-center gap-2 active:opacity-80"
            >
              <Package size={18} />
              Track my order
            </button>
            <button
              onClick={handleDone}
              className="w-full border border-paragraph/20 text-paragraph py-3.5 rounded-full text-[15px] font-medium flex items-center justify-center gap-2 active:opacity-80"
            >
              <Home size={18} />
              Back to home
            </button>
          </>
        ) : (
          <button
            onClick={() => router.back()}
            className="w-full bg-brand text-white py-3.5 rounded-full text-[15px] font-medium active:opacity-80"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
