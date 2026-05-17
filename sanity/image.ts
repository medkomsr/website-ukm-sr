import createImageUrlBuilder from "@sanity/image-url"
import { projectId, dataset } from "./env"

const builder = createImageUrlBuilder({ projectId, dataset })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const urlFor = (source: any) =>
  builder.image(source).auto("format").fit("max")
