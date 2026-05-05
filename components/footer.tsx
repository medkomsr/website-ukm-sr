"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Beranda", path: "/" },
  { label: "Tentang", path: "/tentang" },
  { label: "Aktivitas", path: "/aktivitas" },
  { label: "Prestasi", path: "/prestasi" },
  { label: "Galeri", path: "/galeri" },
  { label: "Kontak", path: "/kontak" },
];

function IconInstagram({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}
function IconYoutube({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
    </svg>
  );
}
function IconFacebook({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}

const socials = [
  { Icon: IconInstagram, href: "#" },
  { Icon: IconYoutube, href: "#" },
  { Icon: IconFacebook, href: "#" },
];

const contactInfo = [
  { icon: MapPin, text: "Jl. MT. Haryono No.161, Ketawanggede, Kec. Lowokwaru, Kota Malang, Jawa Timur 65145" },
  { icon: Phone, text: "+62 812-3456-7890" },
  { icon: Mail, text: "senireligi@ub.ac.id" },
];

export default function Footer() {
  return (
    <footer style={{ background: "var(--color-maroon-900)" }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <Image src="/logo-white.png" alt="UKM Seni Religi Logo" width={40} height={40} className="rounded-xl object-cover" />
              <div>
                <div className="text-[16px] text-white font-bold">Seni Religi</div>
                <div className="text-[10px] tracking-[0.15em] uppercase text-white/40">Universitas Brawijaya</div>
              </div>
            </div>
            <p className="text-[14px] text-white/50 leading-relaxed">
              Wadah pengembangan seni bernuansa keagamaan untuk mahasiswa yang kreatif dan inspiratif.
            </p>
            <div className="flex gap-2.5 mt-6">
              {socials.map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 text-white/50"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "var(--color-lime-500, #84cc16)";
                    (e.currentTarget as HTMLElement).style.color = "var(--color-maroon-900)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)";
                  }}
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div className="text-[12px] uppercase tracking-[0.2em] text-lime-400 mb-5 font-bold">Navigasi</div>
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className="text-[14px] text-white/50 no-underline hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="text-[12px] uppercase tracking-[0.2em] text-lime-400 mb-5 font-bold">Kontak</div>
            <div className="space-y-4">
              {contactInfo.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3 text-[14px] text-white/50">
                  <Icon size={15} className="mt-0.5 shrink-0 text-white/30" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <div className="text-[12px] uppercase tracking-[0.2em] text-lime-400 mb-5 font-bold">Info Terbaru</div>
            <p className="text-[14px] text-white/50 mb-4">
              Berlangganan untuk mendapatkan update kegiatan terbaru.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Email Anda"
                className="flex-1 rounded-xl text-[13px] text-white placeholder:text-white/30"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
              />
              <Button
                className="rounded-xl px-5 text-[13px] font-bold hover:brightness-110"
                style={{ background: "#84cc16", color: "var(--color-maroon-900)" }}
              >
                Kirim
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-3 text-[12px] text-white/30"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <span>© 2026 Seni Religi — Universitas Brawijaya. All rights reserved.</span>
          <div className="flex gap-5">
            <a href="#" className="text-white/30 hover:text-white/60 no-underline transition-colors">Kebijakan Privasi</a>
            <a href="#" className="text-white/30 hover:text-white/60 no-underline transition-colors">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
