export const API_BASE = import.meta.env.VITE_API_URL;

if (!API_BASE) {
  console.error('[NexoFit Config Error] VITE_API_URL no está definida en las variables de entorno.');
}

export function getApiUrl(path) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE || ''}${cleanPath}`;
}

