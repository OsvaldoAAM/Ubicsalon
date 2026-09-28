// Geometría y distribución espacial 3D de los edificios del campus FIME (UANL)
// Basado en el mapa real de la facultad
export const FIME_BUILDINGS = [
  {
    id: "edificio-1",
    name: "Edificio 1",
    shortName: "E1",
    color: "#3b82f6", // Azul
    highlightColor: "#60a5fa",
    floors: 3,
    position: { x: 7, y: 0, z: 8 },
    size: { width: 6, height: 2.2, depth: 2.5 },
    labelPos: { x: 7, y: 3, z: 8 }
  },
  {
    id: "edificio-2",
    name: "Edificio 2",
    shortName: "E2",
    color: "#10b981", // Esmeralda
    highlightColor: "#34d399",
    floors: 3,
    position: { x: 6, y: 0, z: 4 },
    size: { width: 6, height: 2.2, depth: 2.5 },
    labelPos: { x: 6, y: 3, z: 4 }
  },
  {
    id: "edificio-3",
    name: "Edificio 3",
    shortName: "E3",
    color: "#f59e0b", // Ámbar
    highlightColor: "#fbbf24",
    floors: 2,
    position: { x: 8, y: 0, z: 0 },
    size: { width: 9, height: 1.6, depth: 2.5 },
    labelPos: { x: 8, y: 2.5, z: 0 }
  },
  {
    id: "edificio-4",
    name: "Edificio 4",
    shortName: "E4",
    color: "#8b5cf6", // Púrpura
    highlightColor: "#a78bfa",
    floors: 3,
    position: { x: 3, y: 0, z: -5 },
    size: { width: 6, height: 2.2, depth: 5 },
    labelPos: { x: 3, y: 3, z: -5 }
  },
  {
    id: "edificio-5",
    name: "Edificio 5",
    shortName: "E5",
    color: "#ec4899", // Rosa
    highlightColor: "#f472b6",
    floors: 3,
    position: { x: -9, y: 0, z: 3 },
    size: { width: 4, height: 2.2, depth: 8 },
    labelPos: { x: -9, y: 3, z: 3 }
  },
  {
    id: "edificio-6",
    name: "Edificio 6",
    shortName: "E6",
    color: "#06b6d4", // Cyan
    highlightColor: "#22d3ee",
    floors: 3,
    position: { x: -7, y: 0, z: 0 },
    size: { width: 3, height: 2.2, depth: 3 },
    labelPos: { x: -7, y: 3, z: 0 }
  },
  {
    id: "edificio-7",
    name: "Edificio 7",
    shortName: "E7",
    color: "#6366f1", // Índigo
    highlightColor: "#818cf8",
    floors: 4,
    position: { x: -16, y: 0, z: 4 },
    size: { width: 8, height: 2.8, depth: 10 },
    labelPos: { x: -16, y: 3.5, z: 4 }
  },
  {
    id: "edificio-8",
    name: "Edificio 8",
    shortName: "E8",
    color: "#f43f5e", // Rose
    highlightColor: "#fb7185",
    floors: 2,
    position: { x: -18, y: 0, z: -5 },
    size: { width: 3, height: 1.6, depth: 6 },
    labelPos: { x: -18, y: 2.5, z: -5 }
  },
  {
    id: "edificio-9",
    name: "Edificio 9",
    shortName: "E9",
    color: "#84cc16", // Lime
    highlightColor: "#a3e635",
    floors: 3,
    position: { x: 13.5, y: 0, z: 2 },
    size: { width: 2.5, height: 2.2, depth: 5 },
    labelPos: { x: 13.5, y: 3, z: 2 }
  },
  {
    id: "edificio-11",
    name: "Edificio 11",
    shortName: "E11",
    color: "#14b8a6", // Teal
    highlightColor: "#2dd4bf",
    floors: 3,
    position: { x: 11, y: 0, z: 6 },
    size: { width: 3.5, height: 2.2, depth: 2.5 },
    labelPos: { x: 11, y: 3, z: 6 }
  },
  {
    id: "edificio-12",
    name: "Edificio 12",
    shortName: "E12",
    color: "#f97316", // Naranja
    highlightColor: "#fb923c",
    floors: 2,
    position: { x: -12, y: 0, z: -5 },
    size: { width: 7, height: 1.6, depth: 3 },
    labelPos: { x: -12, y: 2.5, z: -5 }
  },
  {
    id: "polideportivo",
    name: "Polideportivo FIME",
    shortName: "Poli",
    color: "#e2e8f0", // Blanco / Slate claro
    highlightColor: "#f1f5f9",
    floors: 4,
    position: { x: -5, y: 0, z: -14 },
    size: { width: 8, height: 3.5, depth: 7 },
    labelPos: { x: -5, y: 4.5, z: -14 }
  },
  {
    id: "biblioteca",
    name: "Biblioteca",
    shortName: "Biblio",
    color: "#eab308", // Amarillo
    highlightColor: "#facc15",
    floors: 3,
    position: { x: -4, y: 0, z: -5 },
    size: { width: 5, height: 2.5, depth: 5 },
    labelPos: { x: -4, y: 3.5, z: -5 }
  },
  {
    id: "cafeteria",
    name: "Cafetería",
    shortName: "Café",
    color: "#a855f7", // Morado claro
    highlightColor: "#c084fc",
    floors: 1,
    position: { x: 0, y: 0, z: 2 },
    size: { width: 4, height: 1.2, depth: 3 },
    labelPos: { x: 0, y: 2, z: 2 }
  },
  {
    id: "posgrado",
    name: "Aulas de Posgrado",
    shortName: "Posgrado",
    color: "#0ea5e9", // Azul claro
    highlightColor: "#38bdf8",
    floors: 3,
    position: { x: -9, y: 0, z: 11 },
    size: { width: 4, height: 2.5, depth: 4 },
    labelPos: { x: -9, y: 3.5, z: 11 }
  },
  {
    id: "cidet",
    name: "Auditorio CIDET",
    shortName: "CIDET",
    color: "#64748b", // Gris azulado
    highlightColor: "#94a3b8",
    floors: 4,
    position: { x: -4, y: 0, z: 10 },
    size: { width: 3, height: 3.0, depth: 4 },
    labelPos: { x: -4, y: 4, z: 10 }
  },
  {
    id: "ccpi",
    name: "CCPI",
    shortName: "CCPI",
    color: "#10b981", // Esmeralda
    highlightColor: "#34d399",
    floors: 2,
    position: { x: 13, y: 0, z: 9 },
    size: { width: 3, height: 1.8, depth: 4 },
    labelPos: { x: 13, y: 2.5, z: 9 }
  },
  {
    id: "centro-desarrollo",
    name: "Centro de Desarrollo Físico",
    shortName: "Deportivo",
    color: "#3b82f6", // Azul
    highlightColor: "#60a5fa",
    floors: 1,
    position: { x: 10, y: 0, z: -4 },
    size: { width: 6, height: 1.5, depth: 3 },
    labelPos: { x: 10, y: 2.5, z: -4 }
  }
];

