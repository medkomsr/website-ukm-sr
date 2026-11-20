import { HydrationBoundary } from "@tanstack/react-query";
import { getContentState, type ContentPage } from "@/lib/query/content-state";

export default async function ContentData({
  page,
  slug,
  children,
}: {
  page: ContentPage;
  slug?: string;
  children: React.ReactNode;
}) {
  // Failed requests are not cached. Existing client error/retry controls remain available.
  const state = await getContentState(page, slug).catch(() => undefined);
  return <HydrationBoundary state={state}>{children}</HydrationBoundary>;
}
