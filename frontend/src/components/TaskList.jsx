import TaskCard from './TaskCard';

export default function TaskList({
  tasks,
  loading,
  error,
  hasFilters,
  onRetry,
  onCreate,
  onView,
  onEdit,
  onDelete,
}) {
  if (error) {
    return (
      <div className="state state-error" role="alert">
        <p className="state-title">⚠️ Something went wrong</p>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={onRetry}>
          Try again
        </button>
      </div>
    );
  }

  if (loading && tasks.length === 0) {
    return (
      <div className="grid" aria-busy="true">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="card skeleton" />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="state">
        <p className="state-title">{hasFilters ? '🔍 No matching tasks' : '📝 No tasks yet'}</p>
        <p>
          {hasFilters
            ? 'Try changing your search or filters.'
            : 'Create your first task to get started.'}
        </p>
        {!hasFilters && (
          <button className="btn btn-primary" onClick={onCreate}>
            + New Task
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`grid ${loading ? 'is-loading' : ''}`}>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}