import s from "./content-skeleton.module.scss";

export default function ContentSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div
      data-tone="cream"
      className={`${s.root} ${compact ? s.compact : ""}`}
      role="status"
      aria-label="Memuat konten"
      aria-busy="true"
    >
      <div className={s.copy} aria-hidden="true">
        <span className={s.eyebrow} />
        <span className={s.title} />
        <span className={s.line} />
        <span className={s.line} />
      </div>
    </div>
  );
}

export function TextSkeleton() {
  return (
    <span className={s.text} role="status" aria-label="Memuat konten" aria-busy="true">
      <span aria-hidden="true" />
      <span aria-hidden="true" />
      <span aria-hidden="true" />
    </span>
  );
}
