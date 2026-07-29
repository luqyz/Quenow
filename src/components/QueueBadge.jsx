const statusStyles = {
  low: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
  medium: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
  high: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
  unknown: 'bg-slate-500/15 text-slate-300 border-slate-500/40',
};

const statusLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  unknown: 'No data',
};

export default function QueueBadge({ status }) {
  const label = statusLabels[status] || 'No data';
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusStyles[status] || statusStyles.unknown}`}>
      {label} queue
    </span>
  );
}