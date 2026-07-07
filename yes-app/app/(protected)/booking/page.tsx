"use client";
import {
  ArrowLeft,
  ChevronDown,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import mockService from "../../../data/mock/services.json";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  useServiceId,
  useServices,
  useServiceWizardId,
} from "@/hooks/useServices";
import {
  Service,
  ServiceAvailability,
  ServiceTimeSlot,
} from "@/types/shared/service.types";

import CheckBox from "@/components/ui/CheckBox";
import { BottomSheet } from "@/components/components";
import { DayPicker, Matcher } from "react-day-picker";
import "react-day-picker/style.css";
import { AddressInput } from "@/components/components";
import { useOrderDraft } from "@/context/OrderDraftContext";
import { PaymentMethod } from "@/types/shared/transaction.type";

const laundryItems = [
  {
    id: "shirt",
    name: "Shirt",
    category: "Clothing",
    image: "/images/items/shirt.png",
    extraInfo: "Cotton and formal shirts",
    price: 15,
    unit: "item",
  },
  {
    id: "tshirt",
    name: "T-Shirt",
    category: "Clothing",
    image: "/images/items/tshirt.png",
    extraInfo: "Casual short and long sleeve",
    price: 12,
    unit: "item",
  },
  {
    id: "trousers",
    name: "Trousers",
    category: "Clothing",
    image: "/images/items/trousers.png",
    extraInfo: "Formal and casual trousers",
    price: 18,
    unit: "item",
  },
  {
    id: "jeans",
    name: "Jeans",
    category: "Clothing",
    image: "/images/items/jeans.png",
    extraInfo: "Denim jeans of all sizes",
    price: 20,
    unit: "item",
  },
  {
    id: "dress",
    name: "Dress",
    category: "Clothing",
    image: "/images/items/dress.png",
    extraInfo: "Casual and occasion dresses",
    price: 25,
    unit: "item",
  },
  {
    id: "skirt",
    name: "Skirt",
    category: "Clothing",
    image: "/images/items/skirt.png",
    extraInfo: "Short and long skirts",
    price: 18,
    unit: "item",
  },
  {
    id: "shorts",
    name: "Shorts",
    category: "Clothing",
    image: "/images/items/shorts.png",
    extraInfo: "Cotton and denim shorts",
    price: 12,
    unit: "item",
  },
  {
    id: "hoodie",
    name: "Hoodie",
    category: "Clothing",
    image: "/images/items/hoodie.png",
    extraInfo: "Hoodies and sweatshirts",
    price: 25,
    unit: "item",
  },
  {
    id: "suit",
    name: "Suit",
    category: "Formal Wear",
    image: "/images/items/suit.png",
    extraInfo: "Two-piece and three-piece suits",
    price: 60,
    unit: "item",
  },
  {
    id: "blazer",
    name: "Blazer",
    category: "Formal Wear",
    image: "/images/items/blazer.png",
    extraInfo: "Formal and casual blazers",
    price: 40,
    unit: "item",
  },
  {
    id: "tie",
    name: "Tie",
    category: "Accessories",
    image: "/images/items/tie.png",
    extraInfo: "Neckties and bow ties",
    price: 10,
    unit: "item",
  },
  {
    id: "bedsheet",
    name: "Bedsheet",
    category: "Bedding",
    image: "/images/items/bedsheet.png",
    extraInfo: "Single, double and king-size sheets",
    price: 30,
    unit: "item",
  },
  {
    id: "duvet",
    name: "Duvet",
    category: "Bedding",
    image: "/images/items/duvet.png",
    extraInfo: "Duvets and comforters",
    price: 80,
    unit: "item",
  },
  {
    id: "blanket",
    name: "Blanket",
    category: "Bedding",
    image: "/images/items/blanket.png",
    extraInfo: "Light and heavy blankets",
    price: 70,
    unit: "item",
  },
  {
    id: "pillowcase",
    name: "Pillowcase",
    category: "Bedding",
    image: "/images/items/pillowcase.png",
    extraInfo: "Standard and king-size pillowcases",
    price: 8,
    unit: "item",
  },
  {
    id: "curtain",
    name: "Curtain",
    category: "Home",
    image: "/images/items/curtain.png",
    extraInfo: "Priced per curtain panel",
    price: 35,
    unit: "panel",
  },
  {
    id: "towel",
    name: "Towel",
    category: "Home",
    image: "/images/items/towel.png",
    extraInfo: "Bath, hand and face towels",
    price: 12,
    unit: "item",
  },
];

type ItemGroups = { group: string; items: typeof laundryItems };
type Quantities = Record<string, number>;
type SheetType =
  | "pickup_address"
  | "delivery_address"
  | "pickup_window"
  | "note"
  | "total_price"
  | null;

type PickUpFormType = {
  pickupAddress: string;
  pickupTime: string;
  pickupDate: string;
  deliveryAddress: string;
  note: string;
};

