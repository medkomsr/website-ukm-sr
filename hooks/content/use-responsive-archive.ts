import { useEffect, useMemo, useState } from "react";
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { ArchiveFilters, ArchivePage } from "@/lib/content/pagination";
import { CONTENT_OBSERVER_STALE_TIME } from "@/lib/query/constants";
import { prefetchNextArchivePage } from "@/lib/query/prefetch-archive";

/** Desktop navigates pages; mobile reveals five more records per request. */
export function useResponsiveArchive<T>(
  resource: string,
  fetchPage: (filters: ArchiveFilters, signal?: AbortSignal) => Promise<ArchivePage<T>>,
  filters: ArchiveFilters,
  mobile: boolean,
) {
  const client = useQueryClient();
  const mobileFilters = { ...filters, page: undefined };
  const filterKey = JSON.stringify(mobileFilters);
  const [reveal, setReveal] = useState({ key: filterKey, batches: 1 });
  const batches = reveal.key === filterKey ? reveal.batches : 1;
  const desktop = useQuery({
    queryKey: [resource, "page", filters],
    queryFn: ({ signal }) => fetchPage(filters, signal),
    placeholderData: keepPreviousData,
    staleTime: CONTENT_OBSERVER_STALE_TIME,
    enabled: !mobile,
  });
  const incremental = useInfiniteQuery({
    queryKey: [resource, "mobile", mobileFilters],
    queryFn: ({ pageParam, signal }) =>
      fetchPage({ ...mobileFilters, page: pageParam, pageSize: 5 }, signal),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < last.pages ? last.page + 1 : undefined),
    staleTime: CONTENT_OBSERVER_STALE_TIME,
    enabled: mobile,
  });
  useEffect(() => {
    if (mobile || desktop.isPlaceholderData || !desktop.isSuccess || !desktop.data) return;
    void prefetchNextArchivePage(client, resource, fetchPage, filters, desktop.data);
  }, [
    client,
    resource,
    fetchPage,
    filters,
    mobile,
    desktop.data,
    desktop.isPlaceholderData,
    desktop.isSuccess,
  ]);
  const data = useMemo(() => {
    if (!mobile) return desktop.data;
    const first = incremental.data?.pages[0];
    if (!first) return undefined;
    return { ...first, items: incremental.data!.pages.slice(0, batches).flatMap((p) => p.items) };
  }, [mobile, desktop.data, incremental.data, batches]);
  const query = mobile ? incremental : desktop;
  return {
    data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    isPlaceholderData: query.isPlaceholderData,
    isLoadMoreError: mobile && incremental.isFetchNextPageError,
    error: query.error,
    refetch: query.refetch,
    canExpand: !!data && data.items.length < data.total,
    canCollapse: mobile && batches > 1,
    collapse: () => setReveal({ key: filterKey, batches: 1 }),
    loadMore: async () => {
      if (incremental.isFetching) return;
      if (batches >= (incremental.data?.pages.length ?? 0)) {
        const result = await incremental.fetchNextPage();
        if (result.isError) return;
      }
      setReveal({ key: filterKey, batches: batches + 1 });
    },
  };
}
