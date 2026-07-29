import { useMemo, useState } from 'react';
import mockOutlets from '../data/mockOutlets';

const sortOptions = {
  queue: (a, b) => {
    const ranking = { low: 0, medium: 1, high: 2 };
    return ranking[a.queue_status] - ranking[b.queue_status];
  },
  distance: (a, b) => a.distance_km - b.distance_km,
};

export function useOutlets() {
  const [sortBy, setSortBy] = useState('queue');
  const [filters, setFilters] = useState({ openNow: false, queueStatus: 'all' });
  const [outlets, setOutlets] = useState(mockOutlets);

  const filteredOutlets = useMemo(() => {
    const normalized = outlets.filter((outlet) => {
      if (filters.openNow && outlet.queue_status === 'high') return false;
      if (filters.queueStatus !== 'all' && outlet.queue_status !== filters.queueStatus) return false;
      return true;
    });

    return [...normalized].sort(sortOptions[sortBy] || sortOptions.queue);
  }, [filters, outlets, sortBy]);

  const updateOutlet = (id, updates) => {
    setOutlets((current) => current.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  return {
    outlets: filteredOutlets,
    sortBy,
    setSortBy,
    filters,
    setFilters,
    updateOutlet,
  };
}
