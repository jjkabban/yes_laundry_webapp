import { Service, ServiceDetail } from "@/types/shared/service.types";
import { ApiResponse } from "./type/response.api";

export async function getServices(): Promise<ApiResponse<Service[]>> {
  const res = await fetch(`${process.env.BACKEND_URL}/service/all`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch services");
  return res.json();
}

export async function getServiceById(
  id: string,
): Promise<ApiResponse<ServiceDetail>> {
  const res = await fetch(`${process.env.BACKEND_URL}/service/${id}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Service not found");
  return res.json();
}
