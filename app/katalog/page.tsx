import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ImageIcon } from "lucide-react";
import { Suspense } from "react";
import SiteLayout from "@/components/site-layout";
import {
  getKaligrafiCatalogMeta,
  getKaligrafiPage,
  KALIGRAFI_PAGE_SIZE,
} from "@/sanity/queries/kaligrafi";
import CatalogGrid from "./_components/catalog-grid";
import CatalogHeader from "./_components/catalog-header";
import CatalogPagination, {
  catalogHref,
} from "./_components/catalog-pagination";
import CatalogSkeleton from "./_components/catalog-skeleton";

type CatalogSearchParams = Promise<{
  page?: string | string[];
  category?: string | string[];
}>;

type CatalogPageProps = {
  searchParams: CatalogSearchParams;
};

export const metadata: Metadata = {
  title: "Katalog Kaligrafi | UKM Seni Religi UB",
  description:
    "Jelajahi koleksi karya kaligrafi pilihan UKM Seni Religi Universitas Brawijaya dan hubungi kami untuk informasi pemesanan.",
  alternates: {
    canonical: "/katalog",
  },
  openGraph: {
    title: "Katalog Kaligrafi | UKM Seni Religi UB",
    description:
      "Koleksi karya kaligrafi pilihan dari UKM Seni Religi Universitas Brawijaya.",
    type: "website",
  },
};

function parsePage(value: string | string[] | undefined) {
  if (value === undefined) {
    return 1;
  }

  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
    return null;
  }

  const page = Number(value);
  return Number.isSafeInteger(page) ? page : null;
}

function isCanonicalPageValue(value: string | string[] | undefined, page: number) {
  if (value === undefined) {
    return page === 1;
  }

  return typeof value === "string" && page > 1 && value === String(page);
}

async function CatalogContent({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  const requestedPage = parsePage(params.page);
  const meta = await getKaligrafiCatalogMeta();
  const requestedCategory =
    typeof params.category === "string" && params.category.length > 0
      ? params.category
      : undefined;
  const selectedCategory = requestedCategory
    ? meta.categories.find((category) => category.slug === requestedCategory)
    : undefined;

  if (params.category !== undefined && !selectedCategory) {
    redirect("/katalog");
  }

  if (requestedPage === null) {
    redirect(catalogHref(1, selectedCategory?.slug));
  }

  if (!isCanonicalPageValue(params.page, requestedPage)) {
    redirect(catalogHref(requestedPage, selectedCategory?.slug));
  }

  const result = await getKaligrafiPage(requestedPage, selectedCategory?.slug);
  const lastPage = Math.max(1, result.totalPages);

  if (requestedPage > lastPage) {
    redirect(catalogHref(lastPage, selectedCategory?.slug));
  }

  const currentPath = catalogHref(requestedPage, selectedCategory?.slug);
  const firstVisibleItem =
    result.total === 0 ? 0 : (requestedPage - 1) * KALIGRAFI_PAGE_SIZE + 1;
  const lastVisibleItem = Math.min(
    requestedPage * KALIGRAFI_PAGE_SIZE,
    result.total,
  );

  return (
    <section className="bg-white py-10 md:py-14" aria-labelledby="catalog-list-title">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <nav aria-label="Filter kategori kaligrafi" className="-mx-4 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
          <div className="flex min-w-max items-center gap-2">
            <Link
              href="/katalog"
              aria-current={!selectedCategory ? "page" : undefined}
              className={`rounded-full border px-4 py-2.5 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-maroon-500) focus-visible:ring-offset-2 ${
                !selectedCategory
                  ? "border-(--color-maroon-900) bg-(--color-maroon-900) text-white"
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-(--color-maroon-500)/40 hover:text-(--color-maroon-700)"
              }`}
            >
              Semua Karya
            </Link>
            {meta.categories.map((category) => {
              const isActive = selectedCategory?.slug === category.slug;

              return (
                <Link
                  key={category._id}
                  href={catalogHref(1, category.slug)}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-full border px-4 py-2.5 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-maroon-500) focus-visible:ring-offset-2 ${
                    isActive
                      ? "border-(--color-maroon-900) bg-(--color-maroon-900) text-white"
                      : "border-neutral-200 bg-white text-neutral-600 hover:border-(--color-maroon-500)/40 hover:text-(--color-maroon-700)"
                  }`}
                >
                  {category.name}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="mb-6 mt-5 flex flex-wrap items-end justify-between gap-3 border-b border-neutral-100 pb-5">
          <div>
            <h2 id="catalog-list-title" className="text-lg font-bold text-neutral-900">
              {selectedCategory ? selectedCategory.name : "Semua Karya"}
            </h2>
            <p className="mt-1 text-[13px] text-neutral-500" aria-live="polite">
              {result.total > 0
                ? `Menampilkan ${firstVisibleItem}–${lastVisibleItem} dari ${result.total} karya`
                : "Belum ada karya yang tersedia"}
            </p>
          </div>
          {result.total > KALIGRAFI_PAGE_SIZE && (
            <p className="text-xs font-medium text-neutral-400">
              Halaman {requestedPage} dari {result.totalPages}
            </p>
          )}
        </div>

        {result.items.length > 0 ? (
          <>
            <CatalogGrid
              items={result.items}
              whatsappNumber={meta.whatsappNumber}
              catalogPath={currentPath}
            />
            <CatalogPagination
              currentPage={requestedPage}
              totalPages={result.totalPages}
              categorySlug={selectedCategory?.slug}
            />
          </>
        ) : (
          <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-200 bg-neutral-50/70 px-6 py-14 text-center">
            <span className="mb-5 inline-flex size-14 items-center justify-center rounded-2xl bg-white text-neutral-400 shadow-sm">
              <ImageIcon aria-hidden="true" className="size-6" />
            </span>
            <h3 className="text-lg font-bold text-neutral-900">
              Belum ada karya di kategori ini
            </h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-500">
              Koleksi sedang kami siapkan. Silakan lihat semua karya yang tersedia
              atau kembali lagi nanti.
            </p>
            {selectedCategory && (
              <Link
                href="/katalog"
                className="mt-6 inline-flex min-h-10 items-center justify-center rounded-xl bg-(--color-maroon-900) px-5 text-sm font-bold text-white transition-colors hover:bg-(--color-maroon-700) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-maroon-500) focus-visible:ring-offset-2"
              >
                Lihat Semua Karya
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default function CatalogPage({ searchParams }: CatalogPageProps) {
  return (
    <SiteLayout>
      <CatalogHeader />
      <Suspense fallback={<CatalogSkeleton />}>
        <CatalogContent searchParams={searchParams} />
      </Suspense>
    </SiteLayout>
  );
}
