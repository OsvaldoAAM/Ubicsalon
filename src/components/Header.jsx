import React, { useState, useEffect } from 'react';
import { Compass, Wifi, WifiOff, Settings } from 'lucide-react';

export default function Header({ onOpenAdmin }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="w-full bg-slate-900/85 backdrop-blur-2xl border border-slate-800/80 rounded-2xl px-3.5 py-2.5 flex items-center justify-between shadow-2xl">
      {/* Brand & Logo */}
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20">
          <Compass className="w-4 h-4" />
        </div>
        <div>
          <h1 className="text-sm font-black text-slate-100 tracking-tight flex items-center gap-1.5">
            Ubicsalon <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-1.5 py-0.2 rounded-md border border-sky-500/20">FIME</span>
          </h1>
        </div>
      </div>

      {/* Right Controls: Offline Badge + Admin Button */}
      <div className="flex items-center gap-2">
        <div className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 border backdrop-blur-md ${
          isOnline
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
        }`}>
          {isOnline ? (
            <>
              <Wifi className="w-3 h-3 text-emerald-400" />
              <span>Offline Ready</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
              <span>Offline</span>
            </>
          )}
        </div>

        <button
          onClick={onOpenAdmin}
          className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/70 transition-all text-xs"
          title="Panel Editor"
        >
          <Settings className="w-3.5 h-3.5 text-sky-400" />
        </button>
      </div>
    </header>
  );
}
