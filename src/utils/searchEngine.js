import Fuse from 'fuse.js';
import defaultSalonesData from '../data/salones.json';

const options = {
  includeScore: true,
  threshold: 0.4,
  distance: 100,
  keys: [
    { name: 'codigo', weight: 0.4 },
    { name: 'nombre', weight: 0.35 },
    { name: 'edificioNombre', weight: 0.15 },
    { name: 'tags', weight: 0.1 }
  ]
};

export function buscarSalones(query, salonesList = defaultSalonesData) {
  if (!query || query.trim() === '') {
    return salonesList;
  }

  const cleanQuery = query.trim();
  const fuse = new Fuse(salonesList, options);
  
  // Búsqueda directa por coincidencia de código exacto primero
  const exactMatches = salonesList.filter(s => 
    s.codigo.toLowerCase() === cleanQuery.toLowerCase() ||
    s.nombre.toLowerCase().includes(cleanQuery.toLowerCase())
  );

  if (exactMatches.length > 0 && cleanQuery.length >= 3) {
    const fuzzyResults = fuse.search(cleanQuery).map(result => result.item);
    const combined = [...exactMatches, ...fuzzyResults];
    return Array.from(new Set(combined.map(a => a.id)))
      .map(id => combined.find(a => a.id === id));
  }

  const results = fuse.search(cleanQuery);
  return results.map(result => result.item);
}

export function obtenerSalonesPorEdificio(edificioId, salonesList = defaultSalonesData) {
  if (!edificioId) return salonesList;
  return salonesList.filter(s => s.edificioId === edificioId);
}

export function obtenerSalonesDataset() {
  return defaultSalonesData;
}

