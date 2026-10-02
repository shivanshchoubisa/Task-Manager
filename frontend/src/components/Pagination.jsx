export default function Pagination({ page, totalPages, total, onChange }) {
  return (
    <nav className="pagination" aria-label="Pagination">
      <button className="btn" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        ← Prev
      </button>
      <span>
        Page {page} of {totalPages} · {total} tasks
      </span>
      <button
        className="btn"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        Next →
      </button>
    </nav>
  );
}