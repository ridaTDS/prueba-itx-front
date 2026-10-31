import { clearCache, DEFAULT_TTL_MS, getCached, setCached } from './cache';

describe('cache', () => {
  beforeEach(() => {
    clearCache();
  });

  it('devuelve el valor guardado mientras no haya expirado', () => {
    const now = 1_000;
    setCached('key', { a: 1 }, DEFAULT_TTL_MS, now);

    expect(getCached('key', now + DEFAULT_TTL_MS - 1)).toEqual({ a: 1 });
  });

  it('expira pasada una hora', () => {
    const now = 1_000;
    setCached('key', 'value', DEFAULT_TTL_MS, now);

    expect(getCached('key', now + DEFAULT_TTL_MS)).toBeUndefined();
  });

  it('persiste los datos en localStorage', () => {
    setCached('key', [1, 2, 3]);

    const raw = JSON.parse(window.localStorage.getItem('itx-cache:key'));
    expect(raw.value).toEqual([1, 2, 3]);
    expect(raw.expiresAt).toBeGreaterThan(Date.now());
  });

  it('devuelve undefined si no existe la clave', () => {
    expect(getCached('missing')).toBeUndefined();
  });
});
