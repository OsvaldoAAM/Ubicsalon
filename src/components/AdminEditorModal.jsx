import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Download, Save, X, Edit2, Trash2, CheckCircle2, Search, Filter, CheckSquare, Square, Trash, Copy, Building, Layers, RotateCcw } from 'lucide-react';
import { FIME_BUILDINGS } from '../data/fimeBuildings3D';

export default function AdminEditorModal({ isOpen, onClose, salonesList, onSaveSalones, onResetDefaults }) {
  const [salones, setSalones] = useState(salonesList);

  useEffect(() => {
    setSalones(salonesList);
  }, [salonesList]);
  const [filterEdificio, setFilterEdificio] = useState('ALL');
  const [filterTipo, setFilterTipo] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());

  const [activeTab, setActiveTab] = useState('LIST'); // 'LIST' | 'FORM'
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    codigo: '',
    tipo: 'Salón Estándar',
    edificioId: 'edificio-1',
    piso: 1,
    pisoTexto: 'Piso 1',
    descripcion: '',
    referencia: '',
    foto: '',
    tags: []
  });
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Filtrado reactivo de salones
  const filteredSalones = useMemo(() => {
    return salones.filter(item => {
      // Filtro de Edificio
      if (filterEdificio !== 'ALL' && item.edificioId !== filterEdificio) {
        return false;
      }
      // Filtro de Tipo
      if (filterTipo !== 'ALL' && item.tipo !== filterTipo) {
        return false;
      }
      // Buscador interno por código o nombre
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = item.nombre.toLowerCase().includes(q);
        const matchesCode = item.codigo.toLowerCase().includes(q);
        const matchesBuilding = item.edificioNombre.toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesBuilding) return false;
      }
      return true;
    });
  }, [salones, filterEdificio, filterTipo, searchQuery]);

  if (!isOpen) return null;

  // Selección múltiple
  const handleToggleSelect = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleSelectAllFiltered = () => {
    if (selectedIds.size === filteredSalones.length && filteredSalones.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredSalones.map(s => s.id)));
    }
  };

  // Eliminado Masivo
  const handleBulkDelete = () => {
    const count = selectedIds.size;
    if (count === 0) return;

    if (confirm(`¿Estás seguro de que deseas ELIMINAR MASIVAMENTE ${count} salón(es) seleccionado(s)?`)) {
      const updatedList = salones.filter(s => !selectedIds.has(s.id));
      setSalones(updatedList);
      onSaveSalones(updatedList);
      setSelectedIds(new Set());
    }
  };

  // Duplicado Masivo
  const handleBulkDuplicate = () => {
    if (selectedIds.size === 0) return;
    const itemsToDuplicate = salones.filter(s => selectedIds.has(s.id));
    const duplicatedItems = itemsToDuplicate.map(item => ({
      ...item,
      id: `sal-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      nombre: `${item.nombre} (Copia)`,
      codigo: `${item.codigo}-COPY`
    }));

    const updatedList = [...duplicatedItems, ...salones];
    setSalones(updatedList);
    onSaveSalones(updatedList);
    setSelectedIds(new Set());
  };

  // Eliminado Individual
  const handleDeleteSingle = (id) => {
    if (confirm('¿Eliminar este registro?')) {
      const updatedList = salones.filter(s => s.id !== id);
      setSalones(updatedList);
      onSaveSalones(updatedList);
      const next = new Set(selectedIds);
      next.delete(id);
      setSelectedIds(next);
    }
  };

  const handleOpenForm = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        id: `sal-${Date.now().toString().slice(-4)}`,
        nombre: '',
        codigo: '',
        tipo: 'Salón Estándar',
        edificioId: 'edificio-1',
        piso: 1,
        pisoTexto: 'Piso 1',
        descripcion: '',
        referencia: '',
        foto: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
        tags: []
      });
    }
    setActiveTab('FORM');
  };

  const handleSaveForm = (e) => {
    e.preventDefault();
    const edificioObj = FIME_BUILDINGS.find(b => b.id === formData.edificioId);
    const tagsArr = [
      formData.codigo.toLowerCase(),
      formData.nombre.toLowerCase(),
      edificioObj ? edificioObj.name.toLowerCase() : '',
      `piso ${formData.piso}`
    ].filter(Boolean);

    const updatedItem = {
      ...formData,
      edificioNombre: edificioObj ? edificioObj.name : formData.edificioId,
      tags: tagsArr
    };

    let updatedList;
    if (editingItem) {
      updatedList = salones.map(s => s.id === editingItem.id ? updatedItem : s);
    } else {
      updatedList = [updatedItem, ...salones];
    }

    setSalones(updatedList);
    onSaveSalones(updatedList);
    setEditingItem(null);
    setActiveTab('LIST');
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(salones, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'salones.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-2xl flex items-center justify-center p-3 md:p-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl h-[92vh] max-h-[850px] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-150">
        
        {/* TOP BAR: Título y Acciones Principales */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div>
            <h2 className="text-base md:text-lg font-bold text-slate-100 flex items-center gap-2">
              ⚙️ Gestión y Modificación de Salones FIME
            </h2>
            <p className="text-xs text-slate-400">
              Filtra por edificio, realiza eliminación masiva o exporta <code>salones.json</code>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onResetDefaults && (
              <button
                onClick={() => {
                  if (confirm('¿Restablecer salones al JSON original del proyecto?')) {
                    onResetDefaults();
                  }
                }}
                className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                title="Borrar cambios guardados localmente y cargar salones.json"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restablecer JSON</span>
              </button>
            )}
            <button
              onClick={handleExportJSON}
              className="bg-sky-500 hover:bg-sky-400 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
            >
              {downloadSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Download className="w-4 h-4" />}
              <span>{downloadSuccess ? '¡Descargado!' : 'Exportar JSON'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* NAVEGACIÓN SECUNDARIA Y FILTROS */}
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/60 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Tabs: Lista vs Agregar */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('LIST')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'LIST'
                  ? 'bg-sky-500 text-slate-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              📋 Lista y Edición ({salones.length})
            </button>
            <button
              onClick={() => handleOpenForm(null)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                activeTab === 'FORM'
                  ? 'bg-sky-500 text-slate-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{editingItem ? 'Editar Salón' : 'Nuevo Salón'}</span>
            </button>
          </div>

          {/* Filtros Rápido por Edificio y Buscador Interno */}
          {activeTab === 'LIST' && (
            <div className="flex flex-wrap md:flex-nowrap items-center gap-2 w-full md:w-auto">
              {/* Buscador de Tabla */}
              <div className="relative flex-1 md:w-56">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar código/nombre..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-2 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 outline-none focus:border-sky-500"
                />
              </div>

              {/* Filtro por Edificio */}
              <select
                value={filterEdificio}
                onChange={e => setFilterEdificio(e.target.value)}
                className="bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 px-2.5 py-1.5 outline-none focus:border-sky-500"
              >
                <option value="ALL">🏢 Todos los Edificios</option>
                {FIME_BUILDINGS.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>

              {/* Filtro por Tipo */}
              <select
                value={filterTipo}
                onChange={e => setFilterTipo(e.target.value)}
                className="bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 px-2.5 py-1.5 outline-none focus:border-sky-500"
              >
                <option value="ALL">🔖 Todos los Tipos</option>
                <option value="Salón Estándar">Salón Estándar</option>
                <option value="Auditorio">Auditorios</option>
                <option value="Laboratorio">Laboratorios</option>
              </select>
            </div>
          )}
        </div>

        {/* CONTENIDO PRINCIPAL DE PANTALLA */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'LIST' ? (
            <div className="space-y-3">
              {/* Barra de Acciones Masivas */}
              <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-2xl border border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSelectAllFiltered}
                    className="flex items-center gap-1.5 text-slate-300 font-semibold hover:text-white"
                  >
                    {selectedIds.size === filteredSalones.length && filteredSalones.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-sky-400" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-500" />
                    )}
                    <span>Seleccionar Todos ({filteredSalones.length})</span>
                  </button>

                  {selectedIds.size > 0 && (
                    <span className="text-sky-400 font-bold bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
                      {selectedIds.size} seleccionados
                    </span>
                  )}
                </div>

                {/* Botón de Eliminación Masiva y Duplicado */}
                {selectedIds.size > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleBulkDuplicate}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 border border-slate-700"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Duplicar</span>
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className="bg-rose-500 hover:bg-rose-400 text-slate-950 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all shadow-md shadow-rose-500/20"
                    >
                      <Trash className="w-3.5 h-3.5" />
                      <span>Eliminar Seleccionados ({selectedIds.size})</span>
                    </button>
                  </div>
                )}
              </div>

              {/* TABLA / LISTADO DE SALONES */}
              {filteredSalones.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  No se encontraron salones con los filtros aplicados.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredSalones.map(item => {
                    const isSelected = selectedIds.has(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-sky-950/40 border-sky-500/60 shadow-md'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleToggleSelect(item.id)}
                            className="text-slate-400 hover:text-sky-400"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-sky-400" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-600" />
                            )}
                          </button>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-100 text-xs md:text-sm">
                                {item.nombre}
                              </span>
                              <span className="text-[10px] px-2 py-0.2 rounded-full border bg-slate-900 text-slate-300 border-slate-700">
                                {item.codigo}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                              <Building className="w-3 h-3 text-slate-500" />
                              <span>{item.edificioNombre}</span>
                              <span>•</span>
                              <Layers className="w-3 h-3 text-slate-500" />
                              <span>{item.pisoTexto}</span>
                            </div>
                          </div>
                        </div>

                        {/* Botones de acción individual */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenForm(item)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-slate-800"
                            title="Editar Salón"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSingle(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                            title="Eliminar Salón"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* FORMULARIO DE AGREGAR / EDITAR SALÓN */
            <div className="max-w-xl mx-auto bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-2">
                {editingItem ? '✏️ Editar Salón Existente' : '➕ Registrar Nuevo Salón'}
              </h3>

              <form onSubmit={handleSaveForm} className="space-y-3">
                <div>
                  <label className="text-[11px] text-slate-400 font-medium block mb-1">Nombre Completo del Salón / Auditorio</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Salón 1105 / Auditorio Polivalente"
                    value={formData.nombre}
                    onChange={e => setFormData({...formData, nombre: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-400 font-medium block mb-1">Código / Nomenclatura</label>
                    <input
                      type="text"
                      required
                      placeholder="ej. 1105 / POLIVALENTE"
                      value={formData.codigo}
                      onChange={e => setFormData({...formData, codigo: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-medium block mb-1">Tipo de Aula</label>
                    <select
                      value={formData.tipo}
                      onChange={e => setFormData({...formData, tipo: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                    >
                      <option value="Salón Estándar">Salón Estándar</option>
                      <option value="Auditorio">Auditorio</option>
                      <option value="Laboratorio">Laboratorio</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-400 font-medium block mb-1">Edificio</label>
                    <select
                      value={formData.edificioId}
                      onChange={e => setFormData({...formData, edificioId: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                    >
                      {FIME_BUILDINGS.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 font-medium block mb-1">Número de Piso</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={formData.piso}
                      onChange={e => setFormData({
                        ...formData, 
                        piso: parseInt(e.target.value) || 1,
                        pisoTexto: `Piso ${e.target.value}`
                      })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-medium block mb-1">Descripción corta</label>
                  <textarea
                    rows="2"
                    placeholder="Capacidad o equipamiento..."
                    value={formData.descripcion}
                    onChange={e => setFormData({...formData, descripcion: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-medium block mb-1">Referencia para ubicarlo</label>
                  <input
                    type="text"
                    placeholder="ej. En el pasillo derecho al lado de la biblioteca"
                    value={formData.referencia}
                    onChange={e => setFormData({...formData, referencia: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-medium block mb-1">URL Fotografía Exterior</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.foto}
                    onChange={e => setFormData({...formData, foto: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="pt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('LIST')}
                    className="w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl text-xs font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Salón</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
