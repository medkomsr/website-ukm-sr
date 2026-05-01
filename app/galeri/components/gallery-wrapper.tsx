"use client";

import { useState } from "react";
import GalleryGridSection from "./gallery-grid";
import LightboxSection from "./lightbox";
import { GalleryItem } from "@/lib/data";

export default function GalleryWrapper({ items }: { items: GalleryItem[] }) {
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  return (
    <>
      {/* Gallery grid */}
      <GalleryGridSection items={items} setLightbox={setLightbox} />

      {/* Lightbox */}
      <LightboxSection item={lightbox} onClose={() => setLightbox(null)} />
    </>
  );
}
