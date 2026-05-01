"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, ChevronDown, ChevronUp, CheckCircle } from "lucide-react";

function IconInstagram({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}
function IconYoutube({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
    </svg>
  );
}
function IconFacebook({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}
import SiteLayout from "@/components/site-layout";

const faqs = [
  {
    q: "Apakah harus memiliki pengalaman seni sebelumnya?",
    a: "Tidak. Kami menerima semua mahasiswa yang berminat, baik pemula maupun yang sudah berpengalaman. Setiap divisi memiliki program pelatihan dari dasar.",
  },
  {
    q: "Di mana lokasi sekretariat UKM?",
    a: "Sekretariat kami berada di Gedung PKM Lantai 2, Universitas Brawijaya. Silakan datang pada jam operasional untuk informasi lebih lanjut.",
  },
  {
    q: "Bagaimana jika saya ingin mengundang UKM untuk tampil di acara?",
    a: "Silakan isi formulir kontak di halaman ini atau hubungi kami melalui WhatsApp. Tim kami akan merespons dalam 1×24 jam kerja.",
  },
];

const socials = [
  { icon: IconInstagram, label: "Instagram", handle: "@senireligi_ub", href: "#" },
  { icon: IconYoutube, label: "YouTube", handle: "Seni Religi Universitas Brawijaya", href: "#" },
  { icon: IconFacebook, label: "Facebook", handle: "Seni Religi Universitas Brawijaya", href: "#" },
];

const contactInfo = [
  { icon: MapPin, label: "Alamat", value: "Jl. MT. Haryono No.161, Ketawanggede, Kec. Lowokwaru, Kota Malang, Jawa Timur 65145" },
  { icon: Phone, label: "Telepon", value: "+62 812-3456-7890" },
  { icon: Mail, label: "Email", value: "senireligi@ub.ac.id" },
];

export default function KontakPage() {
  const [form, setForm] = useState({ nama: "", email: "", subjek: "", pesan: "" });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <SiteLayout>
      {/* Header */}
      <section
        className="pt-12 pb-7 border-b border-neutral-200 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #fcfbe6 0%, #f6f1c8 50%, #f0eaa8 100%)" }}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 text-[12px] text-neutral-400 mb-6">
            <Link href="/" className="text-neutral-400 hover:text-[var(--color-maroon-500)] no-underline transition-colors">Beranda</Link>
            <span>/</span>
            <span className="text-neutral-600">Kontak</span>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-[32px] md:text-[42px] text-[var(--color-neutral-1000)] mb-3"
              style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
              Hubungi Kami
            </h1>
            <p className="text-[16px] text-neutral-500 max-w-xl leading-relaxed">
              Punya pertanyaan, saran, atau ingin berkolaborasi? Jangan ragu untuk menghubungi kami melalui salah satu kanal berikut.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main contact */}
      <section className="py-10 md:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
              className="lg:col-span-7">
              <div className="bg-white rounded-2xl border border-neutral-200 p-6 md:p-8">
                <div className="mb-6">
                  <h2 className="text-[18px] font-bold text-[var(--color-neutral-1000)]">Kirim Pesan</h2>
                  <p className="text-[13px] text-neutral-400">Kami akan merespons dalam 1×24 jam kerja</p>
                </div>

                {submitted ? (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-50 flex items-center justify-center">
                      <CheckCircle size={32} className="text-emerald-500" />
                    </div>
                    <h3 className="text-[18px] font-bold text-[var(--color-neutral-1000)] mb-2">Pesan Terkirim!</h3>
                    <p className="text-[14px] text-neutral-500 mb-6 max-w-sm mx-auto">
                      Terima kasih telah menghubungi kami. Tim kami akan segera merespons pesan Anda melalui email.
                    </p>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ nama: "", email: "", subjek: "", pesan: "" }); }}
                      className="px-5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer border-none transition-colors bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    >
                      Kirim Pesan Lain
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[12px] text-neutral-500 block mb-1.5 font-medium">Nama Lengkap *</label>
                        <input required type="text" value={form.nama}
                          onChange={(e) => setForm({ ...form, nama: e.target.value })}
                          placeholder="Masukkan nama lengkap"
                          className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-[13px] bg-neutral-50 focus:outline-none focus:ring-2 transition-all"
                          style={{ "--tw-ring-color": "color-mix(in srgb, var(--color-maroon-500) 20%, transparent)" } as React.CSSProperties}
                        />
                      </div>
                      <div>
                        <label className="text-[12px] text-neutral-500 block mb-1.5 font-medium">Email *</label>
                        <input required type="email" value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="email@example.com"
                          className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-[13px] bg-neutral-50 focus:outline-none focus:ring-2 transition-all"
                          style={{ "--tw-ring-color": "color-mix(in srgb, var(--color-maroon-500) 20%, transparent)" } as React.CSSProperties}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[12px] text-neutral-500 block mb-1.5 font-medium">Subjek</label>
                      <input type="text" value={form.subjek}
                        onChange={(e) => setForm({ ...form, subjek: e.target.value })}
                        placeholder="Tentang apa pesan Anda?"
                        className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-[13px] bg-neutral-50 focus:outline-none focus:ring-2 transition-all"
                        style={{ "--tw-ring-color": "color-mix(in srgb, var(--color-maroon-500) 20%, transparent)" } as React.CSSProperties}
                      />
                    </div>
                    <div>
                      <label className="text-[12px] text-neutral-500 block mb-1.5 font-medium">Pesan *</label>
                      <textarea required value={form.pesan}
                        onChange={(e) => setForm({ ...form, pesan: e.target.value })}
                        placeholder="Ceritakan motivasi Anda..."
                        rows={5}
                        className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-[13px] bg-neutral-50 focus:outline-none focus:ring-2 transition-all resize-none"
                        style={{ "--tw-ring-color": "color-mix(in srgb, var(--color-maroon-500) 20%, transparent)" } as React.CSSProperties}
                      />
                    </div>
                    <button type="submit"
                      className="w-full py-3.5 rounded-xl text-[14px] font-bold cursor-pointer border-none transition-all duration-300 hover:opacity-90"
                      style={{ background: "var(--color-maroon-500)", color: "white" }}>
                      Kirim Pesan
                    </button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-5 space-y-6">
              {/* Contact info */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                <h3 className="text-[15px] font-bold text-[var(--color-neutral-1000)] mb-5">Informasi Kontak</h3>
                <div className="space-y-4">
                  {contactInfo.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: "color-mix(in srgb, var(--color-maroon-500) 10%, transparent)" }}>
                        <Icon size={15} style={{ color: "var(--color-maroon-500)" }} />
                      </div>
                      <div>
                        <div className="text-[11px] text-neutral-400 uppercase tracking-wide">{label}</div>
                        <div className="text-[13px] text-neutral-700 mt-0.5">{value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social media */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                <h3 className="text-[15px] font-bold text-[var(--color-neutral-1000)] mb-5">Media Sosial</h3>
                <div className="space-y-3">
                  {socials.map(({ icon: Icon, label, handle, href }) => (
                    <a key={label} href={href}
                      className="flex items-center gap-3 p-3 rounded-xl no-underline transition-colors hover:bg-neutral-50 group"
                    >
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200"
                        style={{ background: "color-mix(in srgb, var(--color-maroon-500) 8%, transparent)" }}>
                        <Icon size={16} style={{ color: "var(--color-maroon-500)" }} />
                      </div>
                      <div>
                        <div className="text-[13px] font-semibold text-[var(--color-neutral-1000)]">{label}</div>
                        <div className="text-[12px] text-neutral-400">{handle}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 md:py-16" style={{ background: "linear-gradient(135deg, #f9fdfb 0%, #f0f9f4 100%)" }}>
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <div className="text-center mb-10">
            <span className="inline-block text-[12px] font-bold tracking-[0.2em] uppercase mb-3 text-lime-600">FAQ</span>
            <h2 className="text-[24px] md:text-[32px] font-bold text-[var(--color-neutral-1000)]"
              style={{ fontFamily: "var(--font-display)" }}>
              Pertanyaan yang Sering Diajukan
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-white rounded-2xl border border-neutral-100 overflow-hidden"
              >
                <button
                  className="w-full text-left flex items-center justify-between gap-4 px-5 py-4 cursor-pointer bg-transparent border-none"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-[14px] font-semibold text-[var(--color-neutral-1000)]">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp size={16} className="shrink-0 text-neutral-400" />
                  ) : (
                    <ChevronDown size={16} className="shrink-0 text-neutral-400" />
                  )}
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5">
                        <div className="w-full h-px bg-neutral-100 mb-4" />
                        <p className="text-[14px] text-neutral-600 leading-relaxed">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
