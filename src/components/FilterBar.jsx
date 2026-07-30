export default function FilterBar({ filters, setFilters, sortBy, setSortBy }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:flex-row sm:items-center sm:justify-between">
      <label className="flex items-center gap-2 text-sm text-slate-300">
        <input
          type="checkbox"
          checked={filters.openNow}
          onChange={(event) => setFilters((current) => ({ ...current, openNow: event.target.checked }))}
          className="rounded border-slate-700 bg-slate-950"
        />
        Open now
      </label>

      <label className="text-sm text-slate-300">
        <span className="mr-2">Brand</span>
        <select
          value={filters.brand}
          onChange={(event) => setFilters((current) => ({ ...current, brand: event.target.value }))}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
        >
          <option value="all">All brands</option>
          <option value="Shabuyaki">Shabuyaki</option>
          <option value="Sukiya">Sukiya</option>
          <option value="Samurai Yakiniku">Samurai Yakiniku</option>
          <option value="BBQ Town">BBQ Town</option>
        </select>
      </label>

      <label className="text-sm text-slate-300">
        <span className="mr-2">Queue</span>
        <select
          value={filters.queueStatus}
          onChange={(event) => setFilters((current) => ({ ...current, queueStatus: event.target.value }))}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
        >
          <option value="all">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>

      <label className="text-sm text-slate-300">
        <span className="mr-2">Sort by</span>
        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
        >
          <option value="queue">Shortest queue</option>
          <option value="distance">Nearest distance</option>
        </select>
      </label>
    </div>
  );
}