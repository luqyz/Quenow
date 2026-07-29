import { useState } from 'react';
import FilterBar from '../components/FilterBar';
import MapView from '../components/MapView';
import OutletList from '../components/OutletList';
import ViewToggle from '../components/ViewToggle';

export default function Home({ outlets, sortBy, setSortBy, filters, setFilters }) {
  const [view, setView] = useState('list');

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/20 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">QueNow</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Find a buffet spot before you leave.</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">Quick queue checks for nearby shabu-shabu and yakiniku outlets across Kuala Lumpur.</p>
        </div>
        <ViewToggle view={view} onChange={setView} />
      </div>

      <FilterBar filters={filters} setFilters={setFilters} sortBy={sortBy} setSortBy={setSortBy} />

      {view === 'list' ? <OutletList outlets={outlets} /> : <MapView outlets={outlets} />}
    </div>
  );
}
