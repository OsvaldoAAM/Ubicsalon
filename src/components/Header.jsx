import React, { useState, useEffect } from 'react';
import { Compass, Wifi, WifiOff, Settings } from 'lucide-react';

export default function Header({ onOpenAdmin, showAdminButton = false }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [clickCount, setClickCount] = useState(0);
  const [unlockedAdmin, setUnlockedAdmin] = useState(showAdminButton);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Detectar ?admin=1 o #admin en la URL
    if (window.location.search.includes('admin') || window.location.hash.includes('admin')) {
      setUnlockedAdmin(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (showAdminButton) setUnlockedAdmin(true);
  }, [showAdminButton]);

  const handleSecretClick = () => {
    const next = clickCount + 1;
    if (next >= 3) {
      setUnlockedAdmin(true);
      onOpenAdmin();
      setClickCount(0);
    } else {
      setClickCount(next);
      setTimeout(() => setClickCount(0), 2000);
    }
  };

  return (
    <header className="w-full bg-neutral-900/85 backdrop-blur-2xl border border-neutral-800/80 rounded-2xl px-3.5 py-2.5 flex items-center justify-between shadow-2xl">
      {/* Brand & Logo (3 clics en el logo abren el modo admin secreto) */}
      <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={handleSecretClick}>
        <div className="p-1.5 rounded-xl bg-gradient-to-tr from-primary-500 to-indigo-600 text-white shadow-md shadow-primary-500/20">
          <Compass className="w-4 h-4" />
        </div>
        <div>
          <h1 className="text-sm font-black text-neutral-100 tracking-tight flex items-center gap-1.5">
            Ubicsalon <span className="text-[10px] font-bold text-primary-400 bg-primary-500/10 px-1.5 py-0.2 rounded-md border border-primary-500/20">FIME</span>
          </h1>
        </div>
      </div>

      {/* Right Controls: Offline Badge + Botón Admin (solo si se activó por URL o gesto secreto) */}
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

        {unlockedAdmin && (
          <button
            onClick={onOpenAdmin}
            className="p-1.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 border border-neutral-700/70 transition-all text-xs"
            title="Panel Editor Privado"
          >
            <Settings className="w-3.5 h-3.5 text-primary-400" />
          </button>
        )}
      </div>
    </header>
  );
}

