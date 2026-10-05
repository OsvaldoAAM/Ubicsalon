/**
 * Servicio para sincronizar fotos y datos de salones directamente con el repositorio de GitHub.
 * Esto permite que múltiples personas tomen fotos con sus teléfonos y los cambios
 * queden guardados inmediatamente en el repositorio original sin usar archivos ZIP.
 */

const REPO_OWNER = 'OsvaldoAAM';
const REPO_NAME = 'Ubicsalon';
const BRANCH = 'main';

/**
 * Convierte un Blob o File a String Base64 para la API de GitHub
 */
export async function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Obtiene el SHA de un archivo existente en GitHub para poder sobreescribirlo
 */
export async function getFileSha(path, token) {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${BRANCH}`, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    if (res.ok) {
      const data = await res.json();
      return data.sha;
    }
  } catch (e) {
    console.warn('File SHA lookup warning:', e);
  }
  return null;
}

/**
 * Sube o actualiza un archivo en el repositorio de GitHub
 */
export async function uploadFileToGitHub({ path, contentBase64, message, token }) {
  const sha = await getFileSha(path, token);

  const payload = {
    message: message || `update ${path}`,
    content: contentBase64,
    branch: BRANCH,
  };

  if (sha) {
    payload.sha = sha;
  }

  const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github.v3+json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Error HTTP ${res.status} al comunicarse con GitHub`);
  }

  return await res.json();
}

/**
 * Guarda una foto y actualiza el salones.json directamente en GitHub
 */
export async function syncFotoAndDataToGitHub({ token, edificioId, salonId, photoBlob, updatedSalonesList, onStatusUpdate }) {
  if (!token) {
    throw new Error('Se requiere un Token de GitHub para sincronizar.');
  }

  const limpiar = (s) => String(s).toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
  const relFotoPath = `img/salones/${limpiar(edificioId)}/${limpiar(salonId)}.webp`;
  const fullFotoPath = `public/${relFotoPath}`;
  const jsonPath = 'src/data/salones.json';

  // 1. Subir Foto WebP si existe blob
  if (photoBlob) {
    onStatusUpdate?.('Subiendo fotografía comprimida a GitHub...');
    const photoBase64 = await blobToBase64(photoBlob);
    await uploadFileToGitHub({
      path: fullFotoPath,
      contentBase64: photoBase64,
      message: `feat(salones): subir foto de ${salonId} [cam-upload]`,
      token,
    });
  }

  // 2. Subir salones.json actualizado
  onStatusUpdate?.('Sincronizando salones.json en GitHub...');
  const jsonString = JSON.stringify(updatedSalonesList, null, 2);
  const jsonBase64 = btoa(unescape(encodeURIComponent(jsonString)));

  await uploadFileToGitHub({
    path: jsonPath,
    contentBase64: jsonBase64,
    message: `feat(salones): actualizar datos de ${salonId} [admin]`,
    token,
  });

  onStatusUpdate?.('¡Sincronización completada con éxito en GitHub!');
  return relFotoPath;
}
