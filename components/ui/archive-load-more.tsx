"use client";

import { useRef } from "react";
import { flushSync } from "react-dom";
import s from "./archive-pagination.module.scss";

export default function ArchiveLoadMore({
  busy,
  canExpand,
  canCollapse,
  onMore,
  onLess,
}: {
  busy: boolean;
  canExpand: boolean;
  canCollapse: boolean;
  onMore: () => void;
  onLess: () => void;
}) {
  const controls = useRef<HTMLDivElement>(null);
  const collapse = () => {
    const anchor = controls.current;
    if (!anchor) return;
    const top = anchor.getBoundingClientRect().top;
    // Shrinking the list can clamp the page scroll. Keep its controls at the
    // same screen position instead of jumping back to the section heading.
    flushSync(onLess);
    anchor.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
    // Let page reveal/ScrollTrigger effects finish recalculating the new height.
    requestAnimationFrame(() => {
      if (anchor.isConnected)
        window.scrollBy({ top: anchor.getBoundingClientRect().top - top, behavior: "instant" });
    });
  };
  if (!canExpand && !canCollapse) return null;
  return (
    <div ref={controls} className={s.pagination}>
      {canExpand && (
        <button disabled={busy} onClick={onMore}>
          {busy ? "Memuat…" : "Lihat lebih banyak"}
        </button>
      )}
      {canCollapse && (
        <button disabled={busy} onClick={collapse}>
          Lihat lebih sedikit
        </button>
      )}
    </div>
  );
}
