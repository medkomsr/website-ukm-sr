"use client";

import { useDepartemenBySlug } from "@/hooks/useDepartemen";
import { wivTentangDept } from "@/lib/utils";
import { motion } from "framer-motion";
import { notFound } from "next/navigation";

export default function DeskripsiSection({ dept }: { dept: string }) {
  const { data: departemen, isLoading, error } = useDepartemenBySlug(dept);

  if (!isLoading && !departemen) notFound();

  return (
    <section className="py-14 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p {...wivTentangDept(0)} className="text-[16px] md:text-[18px] text-neutral-600 leading-relaxed">
            {departemen?.description}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