export const GROUND_DECORATIONS = [
  // Explanada central (gris)
  { type: "plaza", position: { x: 0, y: -0.05, z: 0 }, size: { width: 30, height: 0.1, depth: 25 }, color: "#1e293b" },
  
  // Cancha de fútbol (arriba a la izquierda)
  { type: "football_field", position: { x: -16, y: -0.04, z: -16 }, size: { width: 14, height: 0.1, depth: 10 }, color: "#166534" },
  
  // Cancha de béisbol (arriba a la derecha)
  { type: "baseball_field", position: { x: 12, y: -0.04, z: -14 }, size: { width: 10, height: 0.1, depth: 10 }, color: "#15803d" },
  
  // Áreas verdes
  { type: "garden_fime", position: { x: -3.5, y: -0.03, z: 1.5 }, size: { width: 3, height: 0.08, depth: 3 }, color: "#14532d" }, // Logo de FIME
  { type: "garden_side", position: { x: 20, y: -0.03, z: -2 }, size: { width: 6, height: 0.08, depth: 16 }, color: "#166534" },
  { type: "garden_bottom", position: { x: 2, y: -0.03, z: 12 }, size: { width: 10, height: 0.08, depth: 6 }, color: "#15803d" },
  
  // Caminos o conectores (opcionales)
  { type: "path", position: { x: -14, y: -0.04, z: -1 }, size: { width: 4, height: 0.11, depth: 4 }, color: "#334155" }
];
