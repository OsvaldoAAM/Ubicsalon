// Geometría y distribución espacial 3D de los edificios del campus FIME (UANL)
// Posiciones medidas desde el mapa real de la facultad.
// Centro (0,0,0) = zona de caminos diagonales verdes (centro del campus).
// X+ = derecha (Este), Z+ = abajo (Sur), Y+ = arriba (altura).

export const FIME_BUILDINGS = [
  {
    id: "edificio-1",
    name: "Edificio 1",
    shortName: "E1",
    color: "#3b82f6",
    highlightColor: "#60a5fa",
    floors: 3,
    position: { x: 9, y: 0, z: 9 },
    size: { width: 5.5, height: 2.2, depth: 3.5 },
    labelPos: { x: 9, y: 3, z: 9 }
  },
  {
    id: "edificio-2",
    name: "Edificio 2",
    shortName: "E2",
    color: "#10b981",
    highlightColor: "#34d399",
    floors: 3,
    position: { x: 9, y: 0, z: 4 },
    size: { width: 6, height: 2.2, depth: 4.5 },
    labelPos: { x: 9, y: 3, z: 4 }
  },
  {
    id: "edificio-3",
    name: "Edificio 3",
    shortName: "E3",
    color: "#f59e0b",
    highlightColor: "#fbbf24",
    floors: 2,
    position: { x: 12, y: 0, z: -3 },
    size: { width: 8, height: 1.8, depth: 3 },
    labelPos: { x: 12, y: 2.5, z: -3 }
  },
  {
    id: "edificio-4",
    name: "Edificio 4",
    shortName: "E4",
    color: "#8b5cf6",
    highlightColor: "#a78bfa",
    floors: 3,
    position: { x: 7, y: 0, z: -10 },
    size: { width: 7, height: 2.2, depth: 5 },
    labelPos: { x: 7, y: 3, z: -10 }
  },
  {
    id: "edificio-5",
    name: "Edificio 5",
    shortName: "E5",
    color: "#ec4899",
    highlightColor: "#f472b6",
    floors: 3,
    position: { x: -8, y: 0, z: 3 },
    size: { width: 5, height: 2.2, depth: 6 },
    labelPos: { x: -8, y: 3, z: 3 }
  },
  {
    id: "edificio-6",
    name: "Edificio 6",
    shortName: "E6",
    color: "#06b6d4",
    highlightColor: "#22d3ee",
    floors: 3,
    position: { x: -8, y: 0, z: -3 },
    size: { width: 5, height: 2.2, depth: 3 },
    labelPos: { x: -8, y: 3, z: -3 }
  },
  {
    id: "edificio-7",
    name: "Edificio 7",
    shortName: "E7",
    color: "#6366f1",
    highlightColor: "#818cf8",
    floors: 4,
    position: { x: -19, y: 0, z: 4 },
    size: { width: 7, height: 2.8, depth: 7 },
    labelPos: { x: -19, y: 3.5, z: 4 }
  },
  {
    id: "edificio-8",
    name: "Edificio 8",
    shortName: "E8",
    color: "#f43f5e",
    highlightColor: "#fb7185",
    floors: 2,
    position: { x: -18, y: 0, z: -9 },
    size: { width: 3, height: 1.6, depth: 3 },
    labelPos: { x: -18, y: 2.5, z: -9 }
  },
  {
    id: "edificio-9",
    name: "Edificio 9",
    shortName: "E9",
    color: "#84cc16",
    highlightColor: "#a3e635",
    floors: 3,
    position: { x: 18, y: 0, z: 0 },
    size: { width: 2.5, height: 2.2, depth: 4.5 },
    labelPos: { x: 18, y: 3, z: 0 }
  },
  {
    id: "edificio-11",
    name: "Edificio 11",
    shortName: "E11",
    color: "#14b8a6",
    highlightColor: "#2dd4bf",
    floors: 3,
    position: { x: 16, y: 0, z: 5 },
    size: { width: 3.5, height: 2.2, depth: 2.5 },
    labelPos: { x: 16, y: 3, z: 5 }
  },
  {
    id: "edificio-12",
    name: "Edificio 12",
    shortName: "E12",
    color: "#f97316",
    highlightColor: "#fb923c",
    floors: 2,
    position: { x: -12, y: 0, z: -9 },
    size: { width: 6, height: 1.8, depth: 3 },
    labelPos: { x: -12, y: 2.5, z: -9 }
  },
  {
    id: "biblioteca",
    name: "Biblioteca",
    shortName: "Biblio",
    color: "#eab308",
    highlightColor: "#facc15",
    floors: 3,
    position: { x: -3, y: 0, z: -9 },
    size: { width: 5, height: 2.5, depth: 4 },
    labelPos: { x: -3, y: 3.5, z: -9 }
  },
  {
    id: "cafeteria",
    name: "Cafetería",
    shortName: "Cafe",
    color: "#a855f7",
    highlightColor: "#c084fc",
    floors: 1,
    position: { x: 2, y: 0, z: 1 },
    size: { width: 3, height: 1.2, depth: 2 },
    labelPos: { x: 2, y: 2, z: 1 }
  },
  {
    id: "ccpi",
    name: "CCPI",
    shortName: "CCPI",
    color: "#10b981",
    highlightColor: "#34d399",
    floors: 2,
    position: { x: 18, y: 0, z: 9 },
    size: { width: 3, height: 1.8, depth: 4 },
    labelPos: { x: 18, y: 2.5, z: 9 }
  },
  {
    id: "centro-cultural",
    name: "Centro Cultural",
    shortName: "Cultural",
    color: "#3b82f6",
    highlightColor: "#60a5fa",
    floors: 2,
    position: { x: 19, y: 0, z: -8 },
    size: { width: 5, height: 1.5, depth: 3 },
    labelPos: { x: 19, y: 2.5, z: -8 }
  },
  {
    id: "cidte",
    name: "CIDTE",
    shortName: "CIDTE",
    color: "#64748b",
    highlightColor: "#94a3b8",
    floors: 2,
    position: { x: -3, y: 0, z: 12 },
    size: { width: 4, height: 2.5, depth: 3 },
    labelPos: { x: -3, y: 3.5, z: 12 }
  },
  {
    id: "polideportivo",
    name: "Polideportivo",
    shortName: "Poli",
    color: "#e2e8f0",
    highlightColor: "#f1f5f9",
    floors: 4,
    position: { x: -4, y: 0, z: -16 },
    size: { width: 7, height: 3.5, depth: 5 },
    labelPos: { x: -4, y: 4.5, z: -16 }
  },
  {
    id: "campo-beisbol",
    name: "Campo Beisbol",
    shortName: "Campo Béisbol",
    color: "#15803d",
    highlightColor: "#22c55e",
    floors: 1,
    position: { x: 14, y: 0, z: -17 },
    size: { width: 10, height: 0.2, depth: 10 },
    labelPos: { x: 14, y: 1, z: -17 }
  },
  {
    id: "campo-fime",
    name: "Campo FIME",
    shortName: "Campo FIME",
    color: "#166534",
    highlightColor: "#15803d",
    floors: 1,
    position: { x: -16, y: 0, z: -20 },
    size: { width: 14, height: 0.2, depth: 9 },
    labelPos: { x: -16, y: 1, z: -20 }
  },
  {
    id: "campo-sintetico-fime",
    name: "Campo Sintetico FIME",
    shortName: "Campo Sintético",
    color: "#14532d",
    highlightColor: "#166534",
    floors: 1,
    position: { x: 19, y: 0, z: -4 },
    size: { width: 4, height: 0.2, depth: 3 },
    labelPos: { x: 19, y: 1, z: -4 }
  },
  {
    id: "huella",
    name: "Huella",
    shortName: "Huella",
    color: "#0284c7",
    highlightColor: "#38bdf8",
    floors: 1,
    position: { x: 0, y: 0, z: 0 },
    size: { width: 4, height: 0.3, depth: 4 },
    labelPos: { x: 0, y: 1, z: 0 }
  }
];


