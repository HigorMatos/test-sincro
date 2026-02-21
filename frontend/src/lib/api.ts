import type { Category, Item, ItemRequest } from "@/lib/types";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") || "http://localhost:8080/api";

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      msg = body?.message || body?.error || msg;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const categoriesApi = {
  list: () => http<Category[]>("/categories"),
};

export const itemsApi = {
  list: (categoriaId?: number | null) => {
    const qs = categoriaId ? `?categoriaId=${categoriaId}` : "";
    return http<Item[]>(`/items${qs}`);
  },
  get: (id: number) => http<Item>(`/items/${id}`),
  create: (payload: ItemRequest) =>
    http<Item>("/items", { method: "POST", body: JSON.stringify(payload) }),
  update: (id: number, payload: ItemRequest) =>
    http<Item>(`/items/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id: number) => http<void>(`/items/${id}`, { method: "DELETE" }),
};