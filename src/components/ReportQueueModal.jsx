import { useState } from 'react';

export default function ReportQueueModal({ isOpen, onClose, onSubmit }) {
  const [selectedStatus, setSelectedStatus] = useState('medium');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl">
        <h3 className="text-xl font-semibold text-white">Report current queue</h3>
        <p className="mt-2 text-sm text-slate-400">Help the next diners by sharing what you saw on arrival.</p>

        <div className="mt-4 space-y-2">
          {['low', 'medium', 'high'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`w-full rounded-xl border px-3 py-2 text-left capitalize ${selectedStatus === status ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300' : 'border-slate-700 bg-slate-950 text-slate-300'}`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300">
            Cancel
          </button>
          <button
            onClick={() => {
              onSubmit(selectedStatus);
              onClose();
            }}
            className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950"
          >
            Save update
          </button>
        </div>
      </div>
    </div>
  );
}
