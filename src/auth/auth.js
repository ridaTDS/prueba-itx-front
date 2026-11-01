import { createContext, useContext } from 'react';

export const KEYCLOAK_CONFIG = {
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'itx',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'itx-mobile-store',
};

/** Sesión del usuario: { user, logout, getToken }. La proporciona <AuthProvider>. */
export const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return context;
}
