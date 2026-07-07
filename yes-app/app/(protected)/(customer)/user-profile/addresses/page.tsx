"use client";

import { useCallback, useState } from "react";
import { ArrowLeft, MapPin, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { BottomSheet, AddressInput } from "@/components/components";

type SheetContentType = "pickup" | "delivery";

export default function AddressesPage() {
  const router = useRouter();

  const [address, setAddress] = useState({
    pickup: "",
    delivery: "",
  });

  const [draftAddress, setDraftAddress] = useState({
    pickup: "",
    delivery: "",
  });

  const [sheetContent, setSheetContent] = useState<SheetContentType>("pickup");

  const [openSheet, setOpenSheet] = useState(false);

  const closeSheet = useCallback(() => {
    setOpenSheet(false);
  }, []);

  const open = useCallback((type: SheetContentType) => {
    setSheetContent(type);
    setOpenSheet(true);
  }, []);

  const onSubmit = useCallback(() => {
    const value = draftAddress[sheetContent].trim();
    if (!value) return;

    setAddress((prev) => ({
      ...prev,
      [sheetContent]: value,
    }));

    setOpenSheet(false);
  }, [draftAddress, sheetContent]);

  return (
    <div className="min-h-screen bg-bgBase">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-bgBase border-b border-b-paragraph/20 px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()}>
          <ArrowLeft />
        </button>
        <h1 className="text-xl font-semibold">My Addresses</h1>
      </div>

      <div className="pt-20 px-4 space-y-6">
        <p className="text-[18px] text-gray-500">
          Set your default pickup and delivery addresses.
        </p>

        {/* Pickup */}
        <div
          onClick={() => open("pickup")}
          className="bg-white border border-paragraph/30 rounded-2xl p-4 space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-gray-700 font-medium">
              <MapPin size={20} />
              Pickup Address
            </div>

            <button className="text-brand text-sm font-medium">
              {address.pickup ? "Change" : "Add"}
            </button>
          </div>

          <p
            className={`text-sm ${
              address.pickup ? "text-gray-700" : "text-gray-400"
            }`}
          >
            {address.pickup || "No pickup address added"}
          </p>
        </div>

        {/* Delivery */}
        <div
          onClick={() => open("delivery")}
          className="bg-white border rounded-2xl p-4 space-y-2 border-paragraph/30"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-gray-700 font-medium">
              <MapPin size={20} />
              Delivery Address
            </div>

            <button className="text-brand text-sm font-medium">
              {address.delivery ? "Change" : "Add"}
            </button>
          </div>

          <p
            className={`text-sm ${
              address.delivery ? "text-gray-700" : "text-gray-400"
            }`}
          >
            {address.delivery || "No delivery address added"}
          </p>
        </div>
      </div>

      {/* Bottom Sheet */}
      <BottomSheet open={openSheet} onClose={closeSheet} height="90%">
        <div className="px-4 pb-6">
          {/* header */}
          <div className="flex justify-between items-center py-3">
            <h2 className="text-lg font-semibold">
              {sheetContent === "pickup"
                ? "Pickup Address"
                : "Delivery Address"}
            </h2>

            <button onClick={closeSheet}>
              <X />
            </button>
          </div>

          <p className="text-sm text-gray-500 mb-4">
            Search and select your address
          </p>

          {/* input */}
          <AddressInput
            onChangeValue={(val) => {
              setDraftAddress((prev) => ({
                ...prev,
                [sheetContent]: val,
              }));
            }}
          />

          {/* save */}
          <button
            onClick={onSubmit}
            disabled={!draftAddress[sheetContent].trim()}
            className="mt-6 w-full py-3 rounded-full bg-brand text-white font-medium disabled:opacity-50"
          >
            Save address
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}
