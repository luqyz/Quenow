import { useMemo, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import QueueBadge from './QueueBadge';
import ReportQueueModal from './ReportQueueModal';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const createIcon = (color) =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

function formatLastUpdated(timestamp) {
  if (!timestamp) return 'No data yet';

  const reportedTime = new Date(timestamp);
  const now = new Date();
  const diffMs = now - reportedTime;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;

  return reportedTime.toLocaleString('en-MY', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function OutletDetail({ outlet, onReportQueue }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const chartData = useMemo(() => {
    return outlet.hourly_trend.map((value, index) => ({ hour: `${index}:00`, value }));
  }, [outlet.hourly_trend]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Queue snapshot</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">{outlet.name}</h2>
            <p className="mt-1 text-slate-400">{outlet.branch}</p>
          </div>
          <QueueBadge status={outlet.queue_status} />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-sm text-slate-400">Address</p>
            <p className="mt-1 text-white">{outlet.address}</p>
            <p className="mt-4 text-sm text-slate-400">Operating hours</p>
            <p className="mt-1 text-white">{outlet.operating_hours}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-sm text-slate-400">Current queue</p>
            <p className="mt-1 text-3xl font-semibold text-white">{outlet.queue_count}</p>
            <p className="mt-4 text-sm text-slate-400">Estimated wait</p>
            <p className="mt-1 text-2xl font-semibold text-white">{outlet.est_wait_minutes} min</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-xl bg-cyan-500 px-4 py-2 font-semibold text-slate-950"
          >
            Report queue
          </button>
          <span className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-400">
            Last updated: {formatLastUpdated(outlet.last_updated)}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
          <h3 className="text-lg font-semibold text-white">Busy hours</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="hour" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#22d3ee" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
          <h3 className="text-lg font-semibold text-white">Location</h3>
          <div className="mt-4 overflow-hidden rounded-2xl">
            <MapContainer center={[outlet.lat, outlet.lng]} zoom={14} scrollWheelZoom={false} className="z-0">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[outlet.lat, outlet.lng]} icon={createIcon('#38bdf8')}>
                <Popup>{outlet.name}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>

      <ReportQueueModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(status, count) => onReportQueue(outlet.id, status, count)}
      />
    </div>
  );
}
