const AppError = require('../utils/AppError');

const STATUSES = ['pending', 'in_progress', 'completed'];
const PRIORITIES = ['low', 'medium', 'high'];

// partial = true -> only validate fields that are present (used for PUT)
const validateTask = (partial = false) => (req, res, next) => {
  const { title, description, status, priority, dueDate } = req.body || {};
  const errors = [];
  const has = (v) => v !== undefined;

  if (!partial || has(title)) {
    if (typeof title !== 'string' || !title.trim()) {
      errors.push({ field: 'title', message: 'Title is required' });
    } else if (title.trim().length > 100) {
      errors.push({ field: 'title', message: 'Title must be at most 100 characters' });
    }
  }

  if (!partial || has(description)) {
    if (typeof description !== 'string' || !description.trim()) {
      errors.push({ field: 'description', message: 'Description is required' });
    } else if (description.trim().length > 500) {
      errors.push({
        field: 'description',
        message: 'Description must be at most 500 characters',
      });
    }
  }

  if (has(status) && !STATUSES.includes(status)) {
    errors.push({
      field: 'status',
      message: `Status must be one of: ${STATUSES.join(', ')}`,
    });
  }

  if (has(priority) && !PRIORITIES.includes(priority)) {
    errors.push({
      field: 'priority',
      message: `Priority must be one of: ${PRIORITIES.join(', ')}`,
    });
  }

  if (has(dueDate) && dueDate !== null && dueDate !== '') {
    if (typeof dueDate !== 'string' || Number.isNaN(Date.parse(dueDate))) {
      errors.push({ field: 'dueDate', message: 'Due date must be a valid date' });
    }
  }

  if (errors.length > 0) {
    return next(new AppError('Validation failed', 400, errors));
  }
  next();
};

module.exports = validateTask;