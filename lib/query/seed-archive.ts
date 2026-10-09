import type { QueryClient } from "@tanstack/react-query";
import type { ArchiveFilters, ArchivePage } from "@/lib/content/pagination";

/** The desktop first page also contains the first five mobile records. */
export function seedArchive<T>(
  client: QueryClient,
  resource: string,
  filters: ArchiveFilters,
  data: ArchivePage<T>,
) {
  client.setQueryData([resource, "page", filters], data);
  client.setQueryData([resource, "mobile", { ...filters, page: undefined }], {
    pages: [
      { ...data, items: data.items.slice(0, 5), pages: Math.max(1, Math.ceil(data.total / 5)) },
    ],
    pageParams: [1],
  });
}
