import { ServiceResponsePayload } from "./type/service.types";
import { Service } from "@/types/shared/service.types";
import { ApiResponse } from "./type/response.api";
import { api } from "./client";

export const getServices = async (): Promise<
  ApiResponse<ServiceResponsePayload[]>
> => api.get<Promise<ApiResponse<ServiceResponsePayload[]>>>("/service/all");

export const getServicesById = async (
  id: string,
): Promise<ApiResponse<Service>> =>
  api.post<Promise<ApiResponse<ServiceResponsePayload>>>(`/service/${id}`);
