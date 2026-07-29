import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';

const markerColors = {
  low: '#22c55e',
  medium: '#facc15',
  high: '#ef4444',
};

const createIcon = (color) =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

export default function MapView({ outlets }) {
  const center = [3.12, 101.65];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-2">
      <MapContainer center={center} zoom={11} scrollWheelZoom className="z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {outlets.map((outlet) => (
          <Marker key={outlet.id} position={[outlet.lat, outlet.lng]} icon={createIcon(markerColors[outlet.queue_status])}>
            <Popup>
              <div className="space-y-2 text-slate-800">
                <p className="font-semibold">{outlet.name}</p>
                <p className="text-sm">{outlet.branch}</p>
                <p className="text-sm">Queue: {outlet.queue_status}</p>
                <p className="text-sm">Wait: {outlet.est_wait_minutes} min</p>
                <Link to={`/outlets/${outlet.id}`} className="text-sm font-semibold text-cyan-600">
                  View details
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
