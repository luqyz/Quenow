import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Shabu-shabu & Yakiniku</p>
      <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">Welcome to QueNow</h1>
      <p className="mt-4 max-w-md text-slate-400">
        Check real-time queue status at your favorite hotpot and grill outlets before you leave home.
      </p>
      <button
        onClick={() => navigate('/outlets')}
        className="mt-8 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
      >
        Get Started →
      </button>
    </div>
  );
}