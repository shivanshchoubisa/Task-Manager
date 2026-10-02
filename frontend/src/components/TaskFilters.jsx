import { PRIORITY_OPTIONS, SORT_OPTIONS, STATUS_OPTIONS } from '../utils/constants';

export default function TaskFilters({ filters, onChange }) {
  return (
    <div className="filters">
      <input
        type="search"
        className="input search"
        placeholder="Search by title or description..."
        value={filters.search}
        onChange={(e) => onChange('search', e.target.value)}
        aria-label="Search tasks"
      />
      <select
        className="input"
        value={filters.status}
        onChange={(e) => onChange('status', e.target.value)}
        aria-label="Filter by status"
      >
        <option value="">All statuses</option>
        {STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <select
        className="input"
        value={filters.priority}
        onChange={(e) => onChange('priority', e.target.value)}
        aria-label="Filter by priority"
      >
        <option value="">All priorities</option>
        {PRIORITY_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <select
        className="input"
        value={filters.sort}
        onChange={(e) => onChange('sort', e.target.value)}
        aria-label="Sort tasks"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}