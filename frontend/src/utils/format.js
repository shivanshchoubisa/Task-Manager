const parseDate = (value) =>
  value.length === 10 ? new Date(`${value}T00:00:00`) : new Date(value);

export const formatDate = (value) => {
  if (!value) return '—';
  return parseDate(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const isOverdue = (task) => {
  if (!task.dueDate || task.status === 'completed') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return parseDate(task.dueDate) < today;
};