import { apiRequest } from "@/services/api";
import type { Cart } from "@/utils/types";

export async function getCart(token: string) {
  const res = await apiRequest<{ cart: Cart }>("/cart", { token });
  return res.cart;
}

export async function addCartItem(token: string, input: { productId: string; quantity: number }) {
  const res = await apiRequest<{ cart: Cart }>("/cart/items", {
    token,
    method: "POST",
    body: input
  });
  return res.cart;
}

export async function updateCartItem(token: string, itemId: string, quantity: number) {
  const res = await apiRequest<{ cart: Cart }>(`/cart/items/${itemId}`, {
    token,
    method: "PATCH",
    body: { quantity }
  });
  return res.cart;
}

export async function removeCartItem(token: string, itemId: string) {
  const res = await apiRequest<{ cart: Cart }>(`/cart/items/${itemId}`, {
    token,
    method: "DELETE"
  });
  return res.cart;
}

