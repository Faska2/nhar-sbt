import type { User } from "@/utils/types";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

type ApiErrorShape = { message?: string; details?: unknown };

export type ApiResult<T> = { data: T };

export function getApiBase() {
  return API_BASE as string;
}

export async function apiRequest<T>(
  path: string,
  options: {
    method?: string;
    body?: unknown;
    token?: string | null;
  } = {}
) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "content-type": "application/json",
      ...(options.token ? { authorization: `Bearer ${options.token}` } : {})
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body)
  });

  if (!res.ok) {
    let payload: ApiErrorShape | null = null;
    try {
      payload = (await res.json()) as ApiErrorShape;
    } catch {
      payload = null;
    }
    const msg = payload?.message || `Request failed (${res.status})`;
    const err = new Error(msg) as Error & { details?: unknown };
    err.details = payload?.details;
    throw err;
  }

  return (await res.json()) as T;
}

export type AuthResponse = { user: User; token: string };
