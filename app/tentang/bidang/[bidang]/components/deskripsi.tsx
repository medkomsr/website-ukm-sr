"use client";

import { BidangDetail } from "@/lib/bidang-data";
import { wivTentangDept } from "@/lib/utils";
import { motion } from "framer-motion";

export default function DeskripsiSection({ data }: { data: BidangDetail }) {
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
        </div>
      </div>
    </section>
  );
}
