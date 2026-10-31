import { cachedGet, post } from './client';
import { clearCache } from '../utils/cache';

function mockFetchOk(body) {
  return vi.fn().mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve(body) });
}

describe('api client', () => {
  beforeEach(() => {
    clearCache();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('cachea las respuestas GET y no repite la petición', async () => {
    const fetchMock = mockFetchOk([{ id: '1' }]);
    vi.stubGlobal('fetch', fetchMock);

    await expect(cachedGet('/api/product')).resolves.toEqual([{ id: '1' }]);
    await expect(cachedGet('/api/product')).resolves.toEqual([{ id: '1' }]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('agrupa peticiones simultáneas al mismo recurso', async () => {
    const fetchMock = mockFetchOk({ id: '1' });
    vi.stubGlobal('fetch', fetchMock);

    await Promise.all([cachedGet('/api/product/1'), cachedGet('/api/product/1')]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('revalida pasada una hora', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T10:00:00Z'));
    const fetchMock = mockFetchOk([]);
    vi.stubGlobal('fetch', fetchMock);

    await cachedGet('/api/product');
    vi.setSystemTime(new Date('2024-01-01T11:00:01Z'));
    await cachedGet('/api/product');

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('lanza un error si el API responde con error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));

    await expect(cachedGet('/api/product/x')).rejects.toMatchObject({ status: 500 });
  });

  it('envía el cuerpo en las peticiones POST', async () => {
    const fetchMock = mockFetchOk({ count: 1 });
    vi.stubGlobal('fetch', fetchMock);

    await post('/api/cart', { id: '1', colorCode: 1, storageCode: 2 });

    const [, options] = fetchMock.mock.calls[0];
    expect(options.method).toBe('POST');
    expect(JSON.parse(options.body)).toEqual({ id: '1', colorCode: 1, storageCode: 2 });
  });
});
