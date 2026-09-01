import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CatalogPaginationProps = {
  currentPage: number;
  totalPages: number;
  categorySlug?: string;
};

function catalogHref(page: number, categorySlug?: string) {
  const params = new URLSearchParams();

  if (categorySlug) {
    params.set("category", categorySlug);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();
  return query ? `/katalog?${query}` : "/katalog";
}

function paginationItems(currentPage: number, totalPages: number) {
  const visiblePages = new Set([
    1,
    totalPages,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ]);
  const pages = [...visiblePages]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);
  const items: Array<number | "ellipsis"> = [];

  pages.forEach((page, index) => {
    const previousPage = pages[index - 1];
    if (previousPage && page - previousPage > 1) {
      items.push("ellipsis");
    }
    items.push(page);
  });

  return items;
}

export default function CatalogPagination({
  currentPage,
  totalPages,
  categorySlug,
}: CatalogPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const items = paginationItems(currentPage, totalPages);
  const linkClassName =
    "inline-flex size-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-sm font-semibold text-neutral-600 transition-colors hover:border-(--color-maroon-500) hover:text-(--color-maroon-700) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-maroon-500) focus-visible:ring-offset-2";

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Navigasi halaman katalog">
      {currentPage > 1 ? (
        <Link
          href={catalogHref(currentPage - 1, categorySlug)}
          aria-label="Ke halaman sebelumnya"
          className={linkClassName}
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
        </Link>
      ) : (
        <span
          aria-hidden="true"
          className="inline-flex size-10 items-center justify-center rounded-xl border border-neutral-100 bg-neutral-50 text-neutral-300"
        >
          <ChevronLeft className="size-4" />
        </span>
      )}

      {items.map((item, index) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            aria-hidden="true"
            className="inline-flex size-8 items-center justify-center text-sm text-neutral-400"
          >
            …
          </span>
        ) : item === currentPage ? (
          <span
            key={item}
            aria-current="page"
            aria-label={`Halaman ${item}`}
            className="inline-flex size-10 items-center justify-center rounded-xl bg-(--color-maroon-900) text-sm font-bold text-white shadow-sm"
          >
            {item}
          </span>
        ) : (
          <Link
            key={item}
            href={catalogHref(item, categorySlug)}
            aria-label={`Ke halaman ${item}`}
            className={linkClassName}
          >
            {item}
          </Link>
        ),
      )}

      {currentPage < totalPages ? (
        <Link
          href={catalogHref(currentPage + 1, categorySlug)}
          aria-label="Ke halaman berikutnya"
          className={linkClassName}
        >
          <ChevronRight aria-hidden="true" className="size-4" />
        </Link>
      ) : (
        <span
          aria-hidden="true"
          className="inline-flex size-10 items-center justify-center rounded-xl border border-neutral-100 bg-neutral-50 text-neutral-300"
        >
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}

export { catalogHref };