// ═══════════════════════════════════════════
//  DECORACIONES DE SUELO
// ═══════════════════════════════════════════
export const GROUND_DECORATIONS = [
  // Explanada / piso general del campus
  { type: "plaza", position: { x: 0, y: -0.05, z: 0 }, size: { width: 50, height: 0.1, depth: 40 }, color: "#1a2233" },

  // ── Canchas deportivas ──

  // Cancha de fútbol grande (esquina noroeste)
  { type: "football_field", position: { x: -16, y: -0.03, z: -20 }, size: { width: 14, height: 0.08, depth: 9 }, color: "#166534" },

  // Cancha de béisbol (esquina noreste)
  { type: "baseball_field", position: { x: 14, y: -0.03, z: -17 }, size: { width: 10, height: 0.08, depth: 10 }, color: "#15803d" },

  // Cancha pequeña junto al Centro de Desarrollo (derecha)
  { type: "small_field", position: { x: 19, y: -0.03, z: -4 }, size: { width: 4, height: 0.08, depth: 3 }, color: "#14532d" },

  // ── Áreas verdes / jardines ──

  // Jardín central (zona de caminos diagonales / logo FIME)
  { type: "garden_central", position: { x: -1, y: -0.02, z: -1 }, size: { width: 5, height: 0.06, depth: 5 }, color: "#14532d" },

  // Franja verde borde derecho (colinda con FARQ)
  { type: "garden_east", position: { x: 23, y: -0.02, z: 0 }, size: { width: 3, height: 0.06, depth: 30 }, color: "#166534" },

  // Áreas verdes al sur
  { type: "garden_south_1", position: { x: 4, y: -0.02, z: 14 }, size: { width: 8, height: 0.06, depth: 4 }, color: "#15803d" },
  { type: "garden_south_2", position: { x: -5, y: -0.02, z: 14 }, size: { width: 5, height: 0.06, depth: 3 }, color: "#166534" },

  // Área verde entre E7 y borde izquierdo
  { type: "garden_west", position: { x: -24, y: -0.02, z: 4 }, size: { width: 3, height: 0.06, depth: 10 }, color: "#166534" },

  // ── Caminos / conectores ──

  // Camino norte-sur (eje vertical central)
  { type: "path_ns", position: { x: 2, y: -0.04, z: -5 }, size: { width: 1.5, height: 0.11, depth: 14 }, color: "#334155" },

  // Camino este-oeste (eje horizontal central)
  { type: "path_ew", position: { x: -2, y: -0.04, z: 0 }, size: { width: 14, height: 0.11, depth: 1.5 }, color: "#334155" }
];
