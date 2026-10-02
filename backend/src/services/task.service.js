const { randomUUID } = require('crypto');
const AppError = require('../utils/AppError');

const PRIORITY_ORDER = { low: 1, medium: 2, high: 3 };
const SORT_FIELDS = ['createdAt', 'priority', 'dueDate'];

// In-memory storage (resets when the server restarts)
const now = new Date().toISOString();
let tasks = [
  {
    id: randomUUID(),
    title: 'Complete assignment',
    description: 'Build the full-stack task manager',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2026-10-05',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: randomUUID(),
    title: 'Write README',
    description: 'Document setup steps and API endpoints',
    status: 'pending',
    priority: 'medium',
    dueDate: '2026-10-06',
    createdAt: now,
    updatedAt: now,
  },
];

const getAll = ({
  search,
  status,
  priority,
  sortBy = 'createdAt',
  order = 'desc',
  page = 1,
  limit = 10,
} = {}) => {
  let result = [...tasks];

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    );
  }
  if (status) result = result.filter((t) => t.status === status);
  if (priority) result = result.filter((t) => t.priority === priority);

  const field = SORT_FIELDS.includes(sortBy) ? sortBy : 'createdAt';
  const dir = order === 'asc' ? 1 : -1;

  result.sort((a, b) => {
    if (field === 'priority') {
      return (PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]) * dir;
    }
    if (field === 'dueDate') {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1; // tasks without due date go last
      if (!b.dueDate) return -1;
      return (new Date(a.dueDate) - new Date(b.dueDate)) * dir;
    }
    return (new Date(a.createdAt) - new Date(b.createdAt)) * dir;
  });

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
  const total = result.length;
  const totalPages = Math.max(Math.ceil(total / limitNum), 1);
  const start = (pageNum - 1) * limitNum;

  return {
    tasks: result.slice(start, start + limitNum),
    meta: { total, page: pageNum, limit: limitNum, totalPages },
  };
};

const getById = (id) => {
  const task = tasks.find((t) => t.id === id);
  if (!task) throw new AppError('Task not found', 404);
  return task;
};

const create = ({ title, description, status, priority, dueDate }) => {
  const timestamp = new Date().toISOString();
  const task = {
    id: randomUUID(),
    title: title.trim(),
    description: description.trim(),
    status: status || 'pending',
    priority: priority || 'medium',
    dueDate: dueDate || null,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  tasks.unshift(task);
  return task;
};

const update = (id, data) => {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) throw new AppError('Task not found', 404);

  const current = tasks[index];
  const updated = {
    ...current,
    title: data.title !== undefined ? data.title.trim() : current.title,
    description:
      data.description !== undefined ? data.description.trim() : current.description,
    status: data.status !== undefined ? data.status : current.status,
    priority: data.priority !== undefined ? data.priority : current.priority,
    dueDate: data.dueDate !== undefined ? data.dueDate || null : current.dueDate,
    updatedAt: new Date().toISOString(),
  };
  tasks[index] = updated;
  return updated;
};

const remove = (id) => {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) throw new AppError('Task not found', 404);
  const [deleted] = tasks.splice(index, 1);
  return deleted;
};

module.exports = { getAll, getById, create, update, remove };