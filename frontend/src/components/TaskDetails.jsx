import { useEffect, useState } from 'react';
import Badge from './Badge';
import { getTask } from '../services/taskApi';
import { formatDate, formatDateTime } from '../utils/format';

export default function TaskDetails({ taskId, initialTask, onEdit, onDelete, onClose }) {
  const [task, setTask] = useState(initialTask);
  const [error, setError] = useState('');

  // Fetch the latest version from GET /api/tasks/:id
  useEffect(() => {
    let cancelled = false;
    getTask(taskId)
      .then((res) => !cancelled && setTask(res.data))
      .catch((err) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, [taskId]);

  if (error) {
    return (
      <div>
        <div className="alert" role="alert">
          {error}
        </div>
        <div className="form-actions">
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="details">
      <h3>{task.title}</h3>
      <div className="badges">
        <Badge type="status" value={task.status} />
        <Badge type="priority" value={task.priority} />
      </div>

      <p className="details-desc">{task.description}</p>

      <dl className="details-list">
        <dt>Due date</dt>
        <dd>{formatDate(task.dueDate)}</dd>
        <dt>Created</dt>
        <dd>{formatDateTime(task.createdAt)}</dd>
        <dt>Last updated</dt>
        <dd>{formatDateTime(task.updatedAt)}</dd>
        <dt>ID</dt>
        <dd className="mono">{task.id}</dd>
      </dl>

      <div className="form-actions">
        <button className="btn btn-danger" onClick={() => onDelete(task)}>
          Delete
        </button>
        <button className="btn btn-primary" onClick={() => onEdit(task)}>
          Edit
        </button>
      </div>
    </div>
  );
}