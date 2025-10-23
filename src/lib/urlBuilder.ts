// src/lib/url.ts

/**
 * A safe and robust URL builder for the Noroff API.
 * This function centralizes URL construction for the entire application.
 * @param path The API endpoint path (e.g., "/social/posts").
 * @param params An optional object of query parameters.
 * @returns A full, URL-safe string.
 */
export function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>) {
  const baseUrl = process.env.NEXT_PUBLIC_NOROFF_API_URL;

  if (!baseUrl) {
    throw new Error("API base URL is not defined. Please check your .env.local file.");
  }

  const url = new URL(path, baseUrl);

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}
