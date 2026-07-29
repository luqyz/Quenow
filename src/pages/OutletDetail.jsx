import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OutletDetailCard from '../components/OutletDetail';
import { supabase } from '../lib/supabaseClient';

export default function OutletDetailPage({ outlets, updateOutlet, refetch }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const outlet = useMemo(() => outlets.find((item) => String(item.id) === id), [id, outlets]);

  if (!outlet) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 text-center">
        <p className="text-lg text-slate-400">This outlet could not be found.</p>
        <button onClick={() => navigate('/')} className="mt-4 rounded-xl bg-cyan-500 px-4 py-2 font-semibold text-slate-950">
          Back home
        </button>
      </div>
    );
  }

  const handleReportQueue = async (outletId, status, queueCount) => {
  // Optimistic update
  updateOutlet(outletId, {
    queue_status: status,
    queue_count: queueCount,
    est_wait_minutes: queueCount * 5,
  });

  const { error } = await supabase.from('queue_reports').insert({
    outlet_id: outletId,
    queue_level: status,
    queue_count: queueCount,
  });

  if (error) {
    console.error('Failed to report queue:', error.message);
    return;
  }

  if (refetch) refetch();
};

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <button onClick={() => navigate('/')} className="mb-4 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300">
        ← Back
      </button>
      <OutletDetailCard outlet={outlet} onReportQueue={handleReportQueue} />
    </div>
  );
}