"use client";

import Link from "next/link";

export default function BackSection() {
  return (
    <section className="py-10 bg-white border-t border-neutral-100">
      <div className="max-w-6xl mx-auto px-4 md:px-8 text-center">
        <Link
          href="/tentang"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[13px] font-semibold no-underline transition-all duration-300 border-2"
          style={{ borderColor: "#0d2a1a", color: "#0d2a1a", background: "transparent" }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "#0d2a1a";
            el.style.color = "white";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "transparent";
            el.style.color = "#0d2a1a";
          }}
        >
          ← Kembali ke Tentang Kami
        </Link>
      </div>
    </section>
  );
}
