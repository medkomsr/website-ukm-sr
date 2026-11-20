import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { client } from "../client";
import { activityIdentity, achievementIdentity, listOf } from "../read-validation";

/** Cache only small identity records; full content remains paginated on the server.
 * Count and slice must share this index, otherwise rejected CMS records create empty pages.
 */
export async function getValidArchiveIds(kind: "aktivitas" | "prestasi") {
  "use cache";
  cacheLife("hours");
  cacheTag(kind);
  if (kind === "aktivitas") {
    const records = await client.fetch(`*[_type == "beritaAcara"]{
      _id, "slug": slug.current, "type": select(jenis == "acara" => "event", "article"), title
    }`);
    return listOf(activityIdentity, Infinity)
      .parse(records)
      .map((item) => item._id);
  }
  const records = await client.fetch(`*[_type == "prestasi"]{_id, title, year, category, level}`);
  return listOf(achievementIdentity, Infinity)
    .parse(records)
    .map((item) => item._id);
}
