"use client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { MapPin, Phone, Mail, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useSiteSettings } from "@/hooks/useSiteSettings";

function IconInstagram({ size = 16, style }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
function IconYoutube({ size = 16, style }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
    </svg>
  );
}
function IconFacebook({ size = 16, style }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}


export default function MainContactSection() {
  const [form, setForm] = useState({ nama: "", email: "", subjek: "", pesan: "" });
  const [submitted, setSubmitted] = useState(false);
  
  const { data: siteSettings, isLoading: isLoadingSiteSettings, error: errorSiteSettings } = useSiteSettings();
  
  const contactInfo = [
    { icon: MapPin, label: "Alamat", value: siteSettings?.alamat ?? "Jl. MT. Haryono No.161, Kota Malang, Jawa Timur 65145" },
    { icon: Phone, label: "Telepon", value: siteSettings?.telepon ?? "+62 812-3456-7890" },
    { icon: Mail, label: "Email", value: siteSettings?.email ?? "senireligi@ub.ac.id" },
  ];

  const socials = [
    { icon: IconInstagram, label: "Instagram", handle: siteSettings?.instagram ?? "@senireligi_ub", href: siteSettings?.instagramUrl ?? "#" },
    { icon: IconYoutube, label: "YouTube", handle: siteSettings?.youtube ?? "Seni Religi Universitas Brawijaya", href: siteSettings?.youtubeUrl ?? "#" },
    { icon: IconFacebook, label: "Facebook", handle: siteSettings?.facebook ?? "Seni Religi Universitas Brawijaya", href: siteSettings?.facebookUrl ?? "#" },
  ];
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="py-10 md:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="lg:col-span-7">
            <Card className="rounded-2xl border-neutral-200 p-6 md:p-8 shadow-none">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-[18px] font-bold text-(--color-neutral-1000)">Kirim Pesan</CardTitle>
                <CardDescription className="text-sm text-neutral-400">Kami akan merespons dalam 1×24 jam kerja</CardDescription>
              </CardHeader>

              <CardContent className="p-0">
                {submitted ? (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-50 flex items-center justify-center">
                      <CheckCircle size={32} className="text-emerald-500" />
                    </div>
                    <h3 className="text-[18px] font-bold text-(--color-neutral-1000) mb-2">Pesan Terkirim!</h3>
                    <p className="text-[14px] text-neutral-500 mb-6 max-w-sm mx-auto">
                      Terima kasih telah menghubungi kami. Tim kami akan segera merespons pesan Anda melalui email.
                    </p>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setSubmitted(false);
                        setForm({ nama: "", email: "", subjek: "", pesan: "" });
                      }}
                    >
                      Kirim Pesan Lain
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[12px] text-neutral-500 font-medium">Nama Lengkap *</Label>
                        <Input
                          required
                          type="text"
                          value={form.nama}
                          onChange={(e) => setForm({ ...form, nama: e.target.value })}
                          placeholder="Masukkan nama lengkap"
                          className="rounded-lg bg-neutral-50 h-10 text-sm px-3"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[12px] text-neutral-500 font-medium">Email *</Label>
                        <Input
                          required
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="email@example.com"
                          className="rounded-lg bg-neutral-50 h-10 text-s px-3"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[12px] text-neutral-500 font-medium">Subjek</Label>
                      <Input
                        type="text"
                        value={form.subjek}
                        onChange={(e) => setForm({ ...form, subjek: e.target.value })}
                        placeholder="Tentang apa pesan Anda?"
                        className="rounded-lg bg-neutral-50 h-10 text-sm px-3"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[12px] text-neutral-500 font-medium">Pesan *</Label>
                      <Textarea
                        required
                        value={form.pesan}
                        onChange={(e) => setForm({ ...form, pesan: e.target.value })}
                        placeholder="Ceritakan motivasi Anda..."
                        rows={5}
                        className="rounded-lg bg-neutral-50 text-sm resize-none px-3"
                      />
                    </div>
                    <Button type="submit" className="w-full h-12 text-[14px] font-bold rounded-xl">
                      Kirim Pesan
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Contact info */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h3 className="text-[15px] font-bold text-(--color-neutral-1000) mb-5">Informasi Kontak</h3>
              <div className="space-y-4">
                {contactInfo.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: "color-mix(in srgb, var(--color-maroon-500) 10%, transparent)" }}
                    >
                      <Icon size={15} style={{ color: "var(--color-maroon-500)" }} />
                    </div>
                    <div>
                      <div className="text-[11px] text-neutral-400 uppercase tracking-wide">{label}</div>
                      <div className="text-sm text-neutral-700 mt-0.5">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social media */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h3 className="text-[15px] font-bold text-(--color-neutral-1000) mb-5">Media Sosial</h3>
              <div className="space-y-3">
                {socials.map(({ icon: Icon, label, handle, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="flex items-center gap-3 p-3 rounded-xl no-underline transition-colors hover:bg-neutral-50 group"
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200"
                      style={{ background: "color-mix(in srgb, var(--color-maroon-500) 8%, transparent)" }}
                    >
                      <Icon size={16} style={{ color: "var(--color-maroon-500)" }} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-(--color-neutral-1000)">{label}</div>
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
  );
}
