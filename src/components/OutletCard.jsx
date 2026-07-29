import { Link } from 'react-router-dom';
import QueueBadge from './QueueBadge';

export default function OutletCard({ outlet }) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg shadow-slate-950/30">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{outlet.name}</h3>
          <p className="text-sm text-slate-400">{outlet.branch}</p>
        </div>
        <QueueBadge status={outlet.queue_status} />
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
        <span>{outlet.distance_km.toFixed(1)} km away</span>
        <span>{outlet.est_wait_minutes} min wait</span>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
        <span>{outlet.queue_count} in queue</span>
        <span>Updated {outlet.last_updated} min ago</span>
      </div>

      <Link to={`/outlets/${outlet.id}`} className="mt-4 inline-flex text-sm font-medium text-cyan-400 hover:text-cyan-300">
        View details →
      </Link>
    </article>
  );
}
