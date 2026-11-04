import { supabase } from "./supabase";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
if (!API_URL) throw new Error("Missing EXPO_PUBLIC_API_URL in .env");

export type ApiResult<T> =
  | { ok: true; status: number; data: T }
  | {
      ok: false;
      status: number; // 0 means the request never reached the server
      error: string;
      fields?: Record<string, string[]>;
      body?: Record<string, unknown> | null;
    };

type Options = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  form?: FormData; // for file uploads (multipart)
  idempotencyKey?: string;
};

export async function apiFetch<T = unknown>(path: string, options: Options = {}): Promise<ApiResult<T>> {
  const method = options.method ?? "GET";

  const attempt = async () => {
    const { data } = await supabase.auth.getSession();
    const headers: Record<string, string> = {};
    if (!options.form) headers["Content-Type"] = "application/json";
    if (data.session) headers.Authorization = `Bearer ${data.session.access_token}`;
    if (options.idempotencyKey) headers["Idempotency-Key"] = options.idempotencyKey;

    return fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: options.form ?? (options.body !== undefined ? JSON.stringify(options.body) : undefined),
    });
  };

  try {
    let res = await attempt();

    // Token expired: refresh once and retry
    if (res.status === 401) {
      const { error } = await supabase.auth.refreshSession();
      if (!error) res = await attempt();
    }

    const json = await res.json().catch(() => null);

    if (res.ok) return { ok: true, status: res.status, data: json as T };

    return {
      ok: false,
      status: res.status,
      error: json?.error ?? "request_failed",
      fields: json?.fields,
      body: json,
    };
    } catch (e) {
    console.warn("[api] request failed:", path, e);
    return { ok: false, status: 0, error: "network_error" };
  }
}