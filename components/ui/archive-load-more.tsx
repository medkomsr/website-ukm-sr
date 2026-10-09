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
  if (!canExpand && !canCollapse) return null;
  return (
    <div className={s.pagination}>
      {canExpand && (
        <button disabled={busy} onClick={onMore}>
          {busy ? "Memuat…" : "Lihat lebih banyak"}
        </button>
      )}
      {canCollapse && (
        <button disabled={busy} onClick={onLess}>
          Lihat lebih sedikit
        </button>
      )}
    </div>
  );
}
