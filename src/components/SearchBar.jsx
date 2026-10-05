import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin, Building, GraduationCap, Award } from 'lucide-react';
import { buscarSalones } from '../utils/searchEngine';

export default function SearchBar({ onSelectSalón, selectedSalón, salones }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (query.trim().length > 0) {
      const filtered = buscarSalones(query, salones);
      setResults(filtered.slice(0, 7)); // Mostrar máximo 7 sugerencias para velocidad
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query, salones]);

  // Si se selecciona desde fuera (ej. clic en mapa), actualizar input
  useEffect(() => {
    if (selectedSalón) {
      setQuery(selectedSalón.nombre);
      setIsOpen(false);
    }
  }, [selectedSalón]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (salon) => {
    setQuery(salon.nombre);
    setIsOpen(false);
    onSelectSalón(salon);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    onSelectSalón(null);
    inputRef.current?.focus();
  };

  const getItemBadgeColor = (tipo) => {
    switch (tipo) {
      case 'Auditorio':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Laboratorio':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl mx-auto z-40">
      <div className="relative flex items-center shadow-xl">
        <Search className="absolute left-4 w-5 h-5 text-sky-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length > 0 && setIsOpen(true)}
          placeholder="Busca por salón (ej. 1102, 7204), auditorio (Polivalente, Barragán) o lab..."
          className="w-full pl-12 pr-10 py-3.5 bg-slate-900/90 text-slate-100 placeholder-slate-400 text-sm md:text-base rounded-2xl border border-slate-700/80 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 outline-none backdrop-blur-xl transition-all shadow-inner"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3.5 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown de Sugerencias en Tiempo Real */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden divide-y divide-slate-800/60 max-h-80 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
          {results.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelect(item)}
              className="w-full px-4 py-3 text-left hover:bg-slate-800/80 transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-800 group-hover:bg-sky-500/20 text-sky-400 transition-colors">
                  {item.tipo === 'Auditorio' ? (
                    <Award className="w-4 h-4" />
                  ) : item.tipo === 'Laboratorio' ? (
                    <GraduationCap className="w-4 h-4" />
                  ) : (
                    <Building className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-slate-100 text-sm md:text-base group-hover:text-sky-300 transition-colors">
                    {item.nombre}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{item.edificioNombre}</span>
                    <span>•</span>
                    <span>{item.pisoTexto}</span>
                  </div>
                </div>
              </div>

              <span
                className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium ${getItemBadgeColor(
                  item.tipo
                )}`}
              >
                {item.tipo}
              </span>
            </button>
          ))}
        </div>
      )}

      {isOpen && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl text-center text-slate-400 text-sm shadow-2xl">
          No se encontró ningún salón o auditorio que coincida con "{query}".
        </div>
      )}
    </div>
  );
}
