import { useCallback, useEffect, useState } from 'react';
import { getTasks } from '../services/taskApi';

export default function useTasks(params) {
  const [tasks, setTasks] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1, limit: 6 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    getTasks(params)
      .then((res) => {
        if (cancelled) return;
        setTasks(res.data);
        setMeta(res.meta);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey, reloadKey]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  return { tasks, meta, loading, error, reload };
}