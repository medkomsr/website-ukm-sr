"use client";

import { useState } from "react";
import GalleryGridSection from "./gallery-grid";
import LightboxSection from "./lightbox";
import type { SanityGalleryItem } from "@/sanity/types";

export default function GalleryWrapper({ items }: { items: SanityGalleryItem[] }) {
  const [lightbox, setLightbox] = useState<SanityGalleryItem | null>(null);

  return (
    <>
      {/* Gallery grid */}
      <GalleryGridSection items={items} setLightbox={setLightbox} />

      {/* Lightbox */}
      <LightboxSection item={lightbox} onClose={() => setLightbox(null)} />
    </>
  );
}
