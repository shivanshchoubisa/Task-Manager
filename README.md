# Task Management System

A full-stack task manager built with **React (Vite)** and **Node.js + Express**. Tasks are stored **in backend memory only** (no database), so data resets when the server restarts.

- **Live demo:** https://YOUR-FRONTEND-URL.vercel.app
- **API base URL:** https://YOUR-BACKEND-URL.onrender.com/api

> The backend runs on a free tier and may take ~30–60 seconds to wake up on the first request.

## Features

- Dashboard with task title, description, status, priority, due date and created date
- Create, edit, view (details modal) and delete tasks
- Client-side and server-side validation
- Loading skeletons, empty state and error state with retry
- Search (debounced), filter by status and priority, sort, pagination
- Dark mode (remembers your choice)
- Responsive layout for desktop and mobile

## Tech Stack

| Layer    | Technology                            |
| -------- | ------------------------------------- |
| Frontend | React 18, Vite, plain CSS             |
| Backend  | Node.js, Express, CORS, dotenv        |
| Storage  | In-memory array (no database)         |
| API      | REST (JSON)                           |

## Project Structure

```
task-manager/
├── backend/
│   └── src/
│       ├── routes/task.routes.js
│       ├── controllers/task.controller.js
│       ├── services/task.service.js
│       ├── middleware/errorHandler.js
│       ├── middleware/validateTask.js
│       ├── utils/AppError.js
│       ├── app.js
│       └── server.js
├── frontend/
│   └── src/
│       ├── components/      # reusable UI components
│       ├── hooks/           # useTasks, useDebounce, useTheme
│       ├── services/        # taskApi.js (all API calls)
│       ├── utils/
│       ├── App.jsx
│       └── main.jsx
├── docs/postman_collection.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/task-manager.git
cd task-manager
```

### 2. Run the backend
```bash
cd backend
npm install
cp .env.example .env      # Windows PowerShell: Copy-Item .env.example .env
npm run dev
```
The API runs at `http://localhost:5000`.

### 3. Run the frontend (new terminal)
```bash
cd frontend
npm install
cp .env.example .env      # Windows PowerShell: Copy-Item .env.example .env
npm run dev
```
The app runs at `http://localhost:5173`.

## Environment Variables

**backend/.env**
| Variable     | Description                    | Default                 |
| ------------ | ------------------------------ | ----------------------- |
| `PORT`       | Server port                    | `5000`                  |
| `CLIENT_URL` | Allowed CORS origin (frontend) | `http://localhost:5173` |

**frontend/.env**
| Variable       | Description      | Default                     |
| -------------- | ---------------- | --------------------------- |
| `VITE_API_URL` | Backend API URL  | `http://localhost:5000/api` |

## API Documentation

Base URL: `/api`

| Method | Endpoint      | Description       | Success | Errors   |
| ------ | ------------- | ----------------- | ------- | -------- |
| GET    | `/tasks`      | Get all tasks     | 200     | —        |
| GET    | `/tasks/:id`  | Get a single task | 200     | 404      |
| POST   | `/tasks`      | Create a task     | 201     | 400      |
| PUT    | `/tasks/:id`  | Update a task     | 200     | 400, 404 |
| DELETE | `/tasks/:id`  | Delete a task     | 200     | 404      |
| GET    | `/health`     | Health check      | 200     | —        |

### Query parameters for `GET /tasks`

| Param      | Values                              | Default     |
| ---------- | ----------------------------------- | ----------- |
| `search`   | text (matches title or description) | —           |
| `status`   | `pending`, `in_progress`, `completed` | —         |
| `priority` | `low`, `medium`, `high`             | —           |
| `sortBy`   | `createdAt`, `priority`, `dueDate`  | `createdAt` |
| `order`    | `asc`, `desc`                       | `desc`      |
| `page`     | number                              | `1`         |
| `limit`    | number (max 100)                    | `10`        |

### Task object
```json
{
  "id": "b1f0c5c2-0d7e-4a52-8f3e-1c2b3a4d5e6f",
  "title": "Complete assignment",
  "description": "Build the full-stack task manager",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-10-05",
  "createdAt": "2026-10-01T10:00:00.000Z",
  "updatedAt": "2026-10-01T10:00:00.000Z"
}
```

### Example: create a task
`POST /api/tasks`
```json
{
  "title": "Complete assignment",
  "description": "Build the full-stack task manager",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-10-05"
}
```
Response `201`:
```json
{ "success": true, "data": { "id": "...", "title": "Complete assignment", "...": "..." } }
```

### Example: list response
```json
{
  "success": true,
  "data": [ { "id": "...", "title": "..." } ],
  "meta": { "total": 12, "page": 1, "limit": 6, "totalPages": 2 }
}
```

### Validation error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "field": "title", "message": "Title is required" }]
}
```

### Not found (404)
```json
{ "success": false, "message": "Task not found" }
```

## Architecture Notes

- **Backend:** routes → controllers → services, with validation middleware and a centralized error handler.
- **Frontend:** reusable components, custom hooks for data/theme/debounce, and a dedicated API service layer.
- **Storage:** an in-memory array in `task.service.js`; no database is used.



