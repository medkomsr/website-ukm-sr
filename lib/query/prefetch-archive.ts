import type { QueryClient } from "@tanstack/react-query";
import type { ArchiveFilters, ArchivePage } from "../content/pagination";
import { CONTENT_STALE_TIME } from "./constants";

/** Warm just the next desktop page, keeping each filter combination isolated. */
export async function prefetchNextArchivePage<T>(
  client: QueryClient,
  resource: string,
  fetchPage: (filters: ArchiveFilters) => Promise<ArchivePage<T>>,
  filters: ArchiveFilters,
  current: ArchivePage<T>,
) {
  if (current.page !== (filters.page ?? 1) || current.page >= current.pages) return;
  const next = { ...filters, page: current.page + 1 };
  await client.prefetchQuery({
    queryKey: [resource, "page", next],
    queryFn: () => fetchPage(next),
    staleTime: CONTENT_STALE_TIME,
    retry: false,
  });
}
