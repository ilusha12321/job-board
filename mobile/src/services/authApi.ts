import { apiFetch, ApiError } from "./apiClient";

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  role: "jobseeker" | "employer";
};

export function loginUser(username: string, password: string) {
  return apiFetch<AuthUser>("/auth/login", {
    method: "POST",
    json: { username, password },
  });
}

export function registerUser(
  username: string,
  email: string,
  password: string,
  role: "jobseeker" | "employer",
) {
  return apiFetch<AuthUser>("/auth/register", {
    method: "POST",
    json: { username, email, password, role },
  });
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    return await apiFetch<AuthUser>("/auth/me");
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) return null;
    throw e;
  }
}

export function logoutUser() {
  return apiFetch<void>("/auth/logout", { method: "POST" });
}
