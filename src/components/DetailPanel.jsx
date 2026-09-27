import React from 'react';
import { Building, Layers, MapPin, Info, X, ExternalLink, Image as ImageIcon } from 'lucide-react';

export default function DetailPanel({ salon, onClose }) {
  if (!salon) return null;

  return (
    <div className="w-full bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-3xl p-5 md:p-6 shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
      {/* Header del Panel */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/20">
            {salon.tipo}
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-slate-100 mt-2">
            {salon.nombre}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Cerrar detalles"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Grid de Contenido y Datos Destacados */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
        {/* Fotografía de Referencia Exterior */}
        <div className="relative group overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 aspect-video md:aspect-auto h-48 md:h-full">
          {salon.foto ? (
            <img
              src={salon.foto}
              alt={`Foto de ${salon.nombre}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 gap-2">
              <ImageIcon className="w-8 h-8" />
              <span className="text-xs">Sin fotografía asignada</span>
            </div>
          )}
          <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] text-slate-300 border border-slate-700/50">
            Vista Exterior / Referencia
          </div>
        </div>

        {/* Información Técnica del Salón */}
        <div className="flex flex-col justify-between space-y-4">
          {/* Cards de Edificio y Piso */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-2xl flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">Edificio</span>
                <span className="text-sm font-bold text-slate-100">{salon.edificioNombre}</span>
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-2xl flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">Piso / Nivel</span>
                <span className="text-sm font-bold text-slate-100">{salon.pisoTexto}</span>
              </div>
            </div>
          </div>

          {/* Descripción y Referencias de Ubicación */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Info className="w-4 h-4 text-sky-400" />
              <span>Descripción del Salón</span>
            </div>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              {salon.descripcion}
            </p>
          </div>

          {salon.referencia && (
            <div className="flex items-start gap-2 bg-sky-950/30 border border-sky-800/40 p-3 rounded-xl text-xs text-sky-200">
              <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span><strong>Cómo ubicarlo:</strong> {salon.referencia}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
