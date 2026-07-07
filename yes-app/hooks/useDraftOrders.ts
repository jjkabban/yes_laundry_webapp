import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createDraftOrder,
  getDraftOrders,
  updateDraftOrder,
} from "@/lib/api/order.api";
import {
  CreateOrderDraftPayload,
  UpdateOrderDraftInputPayload,
} from "@/lib/api/type/order.type";

export const useDraftOrders = () => {
  return useQuery({
    queryKey: ["orderDrafts"],
    queryFn: () => getDraftOrders(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateDraftOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderDraftPayload) => createDraftOrder(data),
    onSuccess: (response) => {
      const draft = response.data;

      queryClient.setQueryData(["orderDraft", draft?.id], draft);
      queryClient.invalidateQueries({ queryKey: ["orderDrafts"] });
    },
  });
};

export const useUpdateOrderDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateOrderDraftInputPayload;
    }) => updateDraftOrder(id, data),
    onSuccess: (response, variables) => {
      const draft = response.data;
      queryClient.setQueryData(["orderDraft", variables.id], draft);
    },
  });
};
