import type { ApiErrorResponse } from "./types";

interface ApiCallOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  token?: string | null;
}

/**
 * A centralized, authenticated fetch function for the Noroff API.
 * @param endpoint The API endpoint to call (e.g., "/social/posts").
 *
 * @returns The `data` property from the API response.
 * @template T The expected type of the `data` property.
 */
export async function authenticatedFetch<T>(endpoint: string, options: ApiCallOptions = {}): Promise<T> {
  const { method = "GET", body, token } = options;
  const apiKey = process.env.NEXT_PUBLIC_NOROFF_API_KEY;

  if (!apiKey) {
    throw new Error("API key is missing. Please check your .env.local file.");
  }

  const headers: HeadersInit = {
    "X-Noroff-API-Key": apiKey,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const requestOptions: RequestInit = {
    method,
    headers,
  };

  if (body) {
    headers["Content-Type"] = "application/json";
    requestOptions.body = JSON.stringify(body);
  }

  const response = await fetch(`${endpoint}`, requestOptions);

  if (response.status === 204) {
    return null as T;
  }

  const responseData = await response.json();

  if (!response.ok) {
    const errorData: ApiErrorResponse = responseData;
    throw new Error(errorData.errors[0]?.message ?? `API call failed with status ${response.status}`);
  }

  return responseData as T;
}
