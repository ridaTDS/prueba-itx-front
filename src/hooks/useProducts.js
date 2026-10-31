import { getProduct, getProducts } from '../api/products';
import { useAsync } from './useAsync';

export function useProducts() {
  const { data, error, loading } = useAsync(getProducts, []);
  return { products: data ?? [], error, loading };
}

export function useProduct(id) {
  const { data, error, loading } = useAsync(() => getProduct(id), [id]);
  return { product: data, error, loading };
}
