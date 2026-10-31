import { cachedGet, post } from './client';

export function getProducts() {
  return cachedGet('/api/product');
}

export function getProduct(id) {
  return cachedGet(`/api/product/${encodeURIComponent(id)}`);
}

/**
 * Añade un producto a la cesta. Devuelve el número de productos en la cesta.
 */
export async function addToCart({ id, colorCode, storageCode }) {
  const { count } = await post('/api/cart', { id, colorCode, storageCode });
  return count;
}
