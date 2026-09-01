"use client";

import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  MessageCircle,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { urlFor } from "@/sanity/image";
import type { SanityKaligrafiItem } from "@/sanity/types";

type CatalogGridProps = {
  items: SanityKaligrafiItem[];
  whatsappNumber: string | null;
  catalogPath: string;
};

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

function formatRupiah(price: number) {
  return rupiahFormatter.format(price);
}

function getCardImageUrl(item: SanityKaligrafiItem) {
  return urlFor(item.image)
    .width(900)
    .height(1125)
    .fit("crop")
    .quality(82)
    .url();
}

function getLightboxImageUrl(item: SanityKaligrafiItem) {
  return urlFor(item.image).width(1800).quality(90).url();
}

function buildWhatsappHref(
  whatsappNumber: string,
  item: SanityKaligrafiItem,
  catalogUrl: string,
) {
  const message = [
    "Halo, saya tertarik dengan karya kaligrafi berikut:",
    "",
    `Judul: ${item.title}`,
    `Kode: ${item.code}`,
    `Harga: ${formatRupiah(item.price)}`,
    `Tautan: ${catalogUrl}`,
    "",
    "Apakah karya ini masih tersedia?",
  ].join("\n");

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function CatalogCard({
  item,
  onOpen,
}: {
  item: SanityKaligrafiItem;
  onOpen: () => void;
}) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:border-(--color-maroon-500)/20 hover:shadow-[0_18px_45px_rgba(13,42,26,0.11)]">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Lihat detail ${item.title}`}
        aria-haspopup="dialog"
        className="block w-full cursor-zoom-in text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--color-maroon-500)"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
          <Image
            src={getCardImageUrl(item)}
            alt={item.alt || `Karya kaligrafi ${item.title}`}
            fill
            sizes="(max-width: 639px) calc(100vw - 2rem), (max-width: 1023px) 50vw, 33vw"
            placeholder={item.imageLqip ? "blur" : "empty"}
            blurDataURL={item.imageLqip ?? undefined}
            className="object-cover transition duration-700 group-hover:scale-[1.035]"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
          <span className="absolute bottom-4 right-4 inline-flex size-10 items-center justify-center rounded-full bg-white/90 text-(--color-maroon-900) opacity-0 shadow-lg backdrop-blur-sm transition group-hover:opacity-100 group-focus-within:opacity-100">
            <Maximize2 aria-hidden="true" className="size-4" />
          </span>
        </div>

        <div className="p-5">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="truncate text-[11px] font-bold uppercase tracking-[0.16em] text-(--color-maroon-600)">
              {item.category.name}
            </span>
            <span className="shrink-0 rounded-full bg-neutral-100 px-2.5 py-1 font-mono text-[11px] font-semibold text-neutral-500">
              {item.code}
            </span>
          </div>
          <h2
            className="line-clamp-2 min-h-14 text-xl leading-snug text-neutral-900"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
          >
            {item.title}
          </h2>
          <p className="mt-3 text-[15px] font-bold text-(--color-maroon-800)">
            {formatRupiah(item.price)}
          </p>
        </div>
      </button>
    </article>
  );
}

