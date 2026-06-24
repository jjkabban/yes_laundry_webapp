const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { params, headers, ...rest } = options;

  let url = `${BASE_URL}${endpoint}`;
  if (params) {
    url += `?${new URLSearchParams(params).toString()}`;
  }

  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...rest,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!res.ok) {
    throw data ?? new Error(`Request failed with status ${res.status}`);
  }

  return data as T;
}

export const api = {
  get: <T>(endpoint: string, params?: Record<string, string>) =>
    apiFetch<T>(endpoint, { method: "GET", params }),

  post: <T>(endpoint: string, body?: unknown) =>
    apiFetch<T>(endpoint, { method: "POST", body: JSON.stringify(body) }),

  put: <T>(endpoint: string, body?: unknown) =>
    apiFetch<T>(endpoint, { method: "PUT", body: JSON.stringify(body) }),

  delete: <T>(endpoint: string) => apiFetch<T>(endpoint, { method: "DELETE" }),
};
