import { useState, useEffect } from 'react';
import { fetchCallLog } from '../api/client';

export function useCallData(dateFrom, dateTo) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!dateFrom || !dateTo) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchCallLog(dateFrom, dateTo)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [dateFrom, dateTo]);

  return { data, loading, error };
}
