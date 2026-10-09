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

export function archiveParams(input: ArchiveFilters = {}) {
  const page = Number.isFinite(input.page) ? Math.max(1, Math.floor(input.page!)) : 1;
  return {
    page,
    pageSize: input.pageSize === 5 ? 5 : ARCHIVE_PAGE_SIZE,
    search: (input.search ?? "").trim().toLocaleLowerCase("id").slice(0, 200),
    category: input.category || "all",
    year: input.year || "all",
    field: input.field || "all",
    status: input.status || "all",
    types: (input.types ?? ["article", "event"]).filter((t) => ["article", "event"].includes(t)),
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
