/** Preserve the one-hour content freshness used by all CMS hooks. */
export const CONTENT_STALE_TIME = 60 * 60 * 1000;

// During prerender the hydrated CMS snapshot is already authoritative. Using a numeric
// duration makes each TanStack observer read Date.now(), deferring the HTML to the browser.
export const CONTENT_OBSERVER_STALE_TIME =
  typeof window === "undefined" ? "static" : CONTENT_STALE_TIME;
