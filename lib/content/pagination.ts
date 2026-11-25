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
  // Both server renders and public GET requests go through the same normalization.
  const input =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  const text = (value: unknown, fallback: string) =>
    typeof value === "string" ? value.slice(0, 200) || fallback : fallback;
  const page =
    typeof input.page === "number" && Number.isSafeInteger(Math.floor(input.page))
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

export function archiveFiltersFromUrl(params: URLSearchParams) {
  return archiveParams({
    page: Number(params.get("page")),
    pageSize: Number(params.get("pageSize")),
    search: params.get("search"),
    category: params.get("category"),
    year: params.get("year"),
    field: params.get("field"),
    status: params.get("status"),
    // Missing means all types. An explicitly empty selection must match zero items.
    types: params.get("types")?.split(","),
  });
}

export function isInitialArchivePage(params: ReturnType<typeof archiveParams>) {
  return (
    params.page === 1 &&
    !params.search &&
    params.category === "all" &&
    params.year === "all" &&
    params.field === "all" &&
    params.status === "all" &&
    params.types.length === 2
  );
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
