const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export class ApiError extends Error {
  constructor(message, status, details = null) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new ApiError('Cannot reach the server. Is the backend running?', 0);
  }

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(body?.message || 'Something went wrong', res.status, body?.errors);
  }
  return body;
}

export const getTasks = (params = {}) => {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) qs.append(key, value);
  });
  return request(`/tasks?${qs.toString()}`);
};

export const getTask = (id) => request(`/tasks/${id}`);

export const createTask = (data) =>
  request('/tasks', { method: 'POST', body: JSON.stringify(data) });

export const updateTask = (id, data) =>
  request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deleteTask = (id) => request(`/tasks/${id}`, { method: 'DELETE' });