import { createContext, useContext } from 'react';

export const CART_STORAGE_KEY = 'itx-cart-count';

/** Estado de la cesta: { count, addToCart }. Lo proporciona <CartProvider>. */
export const CartContext = createContext(null);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return context;
}
