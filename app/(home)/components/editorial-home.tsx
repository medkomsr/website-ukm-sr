"use client";

import { useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagnetBoard from "./magnet-board";
import { ArrowDown, ArrowRight, ArrowUpRight, Plus, Minus } from "lucide-react";
import { useBidang } from "@/hooks/useBidang";
import { useAktivitas } from "@/hooks/useAktivitas";
import { useGaleri } from "@/hooks/useGaleri";
import { BIDANG_DATA } from "@/lib/types/bidang-data";
import { IMAGES } from "@/lib/types/data";
import styles from "./editorial-home.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const element = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(element.current, {
          y: 45,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element.current,
            start: "top 94%",
            once: true,
          },
        });
      });
      return () => media.revert();
    },
    { scope: element },
  );
  return (
    <div ref={element} className={className}>
      {children}
    </div>
  );
}

function Rosette({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      data-scroll-rosette
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M50 3 62 21 83 17 79 38 97 50 79 62 83 83 62 79 50 97 38 79 17 83 21 62 3 50 21 38 17 17 38 21Z"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="m50 15 25 10 10 25-10 25-25 10-25-10-10-25 10-25Z"
        stroke="currentColor"
      />
      <circle cx="50" cy="50" r="23" stroke="currentColor" />
      <path
        d="M50 27v46M27 50h46M34 34l32 32m0-32L34 66"
        stroke="currentColor"
      />
    </svg>
  );
}

function ArchArtwork() {
  return (
    <div className={styles.artwork} data-hero-art>
      <div className={styles.artTop}>
        <span>SENI / RASA / MAKNA</span>
        <span>SR — UB</span>
      </div>
      <svg
        className={styles.archSvg}
        viewBox="0 0 480 535"
        fill="none"
        role="img"
        aria-label="Ilustrasi lengkung arsitektur dan ornamen geometris, simbol ruang tumbuh Seni Religi"
      >
        <defs>
          <linearGradient
            id="sr-arch-light"
            x1="95"
            y1="100"
            x2="390"
            y2="515"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#f3e8cc" />
            <stop offset="1" stopColor="#cebf9c" />
          </linearGradient>
          <linearGradient
            id="sr-arch-depth"
            x1="160"
            y1="190"
            x2="290"
            y2="490"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#335844" />
            <stop offset="1" stopColor="#152f27" />
          </linearGradient>
          <pattern
            id="sr-art-grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path d="M40 0H0V40" stroke="#224837" strokeOpacity=".07" />
          </pattern>
        </defs>
        <rect width="480" height="535" fill="#e5e7dc" />
        <rect width="480" height="535" fill="url(#sr-art-grid)" />
        <circle cx="378" cy="99" r="49" fill="#b9a26b" />
        <path
          data-orbit-path
          d="M378 38a61 61 0 1 1-.01 0"
          stroke="#b9a26b"
          strokeOpacity=".5"
        />
        <circle data-orbit-dot cx="378" cy="38" r="5" fill="#223e31" />
        <path
          d="M67 491V237C67 135 152 75 240 44c88 31 173 91 173 193v254"
          fill="url(#sr-arch-light)"
        />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path
            key={i}
            data-arch-line
            d={`M${82 + i * 12} 491V${239 + i * 3}C${82 + i * 12} ${148 + i * 8} ${159 + i * 4} ${92 + i * 13} 240 ${63 + i * 16}c${81 - i * 4} ${29 + i * 3} ${158 - i * 12} ${85 - i * 5} ${158 - i * 12} ${176 - i * 13}v${252 + i * 13}`}
            stroke="#9e8e69"
            strokeOpacity={0.3 + i * 0.06}
          />
        ))}
        <path
          d="M161 491V265c0-54 35-87 79-116 44 29 79 62 79 116v226Z"
          fill="url(#sr-arch-depth)"
        />
        <path
          d="M173 491V270c0-43 26-74 67-105 41 31 67 62 67 105v221"
          stroke="#a4ac85"
          strokeOpacity=".4"
        />
        <circle cx="240" cy="296" r="48" stroke="#c4ae76" strokeOpacity=".8" />
        <g transform="translate(190 246)" stroke="#c4ae76">
          <path d="M50 4 63 23 83 17 77 38 96 50 77 62 83 83 63 77 50 96 37 77 17 83 23 62 4 50 23 38 17 17 37 23Z" />
          <path d="m50 17 23 10 10 23-10 23-23 10-23-10-10-23 10-23Z" />
          <circle cx="50" cy="50" r="20" />
        </g>
        <path
          d="M240 345v147M215 349v143M265 349v143"
          stroke="#c4ae76"
          strokeOpacity=".2"
        />
        <path d="M47 491h386v14H47z" fill="#bbad8b" />
        <path d="M28 505h424v15H28z" fill="#cec2a5" />
        <path d="M9 520h462v15H9z" fill="#ded6be" />
        <path
          d="M25 158v43m-21-22h43M430 359v35m-17-18h35"
          stroke="#607563"
          strokeWidth="1"
        />
        <circle cx="46" cy="381" r="4" fill="#aa925b" />
      </svg>
      <div className={styles.artSeal}>
        <Rosette />
        <span>
          Berakar pada nilai.
          <br />
          <em>Bertumbuh lewat seni.</em>
        </span>
      </div>
      <div className={styles.artBottom}>
        <span>RUANG EKSPRESI, TANPA BATAS.</span>
        <span>01 / 08</span>
      </div>
    </div>
  );
}

