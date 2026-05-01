"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ChevronRight, Settings } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Beranda", path: "/" },
  { label: "Tentang", path: "/tentang" },
  { label: "Aktivitas", path: "/aktivitas" },
  { label: "Galeri", path: "/galeri" },
  { label: "Kontak", path: "/kontak" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isHome
          ? scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-sm border-b border-neutral-100"
            : "bg-white/70 backdrop-blur-md"
          : "bg-white border-b border-neutral-200 shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-[72px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <Image src="/logo.png" alt="UKM Seni Religi Logo" width={40} height={40} className="rounded-xl object-cover transition-all duration-300" />
          <div>
            <div className="text-[16px] tracking-tight font-bold transition-colors duration-300 text-(--color-maroon-800)">Seni Religi</div>
            <div className="text-[10px] tracking-[0.15em] uppercase text-neutral-400">UNIVERSITAS BRAWIJAYA</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {navLinks.map((link) => {
            const active = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className="relative px-4 py-2 rounded-full text-[13px] no-underline transition-all duration-300"
                style={{
                  fontWeight: active ? 600 : 500,
                  background: active ? "#0d2a1a" : "transparent",
                  color: active ? "white" : "#737373",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "rgba(13,42,26,0.07)";
                    el.style.color = "#0d2a1a";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "transparent";
                    el.style.color = "#737373";
                  }
                }}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/admin"
            className="ml-2 p-2.5 rounded-full text-[13px] no-underline transition-all duration-300 border border-neutral-200 text-neutral-600 hover:bg-neutral-100"
            title="Admin Panel"
          >
            <Settings size={18} />
          </Link>
        </nav>

        {/* Mobile toggle */}
        <Button variant="ghost" size="icon" className="lg:hidden text-neutral-700" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </Button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden bg-white border-t border-neutral-100 shadow-xl"
          >
            <div className="p-5 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3.5 rounded-xl text-[14px] no-underline transition-colors"
                  style={{
                    fontWeight: pathname === link.path ? 600 : 400,
                    background: pathname === link.path ? "#0d2a1a" : "transparent",
                    color: pathname === link.path ? "white" : "#525252",
                  }}
                >
                  {link.label}
                  <ChevronRight size={14} className="text-neutral-300" />
                </Link>
              ))}
              <Link
                href="/kontak"
                onClick={() => setMenuOpen(false)}
                className="block mt-3 px-4 py-3.5 rounded-xl text-[15px] no-underline font-bold text-center"
                style={{ background: "var(--color-maroon-500)", color: "white" }}
              >
                Hubungi Kami
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
