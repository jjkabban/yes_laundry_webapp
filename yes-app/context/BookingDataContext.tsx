"use client";

import { useContext, createContext, useState } from "react";
import { BookingDataContextType, BookingDataType } from "./types/booking";

const BookingContext = createContext<BookingDataContextType | null>(null);

export default function BookingDataContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [formData, setFormData] = useState<BookingDataType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [extraInfo, setExtraInfo] = useState<string>();

  const clearFormData = () => {
    setFormData(null);
    sessionStorage.removeItem("pendingPickup");
  };
  const saveFormData = (data: BookingDataType, extInfo?: string) => {
    const setDefaultExtra =
      "One quick step left — sign up to confirm your pickup.";
    try {
      sessionStorage.setItem(
        "pendingPickup",
        JSON.stringify({
          ...data,
          extraInfo: extInfo ?? setDefaultExtra,
        }),
      );
      setFormData(data);
      setExtraInfo(extInfo ?? setDefaultExtra);
    } catch {}
  };

  return (
    <BookingContext.Provider
      value={{ formData, saveFormData, extraInfo, isLoading, clearFormData }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export const useBookingData = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("Component must be in a Booking context Provider");
  }
  return context;
};
