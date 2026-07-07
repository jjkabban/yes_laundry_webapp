import { OrderDraft } from "@/types/shared/order.type";
import { api } from "./client";
import {
  NewOrderPayload,
  CreateOrderDraftPayload,
  UpdateOrderDraftInputPayload,
  UserDraftOrderResponsePayload,
  UserOrderResponsePayload,
} from "./type/order.type";
import { ApiResponse } from "./type/response.api";

export const getUserOrders = async (): Promise<
  ApiResponse<UserOrderResponsePayload>
> => api.get<ApiResponse<UserOrderResponsePayload>>("/order/user");

export const getUserOrder = async (
  orderId: string,
): Promise<ApiResponse<UserOrderResponsePayload>> =>
  api.get<ApiResponse<UserOrderResponsePayload>>(`/order/${orderId}`);

export const createOrder = async (
  order: NewOrderPayload,
): Promise<ApiResponse<null>> =>
  api.post<ApiResponse<null>>("/order/new", { order });

export const getDraftOrders = async (): Promise<
  ApiResponse<UserDraftOrderResponsePayload>
> => api.get<ApiResponse<UserDraftOrderResponsePayload>>("/order/draft/user");

export const getDraftOrder = async (
  orderDraftId: string,
): Promise<ApiResponse<OrderDraft>> =>
  api.get<ApiResponse<OrderDraft>>(`/order/draft/${orderDraftId}`);

export const createDraftOrder = async (
  data: CreateOrderDraftPayload,
): Promise<ApiResponse<OrderDraft>> =>
  api.post<ApiResponse<OrderDraft>>("/order/draft/create", data);

export const updateDraftOrder = async (
  draftId: string,
  data: UpdateOrderDraftInputPayload,
): Promise<ApiResponse<OrderDraft>> =>
  api.patch<ApiResponse<OrderDraft>>(`/order/draft/${draftId}`, data);
