import { getServices, getServicesById } from "@/lib/api/service.api";
import { ApiResponse } from "@/lib/api/type/response.api";
import { ServiceResponsePayload } from "@/lib/api/type/service.types";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useServices = (): UseQueryResult<
  ApiResponse<ServiceResponsePayload[]>
> => {
  return useQuery({
    queryKey: ["services"],
    queryFn: () => getServices(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useServiceId = (
  id: string,
): UseQueryResult<ApiResponse<ServiceResponsePayload>> => {
  return useQuery({
    queryKey: ["service", id],
    queryFn: () => getServicesById(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
};
