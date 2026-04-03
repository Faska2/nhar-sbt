import { apiRequest } from "@/services/api";
import type { Category, Product } from "@/utils/types";

export async function adminCreateCategory(token: string, input: { name: string; slug?: string }) {
  const res = await apiRequest<{ category: Category }>("/categories", {
    token,
    method: "POST",
    body: input
  });
  return res.category;
}

export async function adminUpdateCategory(token: string, id: string, input: { name?: string; slug?: string }) {
  const res = await apiRequest<{ category: Category }>(`/categories/${id}`, {
    token,
    method: "PATCH",
    body: input
  });
  return res.category;
}

export async function adminDeleteCategory(token: string, id: string) {
  return apiRequest<{ ok: true }>(`/categories/${id}`, { token, method: "DELETE" });
}

export async function adminCreateProduct(
  token: string,
  input: {
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: string;
    images: string[];
  }
) {
  const res = await apiRequest<{ product: Product }>("/products", {
    token,
    method: "POST",
    body: input
  });
  return res.product;
}

export async function adminUpdateProduct(
  token: string,
  id: string,
  input: Partial<{
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: string;
    images: string[];
  }>
) {
  const res = await apiRequest<{ product: Product }>(`/products/${id}`, {
    token,
    method: "PATCH",
    body: input
  });
  return res.product;
}

export async function adminDeleteProduct(token: string, id: string) {
  return apiRequest<{ ok: true }>(`/products/${id}`, { token, method: "DELETE" });
}

