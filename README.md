# Ubicsalon — FIME UANL

Localizador exprés de salones, edificios y auditorios de FIME UANL con mapa 3D.
Es una **PWA estática** (React + Vite + Three.js + Tailwind): no tiene backend ni variables de entorno.

## Desarrollo

```bash
npm install
npm run dev       # servidor local (accesible desde la red Wi-Fi)
npm run lint
npm run build     # genera dist/
npm run preview   # sirve dist/ para probar la PWA
```

Requiere Node **20.19+ o 22.12+** (ver `.node-version`).

## Datos y fotos de salones

- Datos: `src/data/salones.json`.
- Fotos: `public/img/salones/{edificioId}/{id}.webp` (ver [`public/img/salones/README.md`](public/img/salones/README.md)).
- Desde el panel admin se suben fotos y se usa **Exportar ZIP**; el ZIP se descomprime en la raíz del proyecto y se hace commit.

## Despliegue (Cloudflare Pages)

Cada `git push` a `main` publica automáticamente.

| Campo | Valor |
|---|---|
| Framework preset | `Vite` (o ninguno) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | *(vacío)* |
| Variable `NODE_VERSION` | `22` (opcional; también se lee `.node-version`) |

Pasos: Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** →
repositorio `OsvaldoAAM/Ubicsalon` → rellenar la tabla → **Save and Deploy**.

Notas:
- `public/_headers` define la caché (el service worker y el HTML siempre se revalidan).
- La app usa `base: './'`, por lo que también funciona en subrutas (GitHub Pages, etc.).
- Las fotos de salones se cachean en el dispositivo al verlas (no se precachean todas).
- El HTTPS que da el hosting es obligatorio para que la PWA sea instalable y funcione el service worker.
