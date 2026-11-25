import { archiveFiltersFromUrl } from "@/lib/content/pagination";
import { isSafeSlug } from "@/sanity/read-validation";
import {
  getAktivitasBySlug,
  getAktivitasMeta,
  getAktivitasPage,
  getBerandaAktivitas,
} from "@/sanity/queries/aktivitas";
import { getBerandaPrestasi, getPrestasiMeta, getPrestasiPage } from "@/sanity/queries/prestasi";
import { getBidangBySlug } from "@/sanity/queries/bidang";

export async function GET(request: Request, context: { params: Promise<{ resource: string }> }) {
  const { resource } = await context.params;
  const url = new URL(request.url);
  const query = url.searchParams;
  if (resource !== "aktivitas" && resource !== "prestasi" && resource !== "bidang") {
    return Response.json({ error: "Arsip tidak ditemukan." }, { status: 404 });
  }
  if (url.search.length > 4096) {
    return Response.json({ error: "Parameter arsip terlalu panjang." }, { status: 400 });
  }
  const view = query.get("view") ?? "page";
  const slug = query.get("slug");
  try {
    if (resource === "bidang" || slug !== null) {
      if (resource === "prestasi" || view !== "page" || !isSafeSlug(slug)) {
        return Response.json({ error: "Slug tidak valid." }, { status: 400 });
      }
      return Response.json(
        resource === "bidang" ? await getBidangBySlug(slug) : await getAktivitasBySlug(slug),
      );
    }
    if (view === "home") {
      return Response.json(
        resource === "aktivitas" ? await getBerandaAktivitas() : await getBerandaPrestasi(),
      );
    }
    if (view === "meta") {
      return Response.json(
        resource === "aktivitas" ? await getAktivitasMeta() : await getPrestasiMeta(),
      );
    }
    if (view !== "page") {
      return Response.json({ error: "Tampilan arsip tidak valid." }, { status: 400 });
    }
    const filters = archiveFiltersFromUrl(query);
    return Response.json(
      resource === "aktivitas" ? await getAktivitasPage(filters) : await getPrestasiPage(filters),
    );
  } catch (error) {
    console.error(`Gagal membaca arsip ${resource}`, error);
    return Response.json(
      { error: "Arsip belum dapat dimuat." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
