import { getCached, setCached } from '../utils/cache';

export const API_URL = (import.meta.env.VITE_API_URL || 'https://itx-frontend-test.onrender.com').replace(
  /\/$/,
  '',
);

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });

  if (!response.ok) {
    throw new ApiError(`Error ${response.status} al llamar a ${path}`, response.status);
  }

  return response.json();
}

// Peticiones GET en curso, para no duplicar llamadas simultáneas al mismo recurso
const inFlight = new Map();

/**
 * GET con caché en cliente: si hay una respuesta válida (menos de 1 hora) se devuelve sin
 * llamar al API; si no, se pide, se guarda y se devuelve.
 */
export function cachedGet(path) {
  const cached = getCached(path);
  if (cached !== undefined) return Promise.resolve(cached);

  if (inFlight.has(path)) return inFlight.get(path);

  const promise = request(path)
    .then((data) => {
      setCached(path, data);
      return data;
    })
    .finally(() => inFlight.delete(path));

  inFlight.set(path, promise);
  return promise;
}

export function post(path, body) {
  return request(path, { method: 'POST', body: JSON.stringify(body) });
}
