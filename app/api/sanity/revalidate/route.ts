import { revalidateTag } from "next/cache";
import { createRevalidateHandler } from "@/lib/content/revalidate-handler";

export const POST = createRevalidateHandler(
  (tag) => revalidateTag(tag, { expire: 0 }),
  () => process.env.SANITY_REVALIDATE_SECRET,
);
