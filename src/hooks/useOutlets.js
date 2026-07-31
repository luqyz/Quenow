import { useEffect, useMemo, useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { calculateDistance } from '../utils/distance';

const sortOptions = {
  queue: (a, b) => {
    const ranking = { low: 0, medium: 1, high: 2, unknown: 3 };
    return ranking[a.queue_status] - ranking[b.queue_status];
  },
  distance: (a, b) => (a.distance_km ?? Infinity) - (b.distance_km ?? Infinity),
};

const THIRTY_MIN_MS = 30 * 60 * 1000;

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
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  const fetchOutlets = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data: outletsData, error: outletsError } = await supabase
      .from('outlets')
      .select('*');

    if (outletsError) {
      setError(outletsError.message);
      setLoading(false);
      return;
    }

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

    const merged = outletsData.map((outlet) => {
      const latestReport = reportsData.find((r) => r.outlet_id === outlet.id);
      const status = latestReport ? latestReport.queue_level : 'unknown';
      const { count: decayedCount, wait: decayedWait } = calculateDecayedQueue(latestReport);

      return {
        ...outlet,
        queue_status: decayedCount === 0 ? 'unknown' : status,
        last_updated: latestReport ? latestReport.reported_at : null,
        distance_km: userLocation
          ? calculateDistance(userLocation.lat, userLocation.lng, outlet.lat, outlet.lng)
          : null,
        queue_count: decayedCount,
        est_wait_minutes: decayedWait,
        hourly_trend: outlet.hourly_trend ?? Array.from({ length: 24 }, () => Math.floor(Math.random() * 20)),
      };
    });

    setOutlets(merged);
    setLoading(false);
  }, [userLocation]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('✅ Got location:', position.coords.latitude, position.coords.longitude);
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => {
        console.error('❌ Geolocation error:', err.message);
        setLocationError(err.message);
      }
    );
  }, []);

  useEffect(() => {
    fetchOutlets();

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
    userLocation,
    locationError,
  };
}