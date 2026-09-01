import { apiVersion, dataset, projectId } from "./env"

export const sanityConfig = {
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
}
