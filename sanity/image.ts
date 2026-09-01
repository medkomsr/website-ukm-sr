import createImageUrlBuilder, { type SanityImageSource } from "@sanity/image-url"
import { sanityConfig } from "./config"

const builder = createImageUrlBuilder({
  projectId: sanityConfig.projectId,
  dataset: sanityConfig.dataset,
})

export const urlFor = (source: SanityImageSource) =>
  builder.image(source).auto("format").fit("max")
