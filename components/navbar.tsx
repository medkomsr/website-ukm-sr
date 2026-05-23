"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ChevronRight, ChevronDown, LayoutGrid, Trophy } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type SubLink = { label: string; path: string; desc: string; icon: React.ElementType };
type NavLink = { label: string; path: string; submenu?: SubLink[] };

const navLinks: NavLink[] = [
  { label: "Beranda", path: "/" },
  { label: "Tentang", path: "/tentang" },
  {
    label: "Aktivitas", path: "/aktivitas",
    submenu: [
      { label: "Semua Aktivitas", path: "/aktivitas", desc: "Kegiatan, acara & artikel UKM SR", icon: LayoutGrid },
      { label: "Prestasi", path: "/prestasi", desc: "Rekam jejak pencapaian UKM SR", icon: Trophy },
    ],
  },
  { label: "Galeri", path: "/galeri" },
  { label: "Kontak", path: "/kontak" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
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
            const isActive =
              pathname === link.path ||
              (link.submenu?.some((s) => pathname === s.path) ?? false);

            if (link.submenu) {
              const isOpen = openDropdown === link.path;
              return (
                <div
                  key={link.path}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(link.path)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {/* Trigger button */}
                  <button
                    className="flex items-center gap-1 px-4 py-2 rounded-full text-[13px] transition-all duration-300 border-none cursor-pointer"
                    style={{
                      fontWeight: isActive ? 600 : 500,
                      background: isActive ? "#0d2a1a" : isOpen ? "rgba(13,42,26,0.07)" : "transparent",
                      color: isActive ? "white" : isOpen ? "#0d2a1a" : "#737373",
                    }}
                  >
                    {link.label}
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ display: "flex", lineHeight: 0 }}
                    >
                      <ChevronDown size={12} />
                    </motion.span>
                  </button>

                  {/* Dropdown panel */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97, transition: { duration: 0.14 } }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white rounded-2xl overflow-hidden z-50"
                        style={{
                          boxShadow: "0 24px 60px rgba(0,0,0,0.13), 0 4px 16px rgba(0,0,0,0.06)",
                          border: "1px solid rgba(0,0,0,0.06)",
                        }}
                      >
                        {/* Caret */}
                        <div
                          className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 rounded-[1px]"
                          style={{ background: "white", border: "1px solid rgba(0,0,0,0.06)", borderBottom: "none", borderRight: "none" }}
                        />

                        <div className="p-2">
                          {link.submenu.map((sub) => {
                            const SubIcon = sub.icon;
                            const subActive = pathname === sub.path;
                            return (
                              <Link
                                key={sub.path}
                                href={sub.path}
                                className="flex items-center gap-3 px-3 py-3 rounded-xl no-underline transition-all duration-200 group/item"
                                style={{ background: subActive ? "rgba(13,42,26,0.07)" : "transparent" }}
                                onMouseEnter={(e) => {
                                  if (!subActive)
                                    (e.currentTarget as HTMLElement).style.background = "rgba(13,42,26,0.05)";
                                }}
                                onMouseLeave={(e) => {
                                  if (!subActive)
                                    (e.currentTarget as HTMLElement).style.background = "transparent";
                                }}
                              >
                                <div
                                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
                                  style={{ background: subActive ? "#0d2a1a" : "rgba(13,42,26,0.08)" }}
                                >
                                  <SubIcon
                                    size={15}
                                    style={{ color: subActive ? "#F59E0B" : "#0d2a1a" }}
                                  />
                                </div>
                                <div>
                                  <p
                                    className="text-[13px] font-semibold leading-none mb-1"
                                    style={{ color: "#0d2a1a" }}
                                  >
                                    {sub.label}
                                  </p>
                                  <p className="text-[11px] text-neutral-400 leading-none">{sub.desc}</p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            // Regular link
            return (
              <Link
                key={link.path}
                href={link.path}
                className="relative px-4 py-2 rounded-full text-[13px] no-underline transition-all duration-300"
                style={{
                  fontWeight: isActive ? 600 : 500,
                  background: isActive ? "#0d2a1a" : "transparent",
                  color: isActive ? "white" : "#737373",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "rgba(13,42,26,0.07)";
                    el.style.color = "#0d2a1a";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
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

        </nav>

        {/* Mobile toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-neutral-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
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
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.path ||
                  (link.submenu?.some((s) => pathname === s.path) ?? false);

                if (link.submenu) {
                  const isExpanded = mobileExpanded === link.path;
                  return (
                    <div key={link.path}>
                      <button
                        onClick={() => setMobileExpanded(isExpanded ? null : link.path)}
                        className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl text-[14px] transition-colors text-left cursor-pointer border-none"
                        style={{
                          fontWeight: isActive ? 600 : 400,
                          background: isActive ? "#0d2a1a" : "transparent",
                          color: isActive ? "white" : "#525252",
                        }}
                      >
                        {link.label}
                        <motion.span
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          style={{ display: "flex", lineHeight: 0, color: isActive ? "rgba(255,255,255,0.6)" : "#a3a3a3" }}
                        >
                          <ChevronDown size={15} />
                        </motion.span>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22 }}
                            className="overflow-hidden"
                          >
                            <div className="ml-4 mt-1.5 mb-1 pl-4 space-y-1"
                              style={{ borderLeft: "2px solid rgba(13,42,26,0.1)" }}>
                              {link.submenu.map((sub) => {
                                const SubIcon = sub.icon;
                                const subActive = pathname === sub.path;
                                return (
                                  <Link
                                    key={sub.path}
                                    href={sub.path}
                                    onClick={() => { setMenuOpen(false); setMobileExpanded(null); }}
                                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] no-underline transition-all duration-200"
                                    style={{
                                      background: subActive ? "rgba(13,42,26,0.08)" : "transparent",
                                      color: subActive ? "#0d2a1a" : "#525252",
                                      fontWeight: subActive ? 600 : 400,
                                    }}
                                  >
                                    <SubIcon
                                      size={14}
                                      style={{ color: subActive ? "#0d2a1a" : "#a3a3a3" }}
                                    />
                                    <div>
                                      <p className="leading-none">{sub.label}</p>
                                      <p className="text-[11px] text-neutral-400 mt-0.5 leading-none">{sub.desc}</p>
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
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
                );
              })}

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
