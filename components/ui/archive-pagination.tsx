"use client";

import s from "./archive-pagination.module.scss";

export default function ArchivePagination({
  page,
  pages,
  busy,
  onChange,
}: {
  page: number;
  pages: number;
  busy?: boolean;
  onChange: (page: number) => void;
}) {
  if (pages <= 1) return null;
  const numbers = [...new Set([1, page - 1, page, page + 1, pages])]
    .filter((n) => n >= 1 && n <= pages)
    .sort((a, b) => a - b);
  return (
    <nav className={s.pagination} aria-label="Navigasi halaman">
      <button disabled={busy || page <= 1} onClick={() => onChange(page - 1)}>
        Sebelumnya
      </button>
      {numbers.map((number, i) => (
        <span key={number}>
          {i > 0 && number - numbers[i - 1] > 1 && <span aria-hidden="true">…</span>}
          <button
            aria-label={`Halaman ${number}`}
            aria-current={number === page ? "page" : undefined}
            disabled={busy}
            onClick={() => onChange(number)}
          >
            {number}
          </button>
        </span>
      ))}
      <button disabled={busy || page >= pages} onClick={() => onChange(page + 1)}>
        Berikutnya
      </button>
      <p role="status">
        Halaman {page} dari {pages}
      </p>
    </nav>
  );
}
