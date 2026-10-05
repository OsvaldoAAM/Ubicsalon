import { useEffect, useState } from 'react';

/**
 * Utilidades para las fotos de salones.
 *
 * - En `salones.json` el campo `foto` guarda una RUTA RELATIVA a `public/`
 *   (ej. "img/salones/edificio-1/sal-1101.webp").
 * - Las fotos recién subidas desde el panel admin se guardan en IndexedDB
 *   hasta que se exporta el ZIP y se copian al proyecto.
 */

export const PLACEHOLDER_FOTO = 'img/placeholder-salon.svg';

const MAX_LADO = 800;
const CALIDAD_WEBP = 0.8;

const DB_NAME = 'ubicsalon-fotos';
const STORE = 'fotos';

/** true si `foto` es una ruta relativa del proyecto (no URL externa/data/blob). */
export function esRutaRelativa(foto) {
  return typeof foto === 'string' && foto.trim() !== '' && !/^(https?:|data:|blob:|\/)/i.test(foto);
}

/** Convierte el valor de `foto` en una URL usable por <img src>. */
export function getFotoUrl(foto) {
  if (!foto) return import.meta.env.BASE_URL + PLACEHOLDER_FOTO;
  if (esRutaRelativa(foto)) return import.meta.env.BASE_URL + foto;
  return foto; // URL externa, data: o blob: (datos antiguos)
}

/** Ruta estándar de la foto de un salón. */
export function rutaFotoSalon(edificioId, salonId) {
  const limpiar = (s) => String(s).toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
  return `img/salones/${limpiar(edificioId || 'sin-edificio')}/${limpiar(salonId)}.webp`;
}

/** Redimensiona y comprime una imagen a WebP (lado mayor 800 px). */
export async function procesarImagen(file) {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  const escala = Math.min(1, MAX_LADO / Math.max(bitmap.width, bitmap.height));
  const ancho = Math.max(1, Math.round(bitmap.width * escala));
  const alto = Math.max(1, Math.round(bitmap.height * escala));

  const canvas = document.createElement('canvas');
  canvas.width = ancho;
  canvas.height = alto;
  canvas.getContext('2d').drawImage(bitmap, 0, 0, ancho, alto);
  bitmap.close?.();

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', CALIDAD_WEBP));
  if (!blob || blob.type !== 'image/webp') {
    throw new Error('Este navegador no puede generar imágenes WebP.');
  }
  return blob;
}

/* ───────────── IndexedDB: fotos pendientes de exportar ───────────── */

function abrirDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function conStore(modo, fn) {
  const db = await abrirDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, modo);
    const req = fn(tx.objectStore(STORE));
    tx.oncomplete = () => {
      db.close();
      resolve(req?.result);
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

export const guardarFotoLocal = (ruta, blob) => conStore('readwrite', (s) => s.put(blob, ruta));
export const obtenerFotoLocal = (ruta) => conStore('readonly', (s) => s.get(ruta));
export const borrarFotoLocal = (ruta) => conStore('readwrite', (s) => s.delete(ruta));

/**
 * Devuelve la URL a mostrar para `foto`. Si hay una versión pendiente en
 * IndexedDB se usa esa; si no, la del proyecto. Devuelve null mientras consulta.
 * `version` fuerza la recarga cuando se reemplaza la foto con la misma ruta.
 */
export function useFotoUrl(foto, version = 0) {
  const [resuelto, setResuelto] = useState({ clave: null, url: null });
  const clave = `${foto}|${version}`;

  useEffect(() => {
    if (!esRutaRelativa(foto)) return undefined;
    let cancelado = false;
    let objUrl = null;
    obtenerFotoLocal(foto)
      .catch(() => null)
      .then((blob) => {
        if (cancelado) return;
        if (blob) objUrl = URL.createObjectURL(blob);
        setResuelto({ clave, url: objUrl || getFotoUrl(foto) });
      });
    return () => {
      cancelado = true;
      if (objUrl) URL.revokeObjectURL(objUrl);
    };
  }, [foto, clave]);

  if (!esRutaRelativa(foto)) return foto ? getFotoUrl(foto) : null;
  return resuelto.clave === clave ? resuelto.url : null;
}
