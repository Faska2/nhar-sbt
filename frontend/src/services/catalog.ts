import { apiRequest } from "@/services/api";
import type { Category, Product } from "@/utils/types";

export async function listCategories() {
  const res = await apiRequest<{ categories: Category[] }>("/categories");
  return res.categories;
}

export async function listProducts(params: {
  categoryId?: string;
  q?: string;
  sort?: "price_asc" | "price_desc" | "newest";
}) {
  const sp = new URLSearchParams();
  if (params.categoryId) sp.set("categoryId", params.categoryId);
  if (params.q) sp.set("q", params.q);
  if (params.sort) sp.set("sort", params.sort);

  const res = await apiRequest<{ products: Product[] }>(`/products?${sp.toString()}`);
  return res.products;
}

export async function getProduct(id: string) {
  const res = await apiRequest<{ product: Product }>(`/products/${id}`);
  return res.product;
}

