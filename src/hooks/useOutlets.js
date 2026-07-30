import { useEffect, useMemo, useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

const sortOptions = {
  queue: (a, b) => {
    const ranking = { low: 0, medium: 1, high: 2, unknown: 3 };
    return ranking[a.queue_status] - ranking[b.queue_status];
  },
  distance: (a, b) => (a.distance_km || 0) - (b.distance_km || 0),
};

const THIRTY_MIN_MS = 30 * 60 * 1000;

// NEW: simulate queue decreasing over time (1 group served every 5 min)
function calculateDecayedQueue(report) {
  if (!report || !report.queue_count) return { count: 0, wait: 0 };

  const reportedTime = new Date(report.reported_at).getTime();
  const now = Date.now();
  const minutesElapsed = Math.floor((now - reportedTime) / 60000);
  const peopleServed = Math.floor(minutesElapsed / 5);

  const remainingCount = Math.max(report.queue_count - peopleServed, 0);
  return {
    count: remainingCount,
    wait: remainingCount * 5,
  };
}

export function useOutlets() {
  const [sortBy, setSortBy] = useState('queue');
  const [filters, setFilters] = useState({ openNow: false, queueStatus: 'all', brand: 'all' });
  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOutlets = useCallback(async () => {
    setLoading(true);
    setError(null);

    // 1. Get all outlets
    const { data: outletsData, error: outletsError } = await supabase
      .from('outlets')
      .select('*');

    if (outletsError) {
      setError(outletsError.message);
      setLoading(false);
      return;
    }

    // 2. Get recent queue reports (last 30 min) for all outlets
    const cutoff = new Date(Date.now() - THIRTY_MIN_MS).toISOString();
    const { data: reportsData, error: reportsError } = await supabase
      .from('queue_reports')
      .select('*')
      .gte('reported_at', cutoff)
      .order('reported_at', { ascending: false });

    if (reportsError) {
      setError(reportsError.message);
      setLoading(false);
      return;
    }

    // 3. Merge: attach the most recent report's queue_level to each outlet,
    //    with queue count "decaying" over time to simulate live updates
    const merged = outletsData.map((outlet) => {
      const latestReport = reportsData.find((r) => r.outlet_id === outlet.id);
      const status = latestReport ? latestReport.queue_level : 'unknown';
      const { count: decayedCount, wait: decayedWait } = calculateDecayedQueue(latestReport);

      return {
        ...outlet,
        queue_status: decayedCount === 0 ? 'unknown' : status,
        last_updated: latestReport ? latestReport.reported_at : null,
        distance_km: outlet.distance_km ?? 0,
        queue_count: decayedCount,
        est_wait_minutes: decayedWait,
        hourly_trend: outlet.hourly_trend ?? Array.from({ length: 24 }, () => Math.floor(Math.random() * 20)),
      };
    });

    setOutlets(merged);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOutlets();

    // Realtime subscription: refetch whenever a new queue report is inserted
    const channel = supabase
      .channel('queue_reports_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'queue_reports' },
        () => {
          fetchOutlets();
        }
      )
      .subscribe();

    // NEW: refresh every minute so queue count "decays" automatically
    const decayInterval = setInterval(() => {
      fetchOutlets();
    }, 60000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(decayInterval);
    };
  }, [fetchOutlets]);

  const filteredOutlets = useMemo(() => {
    const normalized = outlets.filter((outlet) => {
      if (filters.openNow && outlet.queue_status === 'high') return false;
      if (filters.queueStatus !== 'all' && outlet.queue_status !== filters.queueStatus) return false;
      if (filters.brand !== 'all' && outlet.brand !== filters.brand) return false;
      return true;
    });
    return [...normalized].sort(sortOptions[sortBy] || sortOptions.queue);
  }, [filters, outlets, sortBy]);

  // Kept for compatibility, but real updates now go through Supabase inserts
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
    loading,
    error,
    refetch: fetchOutlets,
  };
}