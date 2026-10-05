"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useFaq } from "@/hooks/content/use-faq";
import s from "@/features/contact/components/contact.module.scss";

gsap.registerPlugin(useGSAP, ScrollTrigger);
const DEFAULT_FAQS = [
  {
    _id: "collaboration",
    pertanyaan: "Bagaimana cara mengajukan kerja sama?",
    jawaban:
      "Pilih keperluan Kerja sama, lalu ceritakan ide, nama instansi atau komunitas, dan rencana waktunya. Kirim request melalui formulir. Tim Seni Religi akan meninjau pesan dan menghubungi Anda melalui email yang dicantumkan.",
  },
  {
    _id: "media",
    pertanyaan: "Apa yang perlu disiapkan untuk media partner?",
    jawaban:
      "Sertakan nama dan gambaran acara, tanggal pelaksanaan, akun media sosial, serta bentuk publikasi yang diharapkan. Jika sudah ada proposal, Anda dapat menyertakan tautannya di pesan atau menambahkannya melalui tombol lampiran.",
  },
  {
    _id: "performance",
    pertanyaan: "Bisakah mengundang Seni Religi untuk tampil?",
    jawaban:
      "Anda dapat menyampaikan undangan melalui pilihan Undangan tampil. Jelaskan konsep acara, lokasi, tanggal, dan bidang yang ingin diundang agar tim dapat meninjau kebutuhan serta ketersediaannya.",
  },
];

export default function FAQSection() {
  const root = useRef<HTMLElement>(null);
  const { data } = useFaq();
  const faqs = data?.length ? data : DEFAULT_FAQS;
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-faq-reveal]", {
          y: 24,
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
        });
      });
      return () => media.revert();
    },
    { scope: root },
  );
  return (
    <section ref={root} className={s.faq} data-tone="cream" aria-labelledby="contact-faq-title">
      <div className={s.faqTitle} data-faq-reveal>
        <h2 id="contact-faq-title">FAQ</h2>
      </div>
      <Accordion type="single" collapsible className={s.accordion}>
        {faqs.map((faq, index) => (
          <AccordionItem key={faq._id} value={faq._id} className={s.faqItem} data-faq-reveal>
            <AccordionTrigger className={s.faqTrigger}>
              <span className={s.faqNumber}>0{index + 1}</span>
              <span>{faq.pertanyaan}</span>
            </AccordionTrigger>
            <AccordionContent className={s.faqAnswer}>{faq.jawaban}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
