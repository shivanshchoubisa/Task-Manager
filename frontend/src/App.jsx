import { useCallback, useEffect, useState } from 'react';
import Header from './components/Header';
import TaskFilters from './components/TaskFilters';
import TaskList from './components/TaskList';
import Pagination from './components/Pagination';
import Modal from './components/Modal';
import TaskForm from './components/TaskForm';
import TaskDetails from './components/TaskDetails';
import ConfirmDialog from './components/ConfirmDialog';
import Toast from './components/Toast';
import useTasks from './hooks/useTasks';
import useDebounce from './hooks/useDebounce';
import useTheme from './hooks/useTheme';
import { createTask, deleteTask, updateTask } from './services/taskApi';

const PAGE_SIZE = 6;

export default function App() {
  const { theme, toggleTheme } = useTheme();

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    sort: 'createdAt:desc',
  });
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(filters.search, 400);
  const [sortBy, order] = filters.sort.split(':');

  const { tasks, meta, loading, error, reload } = useTasks({
    search: debouncedSearch.trim(),
    status: filters.status,
    priority: filters.priority,
    sortBy,
    order,
    page,
    limit: PAGE_SIZE,
  });

  // formTask: undefined = closed, null = create, object = edit
  const [formTask, setFormTask] = useState(undefined);
  const [viewTask, setViewTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  // If the last task on a page is deleted, go back a page
  useEffect(() => {
    if (!loading && !error && page > meta.totalPages) setPage(meta.totalPages);
  }, [loading, error, page, meta.totalPages]);

  const handleFilterChange = (name, value) => {
    setFilters((f) => ({ ...f, [name]: value }));
    setPage(1);
  };

  const closeForm = useCallback(() => setFormTask(undefined), []);
  const closeView = useCallback(() => setViewTask(null), []);
  const cancelDelete = useCallback(() => setTaskToDelete(null), []);

  const handleSave = async (data) => {
    if (formTask) {
      await updateTask(formTask.id, data);
      setToast({ type: 'success', message: 'Task updated successfully' });
    } else {
      await createTask(data);
      setToast({ type: 'success', message: 'Task created successfully' });
    }
    setFormTask(undefined);
    reload();
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteTask(taskToDelete.id);
      setToast({ type: 'success', message: 'Task deleted' });
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setDeleting(false);
      setTaskToDelete(null);
      setViewTask(null);
      reload();
    }
  };

  const hasFilters = Boolean(filters.search || filters.status || filters.priority);

  return (
    <>
      <Header theme={theme} onToggleTheme={toggleTheme} onCreate={() => setFormTask(null)} />

      <main className="container">
        <TaskFilters filters={filters} onChange={handleFilterChange} />

        <TaskList
          tasks={tasks}
          loading={loading}
          error={error}
          hasFilters={hasFilters}
          onRetry={reload}
          onCreate={() => setFormTask(null)}
          onView={setViewTask}
          onEdit={setFormTask}
          onDelete={setTaskToDelete}
        />

        {!error && meta.totalPages > 1 && (
          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            total={meta.total}
            onChange={setPage}
          />
        )}
      </main>

      {formTask !== undefined && (
        <Modal title={formTask ? 'Edit task' : 'Create task'} onClose={closeForm}>
          <TaskForm task={formTask} onSubmit={handleSave} onCancel={closeForm} />
        </Modal>
      )}

      {viewTask && (
        <Modal title="Task details" onClose={closeView}>
          <TaskDetails
            taskId={viewTask.id}
            initialTask={viewTask}
            onClose={closeView}
            onEdit={(task) => {
              setViewTask(null);
              setFormTask(task);
            }}
            onDelete={setTaskToDelete}
          />
        </Modal>
      )}

      {taskToDelete && (
        <ConfirmDialog
          task={taskToDelete}
          busy={deleting}
          onConfirm={handleConfirmDelete}
          onCancel={cancelDelete}
        />
      )}

      <Toast toast={toast} />
    </>
  );
}