export default function ViewToggle({ view, onChange }) {
  const options = ['list', 'map'];

  return (
    <div className="inline-flex rounded-full border border-slate-800 bg-slate-900/80 p-1">
      {options.map((option) => {
        const label = option === 'list' ? 'List View' : 'Map View';
        const isActive = view === option;

        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${isActive ? 'bg-cyan-500 text-slate-950' : 'text-slate-300'}`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
