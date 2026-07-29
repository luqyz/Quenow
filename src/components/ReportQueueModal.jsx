import { useState } from 'react';

export default function ReportQueueModal({ isOpen, onClose, onSubmit }) {
  const [queueCount, setQueueCount] = useState('');

  if (!isOpen) return null;

  const getStatusFromCount = (count) => {
    if (count <= 3) return 'low';
    if (count <= 10) return 'medium';
    return 'high';
  };

  const handleSave = () => {
    const count = parseInt(queueCount, 10);
    if (isNaN(count) || count < 0) return;
    const status = getStatusFromCount(count);
    onSubmit(status, count);
    setQueueCount('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl">
        <h3 className="text-xl font-semibold text-white">Report current queue</h3>
        <p className="mt-2 text-sm text-slate-400">How many people/groups are currently waiting?</p>

        <div className="mt-4">
          <input
            type="number"
            min="0"
            value={queueCount}
            onChange={(e) => setQueueCount(e.target.value)}
            placeholder="e.g. 8"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
          />
          {queueCount && !isNaN(parseInt(queueCount, 10)) && (
            <p className="mt-2 text-sm text-slate-400">
              Estimated wait: <span className="text-cyan-300 font-semibold">{parseInt(queueCount, 10) * 5} min</span>
            </p>
          )}
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!queueCount}
            className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-40"
          >
            Save update
          </button>
        </div>
      </div>
    </div>
  );
}