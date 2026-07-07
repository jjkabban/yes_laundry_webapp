"use client";

import { useState, useCallback } from "react";
import {
  ManualLocationPayload,
  UserLocationPayload,
} from "@/lib/api/type/auth.type";
import { api } from "@/lib/api/client";
import { ApiResponse } from "@/lib/api/type/response.api";
import { getLocation, setManualLocation } from "@/lib/api/auth.api";

type Status = "idle" | "loading" | "success" | "denied" | "error";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useGeolocation() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UserLocationPayload | null>(null);

  const fetchLocation = async (params: { lat: number; lng: number } | null) => {
    try {
      const url = params
        ? `${API_URL}/location?lat=${params.lat}&lng=${params.lng}`
        : `${API_URL}/location`;

      const res = await getLocation(url);

      if (!res.success) {
        throw new Error("Location lookup failed");
      }

      const data = res.data;

      setResult({
        address: data?.address ?? null,
        city: data?.city ?? null,
        neighborhood: data?.neighborhood ?? null,
        isDefault: true,
        label: "personal",
      });
      setStatus("success");
    } catch {
      setStatus("error");
      setError("Couldn't determine your location. Please enter it manually.");
    }
  };

  const submitDefaultLocation = async (data: ManualLocationPayload) => {
    try {
      setStatus("loading");
      const res = await setManualLocation(data);
      if (!res.success) {
        throw new Error(res.message);
      }
      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setError(err);
    }
  };

  const requestLocation = useCallback(() => {
    setStatus("loading");
    setError(null);

    if (!("geolocation" in navigator)) {
      // browser has no geolocation API at all — go straight to IP fallback
      fetchLocation(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // GPS succeeded — send real coordinates to the backend
        const { latitude, longitude } = position.coords;
        fetchLocation({ lat: latitude, lng: longitude });
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          // user explicitly said no — stop here, no backend call, no fallback
          setStatus("denied");
          setError("Location access was denied.");
          return;
        }

        // GPS failed for a non-permission reason (timeout/unavailable) — fall back to IP
        fetchLocation(null);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }, []);

  return { status, error, result, requestLocation, submitDefaultLocation };
}
