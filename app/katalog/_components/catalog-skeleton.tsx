export default function CatalogSkeleton() {
  return (
    <section className="bg-white py-10 md:py-14" aria-label="Memuat katalog" aria-busy="true">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="mb-8 flex gap-2 overflow-hidden">
          {[88, 112, 96, 128].map((width) => (
            <div
              key={width}
              className="h-10 shrink-0 animate-pulse rounded-full bg-neutral-100"
              style={{ width }}
            />
          ))}
        </div>

        <div className="mb-5 h-4 w-48 animate-pulse rounded bg-neutral-100" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-neutral-100 bg-white"
            >
              <div className="aspect-[4/5] animate-pulse bg-neutral-100" />
              <div className="space-y-3 p-5">
                <div className="h-3 w-24 animate-pulse rounded bg-neutral-100" />
                <div className="h-5 w-3/4 animate-pulse rounded bg-neutral-100" />
                <div className="h-4 w-32 animate-pulse rounded bg-neutral-100" />
              </div>
            </div>
          ))}
        </div>
        <span className="sr-only">Katalog sedang dimuat.</span>
      </div>
    </section>
  );
}
