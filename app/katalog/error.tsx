"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { useEffect } from "react";
import SiteLayout from "@/components/site-layout";
import CatalogHeader from "./_components/catalog-header";

export default function CatalogError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("Gagal memuat katalog kaligrafi", error);
  }, [error]);

  return (
    <SiteLayout>
      <CatalogHeader />
      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-red-100 bg-red-50/40 px-6 py-14 text-center">
            <span className="mb-5 inline-flex size-14 items-center justify-center rounded-2xl bg-white text-red-500 shadow-sm">
              <AlertTriangle aria-hidden="true" className="size-6" />
            </span>
            <h2 className="text-xl font-bold text-neutral-900">
              Katalog belum dapat dimuat
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-neutral-600">
              Terjadi kendala saat mengambil data karya. Silakan coba kembali
              dalam beberapa saat.
            </p>
            <button
              type="button"
              onClick={unstable_retry}
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-(--color-maroon-900) px-5 text-sm font-bold text-white transition-colors hover:bg-(--color-maroon-700) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-maroon-500) focus-visible:ring-offset-2"
            >
              <RefreshCw aria-hidden="true" className="size-4" />
              Coba Lagi
            </button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
