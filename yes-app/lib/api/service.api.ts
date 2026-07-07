import { Service, ServiceWizardDetail } from "@/types/shared/service.types";
import { ApiResponse } from "./type/response.api";
import { api } from "./client";

export const getServices = async (): Promise<ApiResponse<Service[]>> =>
  api.get<Promise<ApiResponse<Service[]>>>("/service/all");

export const getServicesById = async (
  id: string,
): Promise<ApiResponse<Service>> =>
  api.post<Promise<ApiResponse<Service>>>(`/service/${id}`);

export const getServiceWizardDetailById = async (
  id: string,
): Promise<ApiResponse<ServiceWizardDetail>> =>
  api.post<Promise<ApiResponse<ServiceWizardDetail>>>(`/service/${id}`);
