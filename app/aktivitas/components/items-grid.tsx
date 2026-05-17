"use client";

import ActivityCard from "@/app/aktivitas/components/activity-card";
import type { SanityActivity } from "@/sanity/types";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Filter, Search } from "lucide-react";
import { useMemo, useState } from "react";

const ITEMS_PER_PAGE = 9;

const categories = ["Festival", "Workshop", "Lomba", "Rutin", "Pengumuman", "Liputan", "Prestasi"];

export default function ItemsGridSection({ items }: { items: SanityActivity[] }) {
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = [...items];
    if (typeFilter !== "all") list = list.filter((a) => a.type === typeFilter);
    if (categoryFilter !== "all") list = list.filter((a) => a.category === categoryFilter);
    if (statusFilter !== "all") list = list.filter((a) => a.type === "event" && a.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((a) => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));
    }
    return list;
  }, [typeFilter, categoryFilter, statusFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const curPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((curPage - 1) * ITEMS_PER_PAGE, curPage * ITEMS_PER_PAGE);

  const reset = () => {
    setTypeFilter("all");
    setCategoryFilter("all");
    setStatusFilter("all");
    setSearch("");
    setPage(1);
  };

  const hasFilters = typeFilter !== "all" || categoryFilter !== "all" || statusFilter !== "all" || search;

  return (
    <>
      {/* Filter bar */}
      <section className="bg-white border-b border-neutral-100 sticky top-[72px] z-30">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Type tabs */}
            <div className="flex items-center gap-1 bg-neutral-100 rounded-xl p-1">
              {[
                { label: "Semua", value: "all" },
                { label: "Kegiatan", value: "event" },
                { label: "Artikel", value: "article" },
              ].map((t) => (
                <button
                  key={t.value}
                  onClick={() => {
                    setTypeFilter(t.value);
                    setPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg text-[13px] cursor-pointer transition-all duration-200 border-none ${typeFilter === t.value ? "bg-white text-(--color-neutral-1000) shadow-sm" : "bg-transparent text-neutral-500 hover:text-(--color-maroon-500) hover:bg-white"}`}
                  style={{ fontWeight: typeFilter === t.value ? 600 : 400 }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300" />
              <input
                type="text"
                placeholder="Cari kegiatan atau artikel..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-neutral-100 border-none text-[13px] text-neutral-700 placeholder-neutral-400 focus:outline-none focus:ring-2 transition-all"
                style={{ "--tw-ring-color": "color-mix(in srgb, var(--color-maroon-500) 20%, transparent)" } as React.CSSProperties}
              />
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] cursor-pointer border transition-all duration-200 bg-white ${showFilters ? "border-(--color-maroon-200) text-(--color-maroon-500)" : "border-neutral-200 text-neutral-500 hover:border-(--color-maroon-300) hover:text-(--color-maroon-500)"}`}
              style={{ fontWeight: 500 }}
            >
              <Filter size={14} />
              Filter
            </button>
          </div>

          {/* Expanded filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-3 flex flex-wrap items-center gap-2 overflow-hidden"
              >
                {/* Category filters */}
                <button
                  onClick={() => {
                    setCategoryFilter("all");
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[12px] cursor-pointer border transition-all duration-200 ${categoryFilter === "all" ? "border-(--color-maroon-500) bg-(--color-maroon-500) text-white" : "border-neutral-200 bg-white text-neutral-500 hover:border-(--color-maroon-300) hover:text-(--color-maroon-500)"}`}
                  style={{ fontWeight: 500 }}
                >
                  Semua Kategori
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategoryFilter(categoryFilter === cat ? "all" : cat);
                      setPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[12px] cursor-pointer border transition-all duration-200 ${categoryFilter === cat ? "border-(--color-maroon-500) bg-(--color-maroon-500) text-white" : "border-neutral-200 bg-white text-neutral-500 hover:border-(--color-maroon-300) hover:text-(--color-maroon-500)"}`}
                    style={{ fontWeight: 500 }}
                  >
                    {cat}
                  </button>
                ))}

                {/* Status filters (events only) */}
                {(typeFilter === "all" || typeFilter === "event") && (
                  <>
                    <div className="w-px h-5 bg-neutral-200 mx-1 hidden sm:block" />
                    {[
                      { label: "Akan Datang", value: "upcoming" },
                      { label: "Berlangsung", value: "ongoing" },
                      { label: "Selesai", value: "completed" },
                    ].map((s) => (
                      <button
                        key={s.value}
                        onClick={() => {
                          setStatusFilter(statusFilter === s.value ? "all" : s.value);
                          setPage(1);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-[12px] cursor-pointer border transition-all duration-200 ${statusFilter === s.value ? "border-(--color-maroon-400) bg-[color-mix(in_srgb,var(--color-maroon-500)_10%,transparent)] text-(--color-maroon-500)" : "border-neutral-200 bg-white text-neutral-400 hover:border-neutral-300 hover:bg-neutral-50"}`}
                        style={{ fontWeight: 500 }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </>
                )}

                {hasFilters && (
                  <button
                    onClick={reset}
                    className="px-3 py-1.5 rounded-lg text-[12px] cursor-pointer border-none bg-transparent transition-colors"
                    style={{ fontWeight: 500, color: "var(--color-maroon-500)" }}
                  >
                    Reset Filter
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
      {/* Items grid */}
      <section className="py-10 md:py-14 min-h-[60vh]" style={{ background: "linear-gradient(135deg, #f9fdfb 0%, #f4faf7 50%, #eaf5ee 100%)" }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="mb-6 text-[13px] text-neutral-400">
            Menampilkan <span className="text-neutral-700 font-semibold">{filtered.length}</span> hasil
          </div>

          {pageItems.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-[16px] text-neutral-500 mb-2 font-semibold">Tidak ada hasil</div>
              <p className="text-[14px] text-neutral-400">Coba ubah filter atau kata kunci pencarian Anda.</p>
              <button
                onClick={reset}
                className="mt-4 px-5 py-2.5 rounded-full text-[13px] font-semibold cursor-pointer border-none transition-all duration-300"
                style={{ background: "var(--color-maroon-500)", color: "white" }}
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pageItems.map((item, i) => (
                <ActivityCard key={item._id} item={item} delay={i * 0.05} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, curPage - 1))}
                disabled={curPage === 1}
                className="w-9 h-9 rounded-lg flex items-center justify-center border border-neutral-200 bg-white text-neutral-500 disabled:opacity-40 hover:border-(--color-maroon-300) cursor-pointer transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-[13px] font-semibold cursor-pointer border transition-all ${p === curPage ? "border-(--color-maroon-500) bg-(--color-maroon-500) text-white" : "border-neutral-200 bg-white text-neutral-500 hover:border-(--color-maroon-300)"}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(totalPages, curPage + 1))}
                disabled={curPage === totalPages}
                className="w-9 h-9 rounded-lg flex items-center justify-center border border-neutral-200 bg-white text-neutral-500 disabled:opacity-40 hover:border-(--color-maroon-300) cursor-pointer transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
