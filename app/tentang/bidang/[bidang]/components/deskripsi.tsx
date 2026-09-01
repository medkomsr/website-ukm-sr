"use client";

import { useBidangBySlug } from "@/hooks/useBidang";
import { wivTentangDept } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function DeskripsiSection({ slug }: { slug: string }) {
  const { data, isLoading } = useBidangBySlug(slug);

  if (isLoading) return <section className="py-14 bg-white min-h-[200px]" />;
  if (!data) return notFound();

  return (
    <section className="py-14 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            {...wivTentangDept(0)}
            className="text-[16px] md:text-[18px] text-neutral-600 leading-relaxed"
          >
            {data.description}
          </motion.p>

          {slug === "khattil-quran" && (
            <motion.div {...wivTentangDept(0.12)} className="mt-8">
              <Link
                href="/katalog"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[14px] font-semibold no-underline transition-all duration-300 hover:brightness-110 active:scale-95"
                style={{ background: "var(--color-maroon-500)", color: "white" }}
              >
                Lihat Katalog Kaligrafi
                <ArrowRight size={15} />
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
