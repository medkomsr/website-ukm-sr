import { apiVersion, dataset, projectId } from "@/sanity/env";

export const sanityConfig = {
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
};
