export const CACHE_PREFIX = 'itx-cache:';
export const DEFAULT_TTL_MS = 60 * 60 * 1000; // 1 hora

/**
 * Caché con expiración sobre localStorage, con una copia en memoria como respaldo
 * (por si localStorage no está disponible o está lleno).
 */
const memory = new Map();

function storage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function getCached(key, now = Date.now()) {
  const fullKey = CACHE_PREFIX + key;
  let entry = memory.get(fullKey);

  if (!entry) {
    try {
      const raw = storage()?.getItem(fullKey);
      entry = raw ? JSON.parse(raw) : undefined;
    } catch {
      entry = undefined;
    }
  }

  if (!entry) return undefined;

  if (entry.expiresAt <= now) {
    removeCached(key);
    return undefined;
  }

  memory.set(fullKey, entry);
  return entry.value;
}

export function setCached(key, value, ttlMs = DEFAULT_TTL_MS, now = Date.now()) {
  const fullKey = CACHE_PREFIX + key;
  const entry = { value, expiresAt: now + ttlMs };
  memory.set(fullKey, entry);
  try {
    storage()?.setItem(fullKey, JSON.stringify(entry));
  } catch {
    // Sin espacio o storage deshabilitado: nos quedamos con la copia en memoria
  }
}

export function removeCached(key) {
  const fullKey = CACHE_PREFIX + key;
  memory.delete(fullKey);
  try {
    storage()?.removeItem(fullKey);
  } catch {
    // ignorado
  }
}

export function clearCache() {
  memory.clear();
  const store = storage();
  if (!store) return;
  Object.keys(store)
    .filter((key) => key.startsWith(CACHE_PREFIX))
    .forEach((key) => store.removeItem(key));
}
