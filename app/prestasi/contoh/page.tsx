import { redirect } from "next/navigation";

// Demo achievements are now managed in Sanity alongside the archive.
export default function PrestasiPreviewPage() {
  redirect("/prestasi");
}
