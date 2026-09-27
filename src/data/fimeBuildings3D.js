// Geometría y distribución espacial 3D de los edificios del campus FIME (UANL)
export const FIME_BUILDINGS = [
  {
    id: "edificio-1",
    name: "Edificio 1",
    shortName: "E1",
    color: "#3b82f6", // Azul moderno
    highlightColor: "#60a5fa",
    floors: 3,
    position: { x: -8, y: 0, z: 8 },
    size: { width: 6, height: 2.2, depth: 3 },
    labelPos: { x: -8, y: 3, z: 8 }
  },
  {
    id: "edificio-2",
    name: "Edificio 2",
    shortName: "E2",
    color: "#10b981", // Verde esmeralda
    highlightColor: "#34d399",
    floors: 3,
    position: { x: -8, y: 0, z: 2 },
    size: { width: 6, height: 2.2, depth: 3 },
    labelPos: { x: -8, y: 3, z: 2 }
  },
  {
    id: "edificio-3",
    name: "Edificio 3",
    shortName: "E3",
    color: "#f59e0b", // Ámbar
    highlightColor: "#fbbf24",
    floors: 2,
    position: { x: -8, y: 0, z: -4 },
    size: { width: 5.5, height: 1.6, depth: 3 },
    labelPos: { x: -8, y: 2.5, z: -4 }
  },
  {
    id: "edificio-4",
    name: "Edificio 4",
    shortName: "E4",
    color: "#8b5cf6", // Púrpura
    highlightColor: "#a78bfa",
    floors: 3,
    position: { x: 0, y: 0, z: 8 },
    size: { width: 6, height: 2.2, depth: 3 },
    labelPos: { x: 0, y: 3, z: 8 }
  },
  {
    id: "edificio-5",
    name: "Edificio 5",
    shortName: "E5",
    color: "#ec4899", // Rosa vibrante
    highlightColor: "#f472b6",
    floors: 3,
    position: { x: 0, y: 0, z: 2 },
    size: { width: 6, height: 2.2, depth: 3 },
    labelPos: { x: 0, y: 3, z: 2 }
  },
  {
    id: "edificio-6",
    name: "Edificio 6",
    shortName: "E6",
    color: "#06b6d4", // Cyan
    highlightColor: "#22d3ee",
    floors: 3,
    position: { x: 0, y: 0, z: -4 },
    size: { width: 5.5, height: 2.2, depth: 3 },
    labelPos: { x: 0, y: 3, z: -4 }
  },
  {
    id: "edificio-7",
    name: "Edificio 7",
    shortName: "E7",
    color: "#6366f1", // Índigo
    highlightColor: "#818cf8",
    floors: 4,
    position: { x: 8, y: 0, z: 8 },
    size: { width: 6.5, height: 2.8, depth: 3.5 },
    labelPos: { x: 8, y: 3.5, z: 8 }
  },
  {
    id: "edificio-11",
    name: "Edificio 11",
    shortName: "E11",
    color: "#14b8a6", // Teal
    highlightColor: "#2dd4bf",
    floors: 3,
    position: { x: 8, y: 0, z: 2 },
    size: { width: 6, height: 2.2, depth: 3 },
    labelPos: { x: 8, y: 3, z: 2 }
  },
  {
    id: "cidet",
    name: "CIDET / Edificio Central",
    shortName: "CIDET",
    color: "#64748b", // Azul gris metálico
    highlightColor: "#94a3b8",
    floors: 4,
    position: { x: 8, y: 0, z: -4 },
    size: { width: 7, height: 3.0, depth: 4 },
    labelPos: { x: 8, y: 3.8, z: -4 }
  }
];

export const GROUND_DECORATIONS = [
  // Explanada central
  { type: "plaza", position: { x: 0, y: -0.05, z: 2 }, size: { width: 26, height: 0.1, depth: 22 }, color: "#1e293b" },
  // Áreas verdes / Jardines
  { type: "garden", position: { x: -4, y: -0.02, z: 5 }, size: { width: 3, height: 0.08, depth: 2 }, color: "#065f46" },
  { type: "garden", position: { x: 4, y: -0.02, z: -1 }, size: { width: 3, height: 0.08, depth: 3 }, color: "#065f46" }
];
