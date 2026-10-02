import { useState } from 'react';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '../utils/constants';

const EMPTY = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  dueDate: '',
};

const validate = (values) => {
  const errors = {};
  if (!values.title.trim()) errors.title = 'Title is required';
  else if (values.title.trim().length > 100)
    errors.title = 'Title must be at most 100 characters';

  if (!values.description.trim()) errors.description = 'Description is required';
  else if (values.description.trim().length > 500)
    errors.description = 'Description must be at most 500 characters';

  return errors;
};

export default function TaskForm({ task, onSubmit, onCancel }) {
  const [values, setValues] = useState(
    task
      ? {
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
        }
      : EMPTY
  );
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    setServerError('');
    try {
      await onSubmit({
        ...values,
        title: values.title.trim(),
        description: values.description.trim(),
        dueDate: values.dueDate || null,
      });
    } catch (err) {
      if (err.details?.length) {
        const fieldErrors = {};
        err.details.forEach((d) => {
          fieldErrors[d.field] = d.message;
        });
        setErrors(fieldErrors);
      }
      setServerError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="form">
      {serverError && (
        <div className="alert" role="alert">
          {serverError}
        </div>
      )}

      <div className="field">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          name="title"
          className={`input ${errors.title ? 'input-error' : ''}`}
          value={values.title}
          onChange={handleChange}
          placeholder="e.g. Complete assignment"
        />
        {errors.title && <span className="error-text">{errors.title}</span>}
      </div>

      <div className="field">
        <label htmlFor="description">Description *</label>
        <textarea
          id="description"
          name="description"
          rows={4}
          className={`input ${errors.description ? 'input-error' : ''}`}
          value={values.description}
          onChange={handleChange}
          placeholder="Describe the task..."
        />
        {errors.description && <span className="error-text">{errors.description}</span>}
      </div>

      <div className="row">
        <div className="field">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            className="input"
            value={values.status}
            onChange={handleChange}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            className="input"
            value={values.priority}
            onChange={handleChange}
          >
            {PRIORITY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="dueDate">Due date</label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            className={`input ${errors.dueDate ? 'input-error' : ''}`}
            value={values.dueDate}
            onChange={handleChange}
          />
          {errors.dueDate && <span className="error-text">{errors.dueDate}</span>}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : task ? 'Save changes' : 'Create task'}
        </button>
      </div>
    </form>
  );
}