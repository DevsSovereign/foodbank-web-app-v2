import { ApiError } from "@/types/api";
import { clearAuthToken, getAuthToken } from "./auth-utils";
import { API_BASE_URL } from "./config";

const BASE_URL = API_BASE_URL;

function handleUnauthorized() {
  clearAuthToken();
  window.location.replace("/login");
}

/**
 * Lightweight, typed fetch wrapper for the FoodBank4U API.
 *
 * - Prepends the base URL from env
 * - Sets JSON headers automatically
 * - Attaches Bearer token when available
 * - Throws `ApiError` with the backend message on non-2xx responses
 */
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Attach auth token if it exists (for protected endpoints later)

  const token = getAuthToken();
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  // Try to parse the JSON body — handle empty / non-JSON responses gracefully
  let body: Record<string, unknown>;
  try {
    const text = await res.text();
    body = text ? JSON.parse(text) : {};
  } catch {
    // If the response isn't valid JSON but the request succeeded, return a
    // generic success object so callers aren't tripped up by 201-no-body.
    if (res.ok) {
      return { message: "Success" } as T;
    }
    throw new ApiError("An unexpected error occurred", res.status);
  }

  if (!res.ok) {
    if (res.status === 401) handleUnauthorized();
    const message = (body.message as string) ?? `Request failed with status ${res.status}`;
    throw new ApiError(message, res.status, body.errors as Record<string, string[]> | undefined);
  }

  return body as T;
}

/** Typed convenience methods for each HTTP verb. */
export const apiClient = {
  get<T>(endpoint: string, options?: RequestInit) {
    return request<T>(endpoint, { ...options, method: "GET" });
  },

  post<T>(endpoint: string, data?: unknown, options?: RequestInit) {
    return request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  patch<T>(endpoint: string, data?: unknown, options?: RequestInit) {
    return request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  put<T>(endpoint: string, data?: unknown, options?: RequestInit) {
    return request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  del<T>(endpoint: string, data?: unknown, options?: RequestInit) {
    return request<T>(endpoint, {
      ...options,
      method: "DELETE",
      body: data ? JSON.stringify(data) : undefined,
    });
  },
};