function CatalogLightbox({
  item,
  itemNumber,
  itemCount,
  whatsappNumber,
  catalogPath,
  onClose,
  onPrevious,
  onNext,
}: {
  item: SanityKaligrafiItem;
  itemNumber: number;
  itemCount: number;
  whatsappNumber: string | null;
  catalogPath: string;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const canGoPrevious = itemNumber > 1;
  const canGoNext = itemNumber < itemCount;
  const validWhatsappNumber =
    whatsappNumber && /^[1-9]\d{7,14}$/.test(whatsappNumber)
      ? whatsappNumber
      : null;

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "ArrowLeft" && canGoPrevious) {
        event.preventDefault();
        onPrevious();
        return;
      }

      if (event.key === "ArrowRight" && canGoNext) {
        event.preventDefault();
        onNext();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

      if (!focusableElements?.length) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [canGoNext, canGoPrevious, onClose, onNext, onPrevious]);

  const catalogUrl =
    typeof window === "undefined" ? catalogPath : window.location.href;
  const whatsappHref = validWhatsappNumber
    ? buildWhatsappHref(validWhatsappNumber, item, catalogUrl)
    : undefined;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/85 p-3 backdrop-blur-sm md:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="catalog-dialog-title"
        aria-describedby="catalog-dialog-description"
        className="relative grid max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white shadow-2xl md:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.75fr)] md:overflow-hidden"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Tutup detail karya"
          className="absolute right-3 top-3 z-20 inline-flex size-10 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/60"
        >
          <X aria-hidden="true" className="size-5" />
        </button>

        <div className="relative min-h-[46vh] bg-neutral-950 md:min-h-[72vh]">
          <Image
            src={getLightboxImageUrl(item)}
            alt={item.alt || `Karya kaligrafi ${item.title}`}
            fill
            priority
            sizes="(max-width: 767px) 100vw, 70vw"
            placeholder={item.imageLqip ? "blur" : "empty"}
            blurDataURL={item.imageLqip ?? undefined}
            className="object-contain"
          />

          {itemCount > 1 && (
            <>
              <button
                type="button"
                onClick={onPrevious}
                disabled={!canGoPrevious}
                aria-label="Lihat karya sebelumnya"
                className="absolute left-3 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-25"
              >
                <ChevronLeft aria-hidden="true" className="size-5" />
              </button>
              <button
                type="button"
                onClick={onNext}
                disabled={!canGoNext}
                aria-label="Lihat karya berikutnya"
                className="absolute right-3 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-25"
              >
                <ChevronRight aria-hidden="true" className="size-5" />
              </button>
            </>
          )}

          <span className="absolute bottom-3 left-3 rounded-full bg-black/55 px-3 py-1.5 text-xs font-semibold text-white/85 backdrop-blur-sm">
            {itemNumber} / {itemCount}
          </span>
        </div>

        <div className="flex flex-col p-6 md:overflow-y-auto md:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-(--color-maroon-50) px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-(--color-maroon-700)">
              {item.category.name}
            </span>
            <span className="rounded-full bg-neutral-100 px-3 py-1.5 font-mono text-[11px] font-semibold text-neutral-500">
              {item.code}
            </span>
          </div>

          <h2
            id="catalog-dialog-title"
            className="text-[28px] leading-tight text-neutral-950 md:text-[32px]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
          >
            {item.title}
          </h2>
          <p className="mt-3 text-lg font-bold text-(--color-maroon-800)">
            {formatRupiah(item.price)}
          </p>

          <div className="my-6 h-px bg-neutral-100" />
          <p
            id="catalog-dialog-description"
            className="whitespace-pre-line text-sm leading-7 text-neutral-600"
          >
            {item.description ||
              "Hubungi kami untuk mendapatkan informasi lebih lanjut mengenai karya ini."}
          </p>

          {validWhatsappNumber && whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#20bd5a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 md:mt-auto"
            >
              <MessageCircle aria-hidden="true" className="size-4" />
              Tanya via WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CatalogGrid({
  items,
  whatsappNumber,
  catalogPath,
}: CatalogGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setSelectedIndex(null), []);
  const showPrevious = useCallback(
    () => setSelectedIndex((index) => (index !== null && index > 0 ? index - 1 : index)),
    [],
  );
  const showNext = useCallback(
    () =>
      setSelectedIndex((index) =>
        index !== null && index < items.length - 1 ? index + 1 : index,
      ),
    [items.length],
  );

  const selectedItem = selectedIndex === null ? null : items[selectedIndex];

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <CatalogCard
            key={item._id}
            item={item}
            onOpen={() => setSelectedIndex(index)}
          />
        ))}
      </div>

      {selectedItem && selectedIndex !== null && (
        <CatalogLightbox
          key={selectedItem._id}
          item={selectedItem}
          itemNumber={selectedIndex + 1}
          itemCount={items.length}
          whatsappNumber={whatsappNumber}
          catalogPath={catalogPath}
          onClose={closeLightbox}
          onPrevious={showPrevious}
          onNext={showNext}
        />
      )}
    </>
  );
}
