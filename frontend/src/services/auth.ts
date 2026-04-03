import { apiRequest } from "@/services/api";
import type { User } from "@/utils/types";

export async function registerUser(input: { email: string; password: string; name?: string }) {
  return apiRequest<{ user: User; token: string }>("/auth/register", {
    method: "POST",
    body: input
  });
}

export async function loginUser(input: { email: string; password: string }) {
  return apiRequest<{ user: User; token: string }>("/auth/login", {
    method: "POST",
    body: input
  });
}

export async function me(token: string) {
  return apiRequest<{ user: User }>("/auth/me", { token });
}

