"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import type { SanityFaq } from "@/sanity/types";

const DEFAULT_FAQS: SanityFaq[] = [
  { _id: "1", pertanyaan: "Apakah harus memiliki pengalaman seni sebelumnya?", jawaban: "Tidak. Kami menerima semua mahasiswa yang berminat, baik pemula maupun yang sudah berpengalaman. Setiap divisi memiliki program pelatihan dari dasar." },
  { _id: "2", pertanyaan: "Di mana lokasi sekretariat UKM?", jawaban: "Sekretariat kami berada di Gedung PKM Lantai 2, Universitas Brawijaya. Silakan datang pada jam operasional untuk informasi lebih lanjut." },
  { _id: "3", pertanyaan: "Bagaimana jika saya ingin mengundang UKM untuk tampil di acara?", jawaban: "Silakan isi formulir kontak di halaman ini atau hubungi kami melalui WhatsApp. Tim kami akan merespons dalam 1×24 jam kerja." },
];

export default function FAQSection({ items }: { items: SanityFaq[] }) {
  const faqs = items.length > 0 ? items : DEFAULT_FAQS;

  return (
    <section className="py-12 md:py-16" style={{ background: "linear-gradient(135deg, #f9fdfb 0%, #f0f9f4 100%)" }}>
      <div className="max-w-3xl mx-auto px-4 md:px-8">
        <div className="text-center mb-10">
          <span className="inline-block text-[12px] font-bold tracking-[0.2em] uppercase mb-3 text-lime-600">FAQ</span>
          <h2 className="text-[24px] md:text-[32px] font-bold text-(--color-neutral-1000)" style={{ fontFamily: "var(--font-display)" }}>
            Pertanyaan yang Sering Diajukan
          </h2>
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <AccordionItem value={`faq-${faq._id}`} className="bg-white rounded-2xl border border-neutral-100 px-5 not-last:border-b-0">
                <AccordionTrigger className="text-[14px] font-semibold text-(--color-neutral-1000) hover:no-underline py-4">{faq.pertanyaan}</AccordionTrigger>
                <AccordionContent className="text-[14px] text-neutral-600 leading-relaxed">{faq.jawaban}</AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
