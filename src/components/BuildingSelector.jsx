import React, { useEffect, useRef } from 'react';
import { FIME_BUILDINGS } from '../data/fimeBuildings3D';

export default function BuildingSelector({ selectedBuildingId, onSelectBuilding, onSelectCategory, activeCategory }) {
  const containerRef = useRef(null);
  const buttonRefs = useRef(new Map());

  // Desplazamiento automático suave hacia el botón del edificio o categoría seleccionada
  useEffect(() => {
    let targetEl = null;
    if (selectedBuildingId) {
      targetEl = buttonRefs.current.get(selectedBuildingId);
    } else if (activeCategory) {
      targetEl = buttonRefs.current.get(`cat-${activeCategory}`);
    } else {
      targetEl = buttonRefs.current.get('btn-all');
    }

    if (targetEl && containerRef.current) {
      targetEl.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  }, [selectedBuildingId, activeCategory]);

  return (
    <div
      ref={containerRef}
      className="w-full overflow-x-auto no-scrollbar py-1 px-1 flex items-center gap-1.5 scroll-smooth"
    >
      <button
        ref={(el) => buttonRefs.current.set('btn-all', el)}
        onClick={() => {
          onSelectBuilding(null, true);
          onSelectCategory(null);
        }}
        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all border ${
          !selectedBuildingId && !activeCategory
            ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md shadow-sky-500/20 font-bold'
            : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
        }`}
      >
        Todos
      </button>

      <button
        ref={(el) => buttonRefs.current.set('cat-Auditorio', el)}
        onClick={() => {
          onSelectBuilding(null);
          onSelectCategory('Auditorio');
        }}
        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all border ${
          activeCategory === 'Auditorio'
            ? 'bg-purple-500 text-slate-950 border-purple-400 shadow-md shadow-purple-500/20 font-bold'
            : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
        }`}
      >
        Auditorios
      </button>

      <button
        ref={(el) => buttonRefs.current.set('cat-Laboratorio', el)}
        onClick={() => {
          onSelectBuilding(null);
          onSelectCategory('Laboratorio');
        }}
        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all border ${
          activeCategory === 'Laboratorio'
            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20 font-bold'
            : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
        }`}
      >
        Laboratorios
      </button>

      <div className="w-[1px] h-4 bg-slate-800 shrink-0 mx-0.5" />

      {FIME_BUILDINGS.map((bld) => (
        <button
          key={bld.id}
          ref={(el) => buttonRefs.current.set(bld.id, el)}
          onClick={() => {
            onSelectBuilding(bld.id);
            onSelectCategory(null);
          }}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all border ${
            selectedBuildingId === bld.id
              ? 'bg-slate-100 text-slate-950 border-white shadow-md shadow-white/20 font-bold scale-[1.02]'
              : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          {bld.shortName}
        </button>
      ))}
    </div>
  );
}
