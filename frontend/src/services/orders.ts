import { apiRequest } from "@/services/api";
import type { Order, OrderStatus } from "@/utils/types";

export async function placeOrder(
  token: string,
  input: {
    shippingName: string;
    shippingAddress1: string;
    shippingCity: string;
    shippingCountry: string;
  }
) {
  const res = await apiRequest<{ order: Order }>("/orders", { token, method: "POST", body: input });
  return res.order;
}

export async function myOrders(token: string) {
  const res = await apiRequest<{ orders: Order[] }>("/orders", { token });
  return res.orders;
}

export async function getOrder(token: string, id: string) {
  const res = await apiRequest<{ order: Order }>(`/orders/${id}`, { token });
  return res.order;
}

export async function adminAllOrders(token: string) {
  const res = await apiRequest<{ orders: (Order & { user?: { email: string } })[] }>("/orders/admin/all", {
    token
  });
  return res.orders;
}

export async function adminUpdateOrderStatus(token: string, id: string, status: OrderStatus) {
  const res = await apiRequest<{ order: Order }>(`/orders/admin/${id}/status`, {
    token,
    method: "PATCH",
    body: { status }
  });
  return res.order;
}

