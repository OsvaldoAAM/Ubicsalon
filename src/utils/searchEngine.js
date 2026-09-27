import Fuse from 'fuse.js';
import salonesData from '../data/salones.json';

// Configuración avanzada de Fuse.js para tolerancia a faltas y coincidencias rápidas
const options = {
  includeScore: true,
  threshold: 0.4, // Tolerancia a faltas de ortografía
  distance: 100,
  keys: [
    { name: 'codigo', weight: 0.4 },
    { name: 'nombre', weight: 0.35 },
    { name: 'edificioNombre', weight: 0.15 },
    { name: 'tags', weight: 0.1 }
  ]
};

const fuse = new Fuse(salonesData, options);

export function buscarSalones(query) {
  if (!query || query.trim() === '') {
    return salonesData;
  }

  const cleanQuery = query.trim();
  
  // Búsqueda directa por coincidencia de código exacto primero
  const exactMatches = salonesData.filter(s => 
    s.codigo.toLowerCase() === cleanQuery.toLowerCase() ||
    s.nombre.toLowerCase().includes(cleanQuery.toLowerCase())
  );

  if (exactMatches.length > 0 && cleanQuery.length >= 3) {
    // Si hay coincidencia exacta de código, priorizarla
    const fuzzyResults = fuse.search(cleanQuery).map(result => result.item);
    // Unir sin duplicados
    const combined = [...exactMatches, ...fuzzyResults];
    return Array.from(new Set(combined.map(a => a.id)))
      .map(id => combined.find(a => a.id === id));
  }

  const results = fuse.search(cleanQuery);
  return results.map(result => result.item);
}

export function obtenerSalonesPorEdificio(edificioId) {
  if (!edificioId) return salonesData;
  return salonesData.filter(s => s.edificioId === edificioId);
}

export function obtenerSalonesDataset() {
  return salonesData;
}
