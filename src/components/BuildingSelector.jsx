import React from 'react';
import { FIME_BUILDINGS } from '../data/fimeBuildings3D';

export default function BuildingSelector({ selectedBuildingId, onSelectBuilding, onSelectCategory, activeCategory }) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2 px-1 flex items-center gap-2">
      <button
        onClick={() => {
          onSelectBuilding(null);
          onSelectCategory(null);
        }}
        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
          !selectedBuildingId && !activeCategory
            ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-lg shadow-sky-500/25'
            : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
        }`}
      >
        🌟 Todos
      </button>

      <button
        onClick={() => {
          onSelectBuilding(null);
          onSelectCategory('Auditorio');
        }}
        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
          activeCategory === 'Auditorio'
            ? 'bg-purple-500 text-slate-950 border-purple-400 shadow-lg shadow-purple-500/25'
            : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
        }`}
      >
        🏛️ Auditorios
      </button>

      <button
        onClick={() => {
          onSelectBuilding(null);
          onSelectCategory('Laboratorio');
        }}
        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
          activeCategory === 'Laboratorio'
            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/25'
            : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
        }`}
      >
        🧪 Laboratorios
      </button>

      <div className="w-[1px] h-5 bg-slate-800 shrink-0 mx-1" />

      {FIME_BUILDINGS.map((bld) => (
        <button
          key={bld.id}
          onClick={() => {
            onSelectBuilding(bld.id);
            onSelectCategory(null);
          }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
            selectedBuildingId === bld.id
              ? 'bg-slate-100 text-slate-950 border-white shadow-lg shadow-white/20'
              : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          {bld.shortName}
        </button>
      ))}
    </div>
  );
}
