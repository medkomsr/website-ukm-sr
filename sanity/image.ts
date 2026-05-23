import createImageUrlBuilder from "@sanity/image-url"

const builder = createImageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET as string,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const urlFor = (source: any) =>
  builder.image(source).auto("format").fit("max")
