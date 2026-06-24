import { api } from "./client";
import { NewOrderPayload, UserOrdersResponsePayload } from "./type/order.type";
import { ApiResponse } from "./type/response.api";

export const getUserOrders = async (): Promise<
  ApiResponse<UserOrdersResponsePayload>
> =>
  api.get<Promise<ApiResponse<UserOrdersResponsePayload>>>(
    "/order/user-orders",
  );

export const createOrder = async (order: NewOrderPayload) =>
  api.post<Promise<ApiResponse<null>>>("/order/new", { order });
