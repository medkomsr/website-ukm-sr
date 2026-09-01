"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CatalogHeader() {
  return (
    <section
      className="relative overflow-hidden border-b border-neutral-200 pt-12 pb-14"
      style={{
        background:
          "linear-gradient(135deg, #fcfbe6 0%, #f6f1c8 50%, #f0eaa8 100%)",
      }}
      aria-labelledby="catalog-title"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-[12px] text-neutral-400"
        >
          <Link
            href="/"
            className="text-neutral-400 no-underline transition-colors hover:text-(--color-maroon-500)"
          >
            Beranda
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-neutral-600">
            Katalog Kaligrafi
          </span>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1
            id="catalog-title"
            className="mb-3 text-[32px] text-(--color-neutral-1000) md:text-[42px]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
          >
            Katalog Kaligrafi
          </h1>
          <p className="max-w-xl text-[16px] leading-relaxed text-neutral-500">
            Koleksi karya kaligrafi pilihan dari anggota UKM Seni Religi.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