// ── Service card ──────────────────────────────────────────────
const ServiceCard = ({ service }: { service: Service }) => {
  const price =
    service.priceModel === "PER_ITEM"
      ? `GHS${service.basePrice} per item`
      : `GHS${service.basePrice} per bag`;

  return (
    <div className="flex gap-4 items-center py-3 px-4 bg-white shadow-sm mx-5 mt-3 rounded-xl">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
        <Image
          src="/images/s3.jpg"
          fill
          alt="service_image"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-0.5 leading-tight">
        <h3 className="text-[15px] font-medium">{service.title}</h3>
        <span className="text-[12px] text-paragraph/70">
          {price} • {service.turnaroundTime}
        </span>
      </div>
    </div>
  );
};

// ── Bottom sheet content ──────────────────────────────────────
type SheetContentProps = {
  type: SheetType;
  form: PickUpFormType;
  onChangeValue: (key: keyof PickUpFormType, value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  availability: AvailabilityTypes | null;
  timeSlots: TimeSlotGroups[];
};

type AvailabilityTypes = {
  today: Date;
  defaultDate: Date;
  endOfWindow: Date;
  disabled: Matcher[];
};
type TimeSlotGroups = {
  session: string;
  group: ServiceTimeSlot[];
};
const SheetContent = ({
  type,
  form,
  onChangeValue,
  onClose,
  onConfirm,
  availability,
  timeSlots,
}: SheetContentProps) => {
  // local draft — starts from current form value so "Change" pre-fills correctly
  const [draft, setDraft] = useState({
    pickupAddress: form.pickupAddress,
    deliveryAddress: form.deliveryAddress,
    note: form.note,
    pickupDate: form.pickupDate,
    pickupTime: form.pickupTime,
  });

  const addressInputRef = useRef<HTMLInputElement>(null);
  const deliveryInputRef = useRef<HTMLInputElement>(null);
  const noteRef = useRef<HTMLTextAreaElement>(null);

  const isDraftFilled = useMemo(() => {
    if (type === "pickup_address") return draft.pickupAddress.trim().length > 0;
    if (type === "delivery_address")
      return draft.deliveryAddress.trim().length > 0;
    if (type === "note") return draft.note.trim().length > 0;
    if (type === "pickup_window")
      return !!draft.pickupDate && !!draft.pickupTime;
    return false;
  }, [draft, type]);

  function dismissKeyboard() {
    addressInputRef.current?.blur();
    deliveryInputRef.current?.blur();
    noteRef.current?.blur();
    // fallback for any other focused element
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  function handleConfirm() {
    dismissKeyboard();
    // only flush to parent on confirm
    if (type === "pickup_address")
      onChangeValue("pickupAddress", draft.pickupAddress);
    if (type === "delivery_address")
      onChangeValue("deliveryAddress", draft.deliveryAddress);
    if (type === "note") onChangeValue("note", draft.note);
    if (type === "pickup_window") {
      onChangeValue("pickupDate", draft.pickupDate);
      onChangeValue("pickupTime", draft.pickupTime);
    }
    onConfirm();
  }

  return (
    <div className="p-5 relative w-full h-full flex flex-col">
      <div className="flex w-full justify-end mb-3">
        <button onClick={onClose}>
          <X size={20} color="#444" />
        </button>
      </div>

      {type === "pickup_address" && (
        <div className="flex-1">
          <h3 className="text-[18px] font-semibold mb-4">Add pickup address</h3>
          <input
            ref={addressInputRef}
            type="text"
            value={draft.pickupAddress}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, pickupAddress: e.target.value }))
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") dismissKeyboard();
            }}
            placeholder="Enter your pickup address"
            className="w-full px-3 py-3 rounded-md border-2 outline-none focus:border-brand border-paragraph/20"
          />
        </div>
      )}

      {type === "delivery_address" && (
        <div className="flex-1">
          <h3 className="text-[18px] font-semibold mb-4">
            Add delivery address
          </h3>
          <input
            ref={deliveryInputRef}
            type="text"
            value={draft.deliveryAddress}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, deliveryAddress: e.target.value }))
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") dismissKeyboard();
            }}
            placeholder="Enter your delivery address"
            className="w-full px-3 py-3 rounded-md border-2 outline-none focus:border-brand border-paragraph/20"
          />
          {form.pickupAddress && (
            <button
              onClick={() =>
                setDraft((prev) => ({
                  ...prev,
                  deliveryAddress: form.pickupAddress,
                }))
              }
              className="mt-3 text-[13px] text-brand font-medium border-b border-brand/30"
            >
              Use same as pickup address
            </button>
          )}
        </div>
      )}

      {type === "note" && (
        <div className="flex-1">
          <h3 className="text-[18px] font-semibold mb-4">
            Further instructions
          </h3>
          <textarea
            ref={noteRef}
            value={draft.note}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, note: e.target.value }))
            }
            placeholder="Any special instructions for your order..."
            rows={5}
            className="w-full px-3 py-3 rounded-md border-2 outline-none focus:border-brand border-paragraph/20 resize-none"
          />
        </div>
      )}

      {type === "pickup_window" && (
        <div className="flex-1 overflow-y-auto">
          <h3 className="text-[18px] font-semibold mb-4">
            Select pickup date & time
          </h3>

          <div className="flex items-center justify-center py-2">
            <DayPicker
              navLayout="around"
              mode="single"
              today={availability?.today}
              startMonth={availability?.today}
              endMonth={availability?.endOfWindow}
              selected={
                draft.pickupDate
                  ? new Date(draft.pickupDate)
                  : availability?.defaultDate
              }
              weekStartsOn={1}
              classNames={{
                disabled: "text-zinc-400 bg-[#fafafa] rounded-full",
                selected: "bg-brand text-white rounded-full",
                today: "rounded-full border-2 border-[#888]",
              }}
              disabled={availability?.disabled}
              onDayClick={(d) => {
                setDraft((prev) => ({
                  ...prev,
                  pickupDate: d.toISOString().split("T")[0],
                }));
              }}
            />
          </div>

          <div className="mt-4 px-4">
            <h3 className="font-medium text-[18px] mb-2">
              Available time slots
            </h3>
            <div className="mt-2">
              {timeSlots.map((slt) => (
                <div key={slt.session} className="flex gap-3 items-center py-2">
                  <h3 className="text-[16px] w-20">{slt.session}</h3>
                  <div className="flex gap-1 flex-wrap">
                    {slt.group.map((grp) => {
                      const time = `${grp.startTime} - ${grp.endTime}`;
                      const isSelected = draft.pickupTime === time;
                      return (
                        <button
                          key={grp.id}
                          onClick={() =>
                            setDraft((prev) => ({ ...prev, pickupTime: time }))
                          }
                          className={`border py-1 px-2 rounded-md text-[13px]
                            ${
                              isSelected
                                ? "bg-brand text-white border-white font-medium"
                                : "border-paragraph/30 text-paragraph/60"
                            }`}
                        >
                          {grp.startTime} - {grp.endTime}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* confirm button — disabled until draft has a value */}
      <div className="pt-4 pb-2">
        <button
          onClick={handleConfirm}
          disabled={!isDraftFilled}
          className={`rounded-full font-medium w-full py-3 px-2 text-center transition-opacity
            ${
              isDraftFilled
                ? "bg-brand text-white"
                : "bg-brand/30 text-white cursor-not-allowed"
            }`}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

// ── Main page ─────────────────────────────────────────────────

export default function OrderFormPage() {
  const params = useSearchParams();
  const id = params.get("sid");
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod>();

  const [step, setStep] = useState<number>(1);
  const [quantities, setQuantities] = useState<Quantities>({});
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [activeSheet, setActiveSheet] = useState<SheetType>(null);
  const [form, setForm] = useState<PickUpFormType>({
    pickupAddress: "",
    pickupTime: "",
    pickupDate: "",
    deliveryAddress: "",
    note: "",
  });
  const { saveOrder } = useOrderDraft();

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [timeSlot, setTimeSlots] = useState<ServiceTimeSlot[] | null>(null);

  const { data } = useServiceWizardId(id as string);
  const selectedService = data?.data;

  const memo = useMemo(() => {
    if (!selectedService) return null;
    const { addOns, availability, timeSlots } = selectedService;
    setTimeSlots(timeSlots as ServiceTimeSlot[]);
    return {
      addOns,
      timeSlots: timeSlots as ServiceTimeSlot[],
      availability: availability as ServiceAvailability,
      service: selectedService as Service,
    };
  }, [id]);

  const onCloseSheet = useCallback(() => {
    setActiveSheet(null);
  }, [activeSheet]);
  const itemGroups = useMemo(() => {
    const groups: ItemGroups[] = [];
    const unique = new Set(laundryItems.map((ld) => ld.category));
    unique.forEach((uniqueCat) => {
      groups.push({
        group: uniqueCat,
        items: laundryItems.filter((lt) => lt.category === uniqueCat),
      });
    });
    return groups;
  }, []);

  // ── ALL hooks must be before any early return ────────────────
  const { totalItems, totalPrice, totalAddons, totalAddonPrice } =
    useMemo(() => {
      const currentAddOns = memo?.addOns ?? [];
      let totalItems = 0;
      let totalPrice = 0;
      const totalAddons = selectedAddOns.length;
      const totalAddonPrice = currentAddOns
        .filter((adn) => selectedAddOns.includes(adn.id))
        .reduce((acc, val) => acc + val.price, 0);
      laundryItems.forEach((item) => {
        const qty = quantities[item.id] ?? 0;
        totalItems += qty;
        totalPrice += qty * item.price;
      });
      totalPrice += totalAddonPrice;
      return { totalItems, totalPrice, totalAddons, totalAddonPrice };
    }, [quantities, selectedAddOns, memo]);

  const onChangeValue = useCallback(
    (key: keyof PickUpFormType, value: string) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const onAddOnSelect = useCallback((id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  }, []);

  function increment(id: string) {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  }

  function decrement(id: string) {
    setQuantities((prev) => {
      const current = prev[id] ?? 0;
      if (current <= 0) return prev;
      return { ...prev, [id]: current - 1 };
    });
  }

  const availabilityData = useMemo(() => {
    const today = new Date();
    const endOfWindow = new Date(today);
    if (memo) {
      const { addOns, availability } = memo;
      endOfWindow.setDate(endOfWindow.getDate() + availability.windowDays);
      const blockedDates = (availability.blockedDates ?? []).map(
        (date) => new Date(date),
      );

      const blockedDays = availability.blockedDays;

      const disabled = [
        { dayOfWeek: availability.blockedDays },
        ...blockedDates,
      ];

      function isSameDate(a: Date, b: Date) {
        return (
          a.getFullYear() === b.getFullYear() &&
          a.getMonth() === b.getMonth() &&
          a.getDate() === b.getDate()
        );
      }

      function getFirstAvailableDate() {
        const date = new Date(today);

        while (true) {
          const isBlockedDay = blockedDays.includes(date.getDay());

          const isBlockedDate = blockedDates.some((d) => isSameDate(d, date));

          if (!isBlockedDay && !isBlockedDate) {
            return new Date(date);
          }

          date.setDate(date.getDate() + 1);
        }
      }
      const defaultDate = getFirstAvailableDate();

      setForm((prev) => ({ ...prev, pickupDate: defaultDate.toISOString() }));

      return { disabled, defaultDate, endOfWindow, today };
    }

    return null;
  }, [memo]);

  const timeSlotGroups = useMemo(() => {
    const slotGroups: TimeSlotGroups[] = [];
    const slotMap = {
      MORNING: "Morning",
      AFTERNOON: "Afternoon",
      EVENING: "Evening",
    };
    if (!memo) return [];

    const { timeSlots } = memo;

    const names = timeSlots.map((slt) => slt.name);
    const unique = new Set(names);

    unique.forEach((unSlt) => {
      const flt = timeSlots.filter((fslt) => fslt.name === unSlt);
      slotGroups.push({ group: flt, session: slotMap[unSlt] });
    });

    return slotGroups;
  }, [memo]);

  const isDisabled =
    (step === 1 && totalItems === 0) ||
    (step === 2 &&
      (!form.deliveryAddress ||
        !form.pickupAddress ||
        !form.pickupTime ||
        !form.pickupDate)) ||
    (step === 4 && !paymentMethods);

  const onPaymentSelect = useCallback(
    (method: PaymentMethod) => {
      setPaymentMethods(method);
    },
    [paymentMethods],
  );

  if (!memo)
    return (
      <div>
        <div className="min-h-screen bg-foreground flex items-center justify-center flex-col gap-3 px-8 text-center">
          <div className="p-6 rounded-full  bg-brand/10">
            <ShoppingBag size={36} className="text-brand" />
          </div>

          <h2 className="text-lg font-semibold">Order not found</h2>
          <p className="text-[14px] text-paragraph/60">
            We couldn't find this order.
          </p>
          <button
            onClick={() => router.back()}
            className="mt-2 bg-brand text-white px-6 py-2.5 rounded-full text-[14px] font-medium"
          >
            Go back
          </button>
        </div>
      </div>
    );

  const { service, addOns, timeSlots, availability } = memo;

  return (
    <div className="bg-foreground min-h-screen w-full">
      {/* fixed header */}
      <div className="flex justify-between items-center fixed top-0 left-0 right-0 bg-foreground z-20 border-b border-paragraph/10 px-4 py-3  gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : router.back())}
          >
            <ArrowLeft size={22} />
          </button>
          <h3 className="text-[17px] font-medium">
            {step === 1
              ? "Add items"
              : step === 2
                ? "Pickup details"
                : step === 3
                  ? "Review & continue"
                  : "Add payment"}
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {step === 1 && totalItems > 0 && (
            <span className="ml-auto text-xs font-medium bg-brand/10 text-brand px-2.5 py-1 rounded-full">
              {totalItems} {totalItems === 1 ? "item" : "items"} selected
            </span>
          )}
          <button
            onClick={() => {
              router.back();
            }}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ── STEP 1 ── */}
        {step === 1 && (
          <motion.div
            key="step1"
            className="pt-16 pb-32 w-full"
            // initial={{ x: "-100%", opacity: 0 }}
            // animate={{ x: 0, opacity: 1 }}
            // exit={{ x: "-100%", opacity: 0 }}
            // transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <ServiceCard service={service} />

            <div className="flex flex-col py-4 gap-4 px-4">
              {itemGroups.map((grp, index) => (
                <div
                  key={grp.group + index}
                  className="bg-white rounded-xl overflow-hidden"
                >
                  <div className="px-4 pt-4 pb-2">
                    <h3 className="font-medium text-[15px] text-paragraph">
                      {grp.group}
                    </h3>
                  </div>
                  {grp.items.map((itm, idx) => {
                    const qty = quantities[itm.id] ?? 0;
                    const isLast = idx === grp.items.length - 1;
                    return (
                      <div
                        key={itm.id}
                        className={`px-3 py-3 ${!isLast ? "border-b border-paragraph/8" : ""}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                            <Image
                              src="/images/s1.jpg"
                              alt={itm.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-[14px] leading-tight">
                              {itm.name}
                            </p>
                            <p className="text-[12px] font-medium text-paragraph/70 mt-1">
                              GHS {itm.price} per {itm.unit}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <button
                              onClick={() => decrement(itm.id)}
                              disabled={qty === 0}
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
                                ${qty === 0 ? "bg-gray-100 text-paragraph/30" : "bg-gray-100 text-paragraph active:bg-gray-200"}`}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-[14px] font-medium w-4 text-center">
                              {qty}
                            </span>
                            <button
                              onClick={() => increment(itm.id)}
                              className="w-8 h-8 rounded-full bg-brand/80 flex items-center justify-center text-white active:opacity-80"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                        {itm.extraInfo && (
                          <p className="text-[13px] pt-2 text-paragraph/70 italic leading-tight mt-0.5 truncate">
                            {itm.extraInfo}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* add-ons */}
            <div className="px-4">
              <h3 className="text-[18px] px-1 font-medium my-3">
                Optional add-ons
              </h3>
              <div className="bg-white rounded-2xl py-3 px-4">
                {addOns?.map((adn, index) => {
                  const isSelected = selectedAddOns.includes(adn.id);
                  return (
                    <div
                      key={adn.id}
                      onClick={() => onAddOnSelect(adn.id)}
                      className={`flex justify-between items-center py-4 cursor-pointer
                        ${addOns.length - 1 !== index ? "border-b border-paragraph/10" : ""}`}
                    >
                      <div className="leading-5 flex-1 pr-3">
                        <h3 className="font-medium text-[15px]">{adn.name}</h3>
                        <p className="text-[13px] text-paragraph/70">
                          {adn.description}
                        </p>
                        <span className="text-[14px] text-paragraph/70 pt-1 block">
                          GHS {adn.price}
                        </span>
                      </div>
                      <CheckBox
                        checked={isSelected}
                        className="h-5 w-5 rounded-sm"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <motion.div
            key="step2"
            className="pt-16 pb-32 w-full"
            // initial={{ x: "100%", opacity: 0 }}
            // animate={{ x: 0, opacity: 1 }}
            // exit={{ x: "100%", opacity: 0 }}
            // transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <ServiceCard service={service} />

            <div className="px-5 mt-4 flex flex-col gap-4">
              {/* order summary */}
              <div className="bg-white rounded-xl px-4 py-4">
                <h3 className="font-medium text-[15px] mb-3">Order summary</h3>
                {laundryItems
                  .filter((itm) => (quantities[itm.id] ?? 0) > 0)
                  .map((itm) => (
                    <div
                      key={itm.id}
                      className="flex justify-between items-center py-2 border-b border-paragraph/8 last:border-0"
                    >
                      <div>
                        <p className="text-[13px] font-medium">{itm.name}</p>
                        <p className="text-[12px] text-paragraph/80">
                          {quantities[itm.id]} × GHS {itm.price}
                        </p>
                      </div>
                      <span className="text-[13px] font-medium">
                        GHS {(quantities[itm.id] ?? 0) * itm.price}
                      </span>
                    </div>
                  ))}

                {totalAddons > 0 && (
                  <div className="flex justify-between py-4 border-b border-paragraph/10">
                    <div className="flex flex-col leading-tight">
                      <span className="text-[14px] font-medium">Add-ons</span>
                      <span className="text-[13px] text-paragraph/80">
                        {totalAddons} {totalAddons === 1 ? "item" : "items"}
                      </span>
                    </div>
                    <span className="text-[14px] font-medium">
                      GHS {totalAddonPrice}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-3 mt-1">
                  <span className="text-[14px] font-medium">Total</span>
                  <span className="text-[14px] font-semibold text-brand">
                    GHS {totalPrice}
                  </span>
                </div>
              </div>

              {/* pickup address */}
              <div className="bg-white rounded-xl px-4 py-4">
                <h3 className="font-medium text-[15px] mb-3">Pickup address</h3>
                {form.pickupAddress ? (
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-paragraph/80 flex-1 mr-3">
                      {form.pickupAddress}
                    </span>
                    <button
                      onClick={() => setActiveSheet("pickup_address")}
                      className="text-[13px] text-brand font-medium shrink-0"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveSheet("pickup_address")}
                    className="border border-brand/40 w-full rounded-xl px-4 py-3 text-paragraph/60 text-[14px] text-left"
                  >
                    Add pickup address
                  </button>
                )}
              </div>

              {/* pickup window */}
              <div className="bg-white rounded-xl px-4 py-4">
                <h3 className="font-medium text-[15px] mb-3">Pickup window</h3>
                {form.pickupDate && form.pickupTime ? (
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-paragraph/80">
                      {new Date(form.pickupDate).toLocaleDateString("en", {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      at {form.pickupTime}
                    </span>
                    <button
                      onClick={() => setActiveSheet("pickup_window")}
                      className="text-[13px] text-brand font-medium"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveSheet("pickup_window")}
                    className="flex items-center justify-between border border-brand/40 w-full rounded-xl px-4 py-3 text-paragraph/60"
                  >
                    <span className="text-[14px]">
                      Select pickup date & time
                    </span>
                    <ChevronDown size={16} />
                  </button>
                )}
              </div>

              {/* delivery address */}
              <div className="bg-white rounded-xl px-4 py-4">
                <h3 className="font-medium text-[15px] mb-3">
                  Delivery address
                </h3>
                {form.deliveryAddress ? (
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-paragraph/80 flex-1 mr-3">
                      {form.deliveryAddress}
                    </span>
                    <button
                      onClick={() => setActiveSheet("delivery_address")}
                      className="text-[13px] text-brand font-medium shrink-0"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {form.pickupAddress && (
                      <button
                        onClick={() =>
                          onChangeValue("deliveryAddress", form.pickupAddress)
                        }
                        className="flex items-center justify-between border border-brand/40 w-full rounded-xl px-4 py-3 text-paragraph/60"
                      >
                        <span className="text-[14px]">
                          Same as pickup address
                        </span>
                        <span className="text-[13px] text-brand font-medium">
                          Use
                        </span>
                      </button>
                    )}
                    <button
                      onClick={() => setActiveSheet("delivery_address")}
                      className="border border-paragraph/20 w-full rounded-xl px-4 py-3 text-paragraph/60 text-[14px] text-left"
                    >
                      Add different delivery address
                    </button>
                  </div>
                )}
              </div>

              {/* further instructions */}
              <div className="bg-white rounded-xl px-4 py-4">
                <h3 className="font-medium text-[15px] mb-3">
                  Further instructions
                </h3>
                {form.note ? (
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[13px] text-paragraph/80 flex-1">
                      {form.note}
                    </p>
                    <button
                      onClick={() => setActiveSheet("note")}
                      className="text-[13px] text-brand font-medium shrink-0"
                    >
                      Edit
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveSheet("note")}
                    className="border border-paragraph/20 w-full rounded-xl px-4 py-3 text-paragraph/60 text-[14px] text-left"
                  >
                    Add special instructions...
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <div className="pt-16 pb-32 w-full">
            <ServiceCard service={service} />

            <div className="flex  flex-col gap-4  py-3 px-4 bg-white shadow-sm mx-5 mt-3 rounded-xl">
              <h3 className="text-[18px] font-semibold">Order summary</h3>
              <div className="flex justify-between  items-center py-2 border-b-[1] border-paragraph/10">
                <div className="leading-5">
                  <h3 className="text-[15px]">Pickup address</h3>
                  <span className="text-[13px] text-paragraph/80">
                    {form.pickupAddress}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setActiveSheet("pickup_address");
                  }}
                  className="text-brand/90 text-[14px] font-medium"
                >
                  change
                </button>
              </div>

              <div className="flex justify-between  items-center py-2 border-b-[1] border-paragraph/10">
                <div className="leading-5">
                  <h3 className="text-[15px]">Pickup window</h3>
                  <span className="text-[13px] text-paragraph/60">
                    {new Date(form.pickupDate).toLocaleDateString("en", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    • {form.pickupTime}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setActiveSheet("pickup_window");
                  }}
                  className="text-brand/90 text-[14px] font-medium"
                >
                  change
                </button>
              </div>

              <div className="flex justify-between  items-center py-2 border-b-[1] border-paragraph/10">
                <div className="leading-5">
                  <h3 className="text-[15px]">Delivery address</h3>
                  <span className="text-[13px] text-paragraph/60">
                    {form.deliveryAddress}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setActiveSheet("delivery_address");
                  }}
                  className="text-brand/90 text-[14px] font-medium"
                >
                  change
                </button>
              </div>

              <div className="flex justify-between  items-center py-2 border-b-[1] border-paragraph/10">
                <div className="leading-4">
                  <h3 className="text-[15px]">Items</h3>
                  <span className="text-[13px] text-paragraph/60">
                    {totalItems} selected
                  </span>
                </div>
                <button
                  onClick={() => {
                    setStep(1);
                  }}
                  className="text-brand/90 text-[14px] font-medium"
                >
                  Edit
                </button>
              </div>

              {selectedAddOns.length > 0 && (
                <div className="flex justify-between  items-center py-2 border-b-[1] border-paragraph/10">
                  <div className="leading-4">
                    <h3 className="text-[15px]">Add ons</h3>
                    <span className="text-[13px] text-paragraph/60">
                      {totalAddons} selected
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setStep(1);
                    }}
                    className="text-brand/90 text-[14px] font-medium"
                  >
                    Edit
                  </button>
                </div>
              )}

              <div className="flex justify-between  items-center py-2 border-b-[1] border-paragraph/10">
                <div className="leading-4">
                  <h3
                    onClick={() => {
                      setActiveSheet("total_price");
                    }}
                    className="text-[15px] border-b-2 mb-1 border-b-black/40 w-fit font-medium"
                  >
                    Total Price
                  </h3>
                  <span className="text-[13px] text-paragraph/60">
                    {totalItems} item{totalItems > 1 ? "s" : ""}{" "}
                    {totalAddons > 0
                      ? `  •  ${totalAddons} add on${totalAddons > 1 ? "s" : ""}`
                      : ""}
                  </span>
                </div>
                <span className="text-brand/90 text-[14px] font-medium">
                  GHS{totalPrice}
                </span>
              </div>
            </div>
            {form.note && (
              <div className="flex flex-col py-3 px-4 bg-white shadow-sm mx-5 mt-3 rounded-xl">
                <div className="leading-4 py-1">
                  <h3 className="text-[15px]">Special instruction</h3>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[14px] text-paragraph/60">
                    {form.note}
                  </span>
                  <button
                    onClick={() => {
                      setActiveSheet("note");
                    }}
                    className="text-brand/90 text-[14px] font-medium"
                  >
                    Edit
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="pt-20 pb-32 w-full ">
            <div className="flex  flex-col gap-4  py-3 px-3 bg-white shadow-sm mx-5 mt-3 rounded-xl">
              <h3 className="text-[18px] font-semibold">
                Select payment method
              </h3>
              <div
                onClick={() => {
                  onPaymentSelect("PICKUP");
                }}
                className=" relative border-[2] border-paragraph/20 px-2 flex gap-3 py-6 rounded-2xl"
              >
                <div className="bg-brand/10  self-start p-1.5 rounded-full flex items-center justify-center">
                  <Truck color="#004a94" size={23} />
                </div>
                <div className="leading-tight">
                  <h4 className="text-[16px] font-medium">Pay at Pickup</h4>
                  <span className="text-[14px] leading-0.5 text-paragraph/80">
                    Payment will be taken at pickup time for your laundry
                  </span>
                </div>

                <div className="absolute top-2 right-2">
                  <CheckBox
                    className="h-5 w-5 rounded-full"
                    checked={paymentMethods === "PICKUP"}
                  />
                </div>
              </div>

              <div className="py-2 border-b-[1] flex flex-col gap-4 border-paragraph/10">
                <div
                  onClick={() => {
                    onPaymentSelect("MTN");
                  }}
                  className=" relative border-[2] border-paragraph/20 px-2 flex gap-3 py-6 rounded-2xl"
                >
                  <div className=" h-10 w-16 rounded-md overflow-hidden relative ">
                    <Image
                      src={"/images/mtn.jpg"}
                      fill
                      alt="mtn_momo_logo"
                      className="object-cover"
                    />
                  </div>
                  <div className="leading-tight">
                    <h4 className="text-[16px] font-medium">
                      Pay with MTN momo
                    </h4>
                    <span className="text-[14px] leading-2 text-paragraph/80">
                      Continue with MTN mobile money
                    </span>
                  </div>

                  <div className="absolute top-2 right-2">
                    <CheckBox
                      className="h-5 w-5 rounded-full"
                      checked={paymentMethods === "MTN"}
                    />
                  </div>
                </div>

                <div
                  onClick={() => {
                    onPaymentSelect("AIRTELTIGO");
                  }}
                  className=" relative border-[2] border-paragraph/20 px-2 flex gap-3 py-6 rounded-2xl"
                >
                  <div className=" h-10 w-16 rounded-md overflow-hidden relative ">
                    <Image
                      src={"/images/airtelTigo.jpg"}
                      fill
                      alt="airtelTigo_cash_logo"
                      className="object-cover"
                    />
                  </div>
                  <div className="leading-tight">
                    <h4 className="text-[16px] font-medium">
                      Pay with AirtelTigo money
                    </h4>
                    <span className="text-[14px] leading-2 text-paragraph/80">
                      Continue with AirtelTigo
                    </span>
                  </div>

                  <div className="absolute top-2 right-2">
                    <CheckBox
                      className="h-5 w-5 rounded-full"
                      checked={paymentMethods === "AIRTELTIGO"}
                    />
                  </div>
                </div>
                <div
                  onClick={() => {
                    onPaymentSelect("TELECEL");
                  }}
                  className=" relative border-[2] border-paragraph/20 px-2 flex gap-3 py-6 rounded-2xl"
                >
                  <div className=" h-10 w-16 rounded-md overflow-hidden relative ">
                    <Image
                      src={"/images/telecel.jpg"}
                      fill
                      alt="telecel_cash_logo"
                      className="object-cover"
                    />
                  </div>
                  <div className="leading-tight">
                    <h4 className="text-[16px] font-medium">
                      Pay with Telecel cash
                    </h4>
                    <span className="text-[14px] leading-2 text-paragraph/80">
                      Continue with Telecel cash
                    </span>
                  </div>

                  <div className="absolute top-2 right-2">
                    <CheckBox
                      className="h-5 w-5 rounded-full"
                      checked={paymentMethods === "TELECEL"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* fixed bottom CTA */}
      <div className="fixed  justify-between bottom-0 left-0 right-0 bg-white  z-20">
        <div className=" flex gap-2 ">
          {Array.from({ length: 4 }).map((stp, idx) => (
            <div
              key={"step" + stp + idx}
              className={`h-[4] flex-1  rounded-2xl ${step >= idx + 1 ? "bg-brand" : "bg-gray-300"}`}
            />
          ))}
        </div>

        <div className="justify-between  px-6 py-4 flex items-center gap-4 z-20">
          <div className="flex flex-col leading-tight px-2">
            <span className="text-[12px] text-paragraph/60">
              {totalItems} {totalItems === 1 ? "item" : "items"}
              {totalAddons !== 0 &&
                ` • ${totalAddons} ${totalAddons === 1 ? "add-on" : "add-ons"}`}
            </span>
            <span className="text-[18px] font-medium">GHS {totalPrice}</span>
          </div>
          <button
            onClick={() => {
              if (step >= 4) {
                //submit order here and navigate
                const id = "addheiaiaii848750kayyhehdoskd";

                router.push(`booking-confirmation?type=success&oid=${id}`);
                const addOnSelected = addOns?.filter((adn) =>
                  selectedAddOns.includes(adn.id),
                );
                saveOrder({
                  ...form,
                  totalPrice,
                  addOns: addOnSelected,
                  quantities: quantities,
                  paymentMethod: paymentMethods as PaymentMethod,
                });
                return;
              }
              if (step === 1 && totalItems > 0) {
                setStep(2);
              }
              if (
                step === 2 &&
                form.deliveryAddress &&
                form.pickupAddress &&
                form.pickupTime &&
                form.pickupDate
              ) {
                setStep(3);
              } else {
                setStep(step + 1);
              }
            }}
            disabled={isDisabled}
            className={`w-2/3 py-3.5 rounded-full text-[15px] font-medium transition-opacity
            ${
              isDisabled
                ? "bg-brand/30 text-white cursor-not-allowed"
                : "bg-brand text-white active:opacity-80"
            }`}
          >
            {step === 1 || step === 2
              ? "Continue"
              : step === 3
                ? "Confirm order"
                : step === 4
                  ? "Continue with payment"
                  : null}
          </button>
        </div>
      </div>

      <BottomSheet
        open={!!activeSheet}
        onClose={onCloseSheet}
        height={
          activeSheet === "pickup_window"
            ? "95%"
            : activeSheet === "total_price"
              ? "90%"
              : "70%"
        }
      >
        {activeSheet === "total_price" ? (
          <div className="p-4">
            <div
              className="flex justify-end p-1"
              onClick={() => onCloseSheet()}
            >
              <X size={18} />
            </div>
            <div className="bg-white rounded-xl px-4 py-4">
              <h3 className="font-semibold text-[16px] mb-3">
                Price breakdown
              </h3>
              {laundryItems
                .filter((itm) => (quantities[itm.id] ?? 0) > 0)
                .map((itm) => (
                  <div
                    key={itm.id}
                    className="flex justify-between items-center py-2 border-b border-paragraph/8 last:border-0"
                  >
                    <div>
                      <p className="text-[13px] font-medium">{itm.name}</p>
                      <p className="text-[12px] text-paragraph/80">
                        {quantities[itm.id]} × GHS {itm.price}
                      </p>
                    </div>
                    <span className="text-[13px] font-medium">
                      GHS {(quantities[itm.id] ?? 0) * itm.price}
                    </span>
                  </div>
                ))}

              {totalAddons > 0 && (
                <div className="flex justify-between py-4 border-b border-paragraph/10">
                  <div className="flex flex-col leading-tight">
                    <span className="text-[14px] font-medium">Add-ons</span>
                    <span className="text-[13px] text-paragraph/80">
                      {totalAddons} {totalAddons === 1 ? "item" : "items"}
                    </span>
                  </div>
                  <span className="text-[14px] font-medium">
                    GHS {totalAddonPrice}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center pt-3 mt-2">
                <span className="text-[16px] font-medium">Total price</span>
                <span className="text-[14px] font-semibold text-brand">
                  GHS {totalPrice}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <SheetContent
            type={activeSheet}
            form={form}
            onChangeValue={onChangeValue}
            onClose={() => setActiveSheet(null)}
            onConfirm={() => setActiveSheet(null)}
            timeSlots={timeSlotGroups}
            availability={availabilityData}
          />
        )}
      </BottomSheet>
    </div>
  );
}
