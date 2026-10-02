import Badge from './Badge';
import { formatDate, isOverdue } from '../utils/format';

export default function TaskCard({ task, onView, onEdit, onDelete }) {
  const overdue = isOverdue(task);

  return (
    <article className="card">
      <div className="card-top">
        <h3 className="card-title">{task.title}</h3>
        <div className="badges">
          <Badge type="status" value={task.status} />
          <Badge type="priority" value={task.priority} />
        </div>
      </div>

      <p className="card-desc">{task.description}</p>

      <div className="card-meta">
        <span className={overdue ? 'overdue' : ''}>
          Due: {formatDate(task.dueDate)}
          {overdue && ' (overdue)'}
        </span>
        <span>Created: {formatDate(task.createdAt)}</span>
      </div>

      <div className="card-actions">
        <button className="btn btn-small" onClick={() => onView(task)}>
          View
        </button>
        <button className="btn btn-small" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button className="btn btn-small btn-danger" onClick={() => onDelete(task)}>
          Delete
        </button>
      </div>
    </article>
  );
}