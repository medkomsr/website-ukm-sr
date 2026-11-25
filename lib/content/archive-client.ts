import type { ArchiveFilters } from "./pagination";

export async function fetchArchive<T>(
  resource: "aktivitas" | "prestasi" | "bidang",
  input: ArchiveFilters | { view: "meta" | "home" } | { slug: string },
  signal?: AbortSignal,
): Promise<T> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) {
      const text = Array.isArray(value) ? value.join(",") : String(value);
      params.set(key, key === "slug" ? text : text.slice(0, 200));
    }
  }
  const response = await fetch(`/api/arsip/${resource}?${params}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
    signal,
  });
  if (!response.ok) {
    throw Object.assign(new Error(`Arsip gagal dimuat (HTTP ${response.status}).`), {
      status: response.status,
    });
  }
  return response.json();
}
