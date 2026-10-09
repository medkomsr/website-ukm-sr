export const ARCHIVE_PAGE_SIZE = 9;
export type ArchiveFilters = {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  year?: string;
  field?: string;
  status?: string;
  types?: string[];
};
export type ArchivePage<T> = { items: T[]; total: number; page: number; pages: number };

export function archiveParams(value: unknown = {}) {
  // Server Actions receive runtime data; TypeScript annotations do not validate requests.
  const input =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  const text = (value: unknown, fallback: string) =>
    typeof value === "string" ? value.slice(0, 200) || fallback : fallback;
  const page =
    typeof input.page === "number" && Number.isFinite(input.page)
      ? Math.max(1, Math.floor(input.page))
      : 1;
  return {
    page,
    pageSize: input.pageSize === 5 ? 5 : ARCHIVE_PAGE_SIZE,
    search: text(input.search, "").trim().toLocaleLowerCase("id"),
    category: text(input.category, "all"),
    year: text(input.year, "all"),
    field: text(input.field, "all"),
    status: text(input.status, "all"),
    types: Array.isArray(input.types)
      ? [...new Set(input.types.filter((t): t is string => t === "article" || t === "event"))]
      : ["article", "event"],
  };
}

// Fetch only one page; a deleted last-page record cannot strand visitors on an empty page.
export async function fetchArchivePage<T>(
  total: number,
  requestedPage: number,
  fetchItems: (start: number, end: number) => Promise<T[]>,
  pageSize = ARCHIVE_PAGE_SIZE,
): Promise<ArchivePage<T>> {
  const size = archiveParams({ pageSize }).pageSize;
  const pages = Math.max(1, Math.ceil(total / size));
  const page = Math.min(archiveParams({ page: requestedPage }).page, pages);
  const start = (page - 1) * size;
  return {
    total,
    page,
    pages,
    items: total ? await fetchItems(start, start + size) : [],
  };
}
