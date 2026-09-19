export const API_URL: string =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type ApiOptions = Omit<RequestInit, "body" | "headers"> & {
  json?: unknown;
  body?: FormData;
};

export async function apiFetch<T>(
  path: string,
  { json, body, ...rest }: ApiOptions = {},
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      credentials: "include",
      ...rest,
      headers:
        json !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: json !== undefined ? JSON.stringify(json) : body,
    });
  } catch {
    throw new ApiError(0, "Network error. Check your connection.");
  }

  if (!response.ok) {
    let message = "Request failed";
    try {
      const data = await response.json();
      if (data?.message) message = data.message;
    } catch {}
    throw new ApiError(response.status, message);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong",
): string {
  return error instanceof ApiError ? error.message : fallback;
}
