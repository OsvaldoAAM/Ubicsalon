import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import IsometricMap from './components/IsometricMap';
import DetailPanel from './components/DetailPanel';
import BuildingSelector from './components/BuildingSelector';
import AdminEditorModal from './components/AdminEditorModal';
import initialSalonesData from './data/salones.json';
import { FIME_BUILDINGS } from './data/fimeBuildings3D';
import { Sparkles, Building2, ChevronUp, ChevronDown, MapPin } from 'lucide-react';

export default function App() {
  const [salones, setSalones] = useState(() => {
    const saved = localStorage.getItem('ubicsalon_custom_data');
    return saved ? JSON.parse(saved) : initialSalonesData;
  });

  const [selectedSalón, setSelectedSalón] = useState(null);
  const [selectedBuildingId, setSelectedBuildingId] = useState(null);
  const [selectedPiso, setSelectedPiso] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isListExpanded, setIsListExpanded] = useState(false);
  const [resetCamCount, setResetCamCount] = useState(0);

  useEffect(() => {
    if (window.location.search.includes('admin') || window.location.hash.includes('admin')) {
      setIsAdminOpen(true);
    }
  }, []);

  const handleSelectSalón = (salon) => {
    setSelectedSalón(salon);
    if (salon) {
      setSelectedBuildingId(salon.edificioId);
      setSelectedPiso(salon.piso);
      setIsListExpanded(false);
    } else {
      setSelectedBuildingId(null);
      setSelectedPiso(null);
    }
  };

  const handleSelectBuilding = (buildingId, shouldResetCam = false) => {
    setSelectedBuildingId(buildingId);
    setActiveCategory(null);
    if (buildingId) {
      if (selectedSalón && selectedSalón.edificioId !== buildingId) {
        setSelectedSalón(null);
        setSelectedPiso(null);
      }
    } else {
      setSelectedSalón(null);
      setSelectedPiso(null);
    }
    if (shouldResetCam) {
      setResetCamCount((c) => c + 1);
    }
  };

  const handleSaveSalones = (updatedList) => {
    setSalones(updatedList);
    localStorage.setItem('ubicsalon_custom_data', JSON.stringify(updatedList));
  };

  const handleResetSalones = () => {
    localStorage.removeItem('ubicsalon_custom_data');
    setSalones(initialSalonesData);
  };

  const displayedSalones = salones.filter((s) => {
    if (selectedBuildingId && s.edificioId !== selectedBuildingId) return false;
    if (activeCategory && s.tipo !== activeCategory) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 w-full h-full bg-background text-neutral-100 font-sans select-none overflow-hidden">
      {/* CAPA BASE (z-0): Mapa 3D 100% Interactivo */}
      <IsometricMap
        selectedBuildingId={selectedBuildingId}
        selectedPiso={selectedPiso}
        onSelectBuilding={handleSelectBuilding}
        resetCamTrigger={resetCamCount}
      />

      {/* CAPA FLOTANTE SUPERIOR (Z-20): Header + Buscador + Filtros en formato compacto */}
      <div className="fixed top-3 left-3 right-3 z-20 max-w-md mx-auto pointer-events-none flex flex-col gap-2">
        <div className="pointer-events-auto flex items-center gap-2">
          <Header onOpenAdmin={() => setIsAdminOpen(true)} />
        </div>

        <div className="pointer-events-auto">
          <SearchBar onSelectSalón={handleSelectSalón} selectedSalón={selectedSalón} salones={salones} />
        </div>

        <div className="pointer-events-auto bg-neutral-900/80 backdrop-blur-xl rounded-2xl border border-neutral-800/80 px-1 py-0.5 shadow-lg">
          <BuildingSelector
            selectedBuildingId={selectedBuildingId}
            onSelectBuilding={handleSelectBuilding}
            onSelectCategory={setActiveCategory}
            activeCategory={activeCategory}
          />
        </div>
      </div>

      {/* CAPA FLOTANTE INFERIOR (Z-20): Bottom Sheet */}
      <div className="fixed bottom-3 left-3 right-3 z-20 max-w-md mx-auto pointer-events-none">
        {selectedSalón ? (
          <div className="pointer-events-auto">
            <DetailPanel salon={selectedSalón} onClose={() => handleSelectSalón(null)} />
          </div>
        ) : (
          <div className="pointer-events-auto inline-block w-full">
            <div className="bg-neutral-900/90 backdrop-blur-2xl border border-neutral-800/90 rounded-3xl p-3 shadow-2xl">
              {/* Encabezado Desplegable */}
              <div
                onClick={() => setIsListExpanded(!isListExpanded)}
                className="flex items-center justify-between cursor-pointer py-1 px-1"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-primary-400" />
                  <h3 className="text-xs font-bold text-neutral-200">
                    {selectedBuildingId
                      ? `Salones en ${FIME_BUILDINGS.find((b) => b.id === selectedBuildingId)?.name}`
                      : activeCategory
                      ? `${activeCategory}s`
                      : 'Salones FIME'}
                  </h3>
                  <span className="text-[10px] font-bold text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded-full border border-primary-500/20">
                    {displayedSalones.length} disponibles
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-neutral-400 bg-neutral-800/80 px-2 py-0.5 rounded-full">
                  <span>{isListExpanded ? 'Ocultar' : 'Ver lista'}</span>
                  {isListExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                </div>
              </div>

              {/* Lista expandible */}
              {isListExpanded && (
                <div className="space-y-2 max-h-60 overflow-y-auto mt-2.5 pr-1 scrollable-panel">
                  {displayedSalones.map((item) => (
                    <div
                      key={item.id}
                      className="w-full p-2.5 bg-neutral-950/80 hover:bg-neutral-800/90 border border-neutral-800/80 hover:border-primary-500/50 rounded-2xl transition-all flex items-center justify-between gap-2"
                    >
                      <div
                        onClick={() => handleSelectSalón(item)}
                        className="flex-1 cursor-pointer min-w-0 pr-1"
                      >
                        <div className="font-bold text-xs sm:text-sm text-neutral-200 hover:text-primary-300 transition-colors truncate">
                          {item.nombre}
                        </div>
                        <div className="text-[11px] text-neutral-400 flex items-center gap-1.5 mt-0.5 truncate">
                          <Building2 className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                          <span className="truncate">{item.edificioNombre}</span>
                          <span>•</span>
                          <span className="shrink-0">{item.pisoTexto}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectBuilding(item.edificioId);
                          setSelectedPiso(item.piso);
                          setSelectedSalón(null);
                          setIsListExpanded(false);
                        }}
                        className="bg-neutral-800/90 hover:bg-neutral-700 active:bg-neutral-600 text-primary-400 border border-primary-500/30 hover:border-primary-400/60 px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 shrink-0 touch-manipulation cursor-pointer"
                        title="Ubicar en el mapa 3D"
                      >
                        <MapPin className="w-4 h-4 text-primary-400" />
                        <span>Ubicar</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal Editor de Datos */}
      <AdminEditorModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        salonesList={salones}
        onSaveSalones={handleSaveSalones}
        onResetDefaults={handleResetSalones}
      />
    </div>
  );
}
