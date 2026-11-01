import { useCallback, useMemo, useState } from 'react';
import { addToCart as addToCartRequest } from '../api/products';
import { CART_STORAGE_KEY, CartContext } from './cart';

function readStoredCount() {
  try {
    const value = Number(window.localStorage.getItem(CART_STORAGE_KEY));
    return Number.isFinite(value) && value > 0 ? value : 0;
  } catch {
    return 0;
  }
}

function storeCount(count) {
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, String(count));
  } catch {
    // ignorado: el contador seguirá en memoria durante la sesión
  }
}

export function CartProvider({ children }) {
  const [count, setCount] = useState(readStoredCount);

  const addToCart = useCallback(async (item) => {
    const newCount = await addToCartRequest(item);
    const value = Number(newCount) || 0;
    setCount(value);
    storeCount(value);
    return value;
  }, []);

  const value = useMemo(() => ({ count, addToCart }), [count, addToCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
