import { type User } from "../types/user";
import { apiFetch, ApiError } from "./apiClient";

export function registerUser(
  username: string,
  email: string,
  password: string,
  role: "jobseeker" | "employer",
): Promise<User> {
  return apiFetch<User>("/auth/register", {
    method: "POST",
    json: { username, email, password, role },
  });
}

export function loginUser(username: string, password: string): Promise<User> {
  return apiFetch<User>("/auth/login", {
    method: "POST",
    json: { username, password },
  });
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    return await apiFetch<User>("/auth/me");
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}

export function logoutUser(): Promise<void> {
  return apiFetch<void>("/auth/logout", { method: "POST" });
}
