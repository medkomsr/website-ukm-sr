import { useMemo, useState } from "react";
import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { ArchiveFilters, ArchivePage } from "@/lib/content/pagination";
import { CONTENT_STALE_TIME } from "@/lib/query/constants";

/** Desktop navigates pages; mobile reveals five more records per request. */
export function useResponsiveArchive<T>(
  resource: string,
  fetchPage: (filters: ArchiveFilters) => Promise<ArchivePage<T>>,
  filters: ArchiveFilters,
  mobile: boolean,
) {
  const mobileFilters = { ...filters, page: undefined };
  const filterKey = JSON.stringify(mobileFilters);
  const [reveal, setReveal] = useState({ key: filterKey, batches: 1 });
  const batches = reveal.key === filterKey ? reveal.batches : 1;
  const desktop = useQuery({
    queryKey: [resource, "page", filters],
    queryFn: () => fetchPage(filters),
    placeholderData: keepPreviousData,
    staleTime: CONTENT_STALE_TIME,
    enabled: !mobile,
  });
  const incremental = useInfiniteQuery({
    queryKey: [resource, "mobile", mobileFilters],
    queryFn: ({ pageParam }) => fetchPage({ ...mobileFilters, page: pageParam, pageSize: 5 }),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < last.pages ? last.page + 1 : undefined),
    staleTime: CONTENT_STALE_TIME,
    enabled: mobile,
  });
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
