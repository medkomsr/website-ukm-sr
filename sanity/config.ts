import { apiVersion, dataset, projectId } from "@/sanity/env";

export const sanityConfig = {
  projectId,
  dataset,
  apiVersion,
  // Next caches the results; use the origin to avoid recaching stale CDN data after a webhook.
  useCdn: false,
};
