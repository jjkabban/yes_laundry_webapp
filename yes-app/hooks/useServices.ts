import {
  getServices,
  getServicesById,
  getServiceWizardDetailById,
} from "@/lib/api/service.api";
import { ApiResponse } from "@/lib/api/type/response.api";
import { Service } from "@/types/shared/service.types";
import { ServiceWizardDetail } from "@/types/shared/service.types";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useServices = (): UseQueryResult<ApiResponse<Service[]>> => {
  return useQuery({
    queryKey: ["services"],
    queryFn: () => getServices(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useServiceId = (
  id: string,
): UseQueryResult<ApiResponse<ServiceWizardDetail>> => {
  return useQuery({
    queryKey: ["service", id],
    queryFn: () => getServiceWizardDetailById(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
};

export const useServiceWizardId = (
  id: string,
): UseQueryResult<ApiResponse<ServiceWizardDetail>> => {
  return useQuery({
    queryKey: ["service-wizard", id],
    queryFn: () => getServicesById(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
};