const fallbackFields = Object.values(BIDANG_DATA).map((item) => ({
  slug: item.slug,
  fullName: item.fullName,
  description: item.description,
}));
const fieldNotes: Record<string, string> = {
  "banjari-nasyid": "Harmoni suara, irama, dan kebersamaan.",
  "khattil-quran": "Merangkai makna dalam setiap goresan.",
  "hifdzil-quran": "Menjaga ayat, merawat kedekatan.",
  "syarhil-quran": "Menyampaikan pesan dengan penuh penghayatan.",
  "fahmil-quran": "Memahami, mendalami, dan berbagi pengetahuan.",
  dia: "Bertukar gagasan dalam semangat keilmuan.",
  ktdaq: "Mempertemukan kreativitas dan gagasan Qur’ani.",
  ttq: "Menghidupkan keindahan dalam lantunan ayat.",
};

function FieldExplorer() {
  const { data } = useBidang();
  const fields = data?.length
    ? data.filter((item) => item.slug)
    : fallbackFields;
  const [active, setActive] = useState<string | null>("banjari-nasyid");
  return (
    <div className={styles.fieldList}>
      {fields.map((field, index) => {
        const expanded = active === field.slug;
        return (
          <div key={field.slug} className={styles.field} data-open={expanded}>
            <h3>
              <button
                aria-expanded={expanded}
                aria-controls={`field-${field.slug}`}
                onClick={() => setActive(expanded ? null : field.slug)}
              >
                <span className={styles.fieldNumber}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{field.fullName}</span>
                {expanded ? <Minus size={20} /> : <Plus size={20} />}
              </button>
            </h3>
            <div
              id={`field-${field.slug}`}
              hidden={!expanded}
              className={styles.fieldDetail}
            >
              <p>{field.description || fieldNotes[field.slug]}</p>
              <Link href={`/tentang/bidang/${field.slug}`}>
                Kenali bidang ini <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ActivityDate({ value }: { value: string }) {
  // The existing CMS accepts both ISO dates and editorial text such as "Setiap Sabtu".
  if (!/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(value)) return <span>{value}</span>;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return <span>{value}</span>;
  return (
    <time dateTime={value}>
      {date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Jakarta",
      })}
    </time>
  );
}

function Journal() {
  const { data, isLoading, isError } = useAktivitas();
  const entries = data?.filter((item) => item.slug).slice(0, 3) ?? [];
  return (
    <section className={styles.journal} aria-labelledby="journal-title">
      <div className={styles.sectionHeading}>
        <div>
          <span className={styles.eyebrow}>04 — CATATAN PERJALANAN</span>
          <h2 id="journal-title" data-split>
            Cerita yang <em>terus tumbuh.</em>
          </h2>
        </div>
        <Link className={styles.textLink} href="/aktivitas">
          Semua aktivitas <ArrowUpRight size={17} />
        </Link>
      </div>
      {entries.length ? (
        <div className={styles.journalGrid}>
          {entries.map((item) => (
            <Link
              className={styles.story}
              key={item._id}
              href={`/aktivitas/${item.slug}`}
            >
              <div className={styles.storyImage}>
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 700px) 90vw, 30vw"
                  />
                ) : (
                  <Rosette />
                )}
              </div>
              <div className={styles.storyMeta}>
                <span>
                  {item.category ||
                    (item.type === "event" ? "Kegiatan" : "Artikel")}
                </span>
                {item.date && <ActivityDate value={item.date} />}
              </div>
              <h3>
                {item.title}
                <ArrowUpRight size={20} />
              </h3>
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.journalEmpty} aria-live="polite">
          <Rosette />
          <div>
            <h3>
              {isLoading
                ? "Menyiapkan cerita untukmu…"
                : isError
                  ? "Cerita kami akan segera kembali."
                  : "Setiap pertemuan, awal sebuah cerita."}
            </h3>
            <p>
              {isError
                ? "Aktivitas belum dapat dimuat. Kamu tetap bisa mengenal bidang dan perjalanan Seni Religi."
                : "Temukan kabar kegiatan, ruang belajar, dan perjalanan berkarya keluarga Seni Religi."}
            </p>
            <Link
              className={styles.textLink}
              href={isError ? "/tentang" : "/aktivitas"}
            >
              {isError ? "Kenali Seni Religi" : "Jelajahi aktivitas"}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

function Gallery() {
  const { data } = useGaleri();
  const photos = data?.filter((item) => item.imageUrl).slice(0, 3) ?? [];
  const fallback = [
    {
      imageUrl: IMAGES.calligraphy,
      alt: "Ilustrasi seni kaligrafi",
      caption: "Keindahan dalam goresan",
      category: "SENI KALIGRAFI",
      href: "/katalog",
    },
    {
      imageUrl: IMAGES.quran,
      alt: "Ilustrasi Al-Qur’an",
      caption: "Dekat dengan setiap ayat",
      category: "SENI QUR’ANI",
      href: "/tentang/bidang/ttq",
    },
    {
      imageUrl: IMAGES.mosque,
      alt: "Ilustrasi arsitektur Islami",
      caption: "Ruang untuk menemukan makna",
      category: "RUANG INSPIRASI",
      href: "/tentang",
    },
  ];
  const items = photos.length
    ? photos.map((item) => ({ ...item, href: "/galeri" }))
    : fallback;
  return (
    <section className={styles.gallery} aria-labelledby="gallery-title">
      <div className={styles.sectionHeading}>
        <div>
          <span className={styles.eyebrow}>03 — RUANG KARYA</span>
          <h2 id="gallery-title" data-split>
            Jejak rasa. <br />
            <em>Wujud karya.</em>
          </h2>
        </div>
        <div className={styles.galleryIntro}>
          <p>
            Setiap karya menyimpan cerita.
            <br />
            Setiap proses meninggalkan makna.
          </p>
          <Link className={styles.textLink} href="/galeri">
            Jelajahi galeri <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
      <div className={styles.galleryGrid}>
        {items.map((item, index) => (
          <Reveal key={item.imageUrl} className={styles.galleryItem}>
            <Link href={item.href} className={styles.galleryLink}>
              <div className={styles.galleryImage}>
                <Image
                  src={item.imageUrl}
                  alt={item.alt || item.caption || "Karya Seni Religi"}
                  fill
                  sizes="(max-width: 700px) 90vw, 45vw"
                />
                <span className={styles.imageArrow}>
                  <ArrowUpRight size={22} />
                </span>
              </div>
              <div className={styles.galleryMeta}>
                <span>{item.category || "DOKUMENTASI SR"}</span>
                <span>0{index + 1}</span>
              </div>
              <h3>{item.caption || "Cerita dari Seni Religi"}</h3>
            </Link>
          </Reveal>
        ))}
      </div>
      {!photos.length && (
        <p className={styles.photoNote}>
          Foto ilustrasi · Dokumentasi Seni Religi akan tampil saat tersedia.
        </p>
      )}
      <Link className={styles.catalogLink} href="/katalog">
        <Rosette />
        <span>
          Temukan karya yang berbicara padamu.
          <small>Jelajahi koleksi kaligrafi Seni Religi.</small>
        </span>
        <span className={styles.catalogAction}>
          Lihat katalog <ArrowUpRight size={22} />
        </span>
      </Link>
    </section>
  );
}

export default function EditorialHome() {
  return (
    <div className={styles.home} data-sr-home>
      <section
        className={styles.hero}
        aria-labelledby="hero-title"
        data-sr-hero
      >
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow} data-hero-label>
            <i /> UKM SENI RELIGI · UNIVERSITAS BRAWIJAYA
          </span>
          <h1 id="hero-title">
            <span data-hero-line>Merawat rasa.</span>
            <br />
            <span data-hero-line>Menghidupkan</span>
            <br />
            <em data-hero-line>makna.</em>
            <Rosette />
          </h1>
          <p data-hero-detail>
            Rumah bagi jiwa kreatif untuk berkarya, bertumbuh,
            <br className={styles.desktopBreak} /> dan merayakan keindahan dalam
            nilai-nilai Islami.
          </p>
          <div className={styles.heroActions} data-hero-detail>
            <Link className={styles.primaryLink} href="/tentang">
              Kenali Seni Religi <ArrowUpRight size={18} />
            </Link>
            <a className={styles.heroSecondary} href="#ruang-ekspresi">
              Temukan ruangmu <ArrowDown size={16} />
            </a>
          </div>
          <div className={styles.heroFoot}>
            <span>BERKARYA DENGAN HATI.</span>
            <span>
              MALANG, INDONESIA <span aria-hidden="true">↗</span>
            </span>
          </div>
        </div>
        <ArchArtwork />
      </section>

      <div className={styles.valuesStrip} aria-label="Nilai Seni Religi">
        <span>Seni menyatukan</span>
        <Rosette />
        <span>Religi menguatkan</span>
        <Rosette />
        <span>Karya menginspirasi</span>
        <Rosette />
        <span>Bersama bertumbuh</span>
      </div>

      <section className={styles.about} aria-labelledby="about-title">
        <div className={styles.aboutLabel}>
          <span className={styles.eyebrow}>01 — INILAH KAMI</span>
          <Rosette />
        </div>
        <Reveal className={styles.aboutCopy}>
          <h2 id="about-title" data-split>
            Lebih dari sebuah organisasi. <br />
            Sebuah rumah untuk <br />
            <em>berproses bersama.</em>
          </h2>
          <div className={styles.aboutBottom}>
            <p>
              Seni Religi Universitas Brawijaya mempertemukan mahasiswa yang
              percaya bahwa seni adalah cara untuk merawat nilai, menyampaikan
              kebaikan, dan menemukan diri. Di sini, setiap bakat punya ruang.
              Setiap langkah punya teman.
            </p>
            <Link
              className={styles.roundLink}
              href="/tentang"
              aria-label="Baca cerita tentang Seni Religi"
            >
              <ArrowUpRight size={27} />
            </Link>
          </div>
        </Reveal>
      </section>

      <MagnetBoard />

      <section
        id="ruang-ekspresi"
        className={styles.fields}
        aria-labelledby="fields-title"
      >
        <div className={styles.fieldsIntro}>
          <span className={styles.eyebrow}>02 — RUANG EKSPRESI</span>
          <h2 id="fields-title" data-split>
            Banyak cara <br />
            berkarya. <br />
            <em>Satu keluarga.</em>
          </h2>
          <p>
            Dari harmoni suara hingga keindahan aksara. Temukan ruang yang
            paling dekat dengan dirimu.
          </p>
          <div className={styles.fieldArt} aria-hidden="true">
            <Rosette />
            <span>
              BERBEDA BAKAT.
              <br />
              SEIRAMA SEMANGAT.
            </span>
          </div>
        </div>
        <FieldExplorer />
      </section>

      <Gallery />

      <section className={styles.achievement}>
        <Rosette />
        <span className={styles.eyebrow}>TUMBUH MELALUI SETIAP PROSES</span>
        <h2 data-split>
          Langkah kecil hari ini. <br />
          <em>Jejak berarti esok hari.</em>
        </h2>
        <p>
          Di balik setiap pencapaian, ada ketekunan, doa,
          <br className={styles.desktopBreak} /> dan orang-orang yang saling
          menguatkan.
        </p>
        <Link className={styles.lightLink} href="/prestasi">
          Lihat perjalanan prestasi <ArrowUpRight size={18} />
        </Link>
        <span className={styles.achievementSide}>
          SENI RELIGI — UNIVERSITAS BRAWIJAYA
        </span>
      </section>

      <Journal />

      <section className={styles.invitation}>
        <div>
          <span className={styles.eyebrow}>
            SEBUAH PERJALANAN DIMULAI DARI SAPA
          </span>
          <h2 data-split>
            Ada ruang <br />
            untuk <em>ceritamu.</em>
          </h2>
          <p>
            Ingin berkarya, berkolaborasi, atau sekadar mengenal kami?
            <br />
            Kami senang mendengar darimu.
          </p>
          <Link className={styles.primaryLink} href="/kontak">
            Mari mulai percakapan <ArrowUpRight size={18} />
          </Link>
        </div>
        <Rosette />
      </section>
    </div>
  );
}
