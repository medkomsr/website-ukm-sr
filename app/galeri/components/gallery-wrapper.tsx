"use client";

import { useState } from "react";
import GalleryGridSection from "./gallery-grid";
import LightboxSection from "./lightbox";
import type { SanityGalleryItem } from "@/sanity/types";

export default function GalleryWrapper() {
  const [lightbox, setLightbox] = useState<SanityGalleryItem | null>(null);

  return (
    <>
      {/* Gallery grid */}
      <GalleryGridSection setLightbox={setLightbox} />

      {/* Lightbox */}
      <LightboxSection item={lightbox} onClose={() => setLightbox(null)} />
    </>
  );
}
