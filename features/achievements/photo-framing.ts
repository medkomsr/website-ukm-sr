import type { SanityPrestasi } from "@/sanity/types";

// Match the asset as well as the entry so a replacement photo gets its own framing.
export function getAchievementPhotoFraming({
  _id,
  imageUrl,
}: Pick<SanityPrestasi, "_id" | "imageUrl">) {
  if (
    _id === "prestasi-2026-gbqn-ub-msq" &&
    imageUrl?.endsWith("/f9f2545dc0d9b87dcdc65271abc1d5aa7d39d288-2268x4032.jpg")
  )
    return "gbqn-group";

  if (
    _id === "prestasi-2026-mufi-mtq" &&
    imageUrl?.endsWith("/caa9a0564c9325f7c269688827ac87b7b2b9ca4f-1080x1350.jpg")
  )
    return "mufi-poster";
}
