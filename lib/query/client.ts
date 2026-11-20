import { QueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { CONTENT_STALE_TIME } from "./constants";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Kapan perlu refresh data
        staleTime: 5 * 60 * 1000, // 5 minutes
        // Keep inactive content for its full freshness window when navigating back.
        gcTime: CONTENT_STALE_TIME,
        retry: (failureCount, error) => {
          if (
            error instanceof AxiosError &&
            error.status &&
            error.status >= 400 &&
            error.status < 500
          ) {
            return false;
          }
          return failureCount < 3;
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: {
        onError: () => {
          alert("Sebuah kesalahan terjadi");
        },
      },
    },
  });
}
