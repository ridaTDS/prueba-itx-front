import { useEffect, useMemo, useRef, useState } from 'react';
import Keycloak from 'keycloak-js';
import Loader from '../components/Loader/Loader';
import { AuthContext, KEYCLOAK_CONFIG } from './auth';

// Segundos de margen para renovar el token antes de que caduque
const MIN_TOKEN_VALIDITY = 30;

function createKeycloak() {
  return new Keycloak(KEYCLOAK_CONFIG);
}

function toUser(tokenParsed = {}) {
  return {
    username: tokenParsed.preferred_username,
    name: tokenParsed.given_name || tokenParsed.name || tokenParsed.preferred_username,
  };
}

/**
 * Protege toda la aplicación: hasta que el usuario no inicia sesión en Keycloak
 * (Authorization Code + PKCE) no se renderiza nada.
 */
export function AuthProvider({ children, keycloakFactory = createKeycloak }) {
  const keycloakRef = useRef(null);
  const [state, setState] = useState({ status: 'loading' });

  useEffect(() => {
    // En desarrollo StrictMode ejecuta los efectos dos veces y keycloak.init sólo admite una llamada
    if (keycloakRef.current) return;

    const keycloak = keycloakFactory();
    keycloakRef.current = keycloak;

    keycloak.onTokenExpired = () => {
      keycloak.updateToken(MIN_TOKEN_VALIDITY).catch(() => keycloak.login());
    };
    keycloak.onAuthRefreshSuccess = () => setState({ status: 'authenticated', user: toUser(keycloak.tokenParsed) });

    keycloak
      .init({ onLoad: 'login-required', pkceMethod: 'S256', checkLoginIframe: false })
      .then((authenticated) => {
        if (authenticated) {
          setState({ status: 'authenticated', user: toUser(keycloak.tokenParsed) });
        } else {
          keycloak.login();
        }
      })
      .catch((error) => setState({ status: 'error', error }));
  }, [keycloakFactory]);

  const value = useMemo(() => {
    const keycloak = keycloakRef.current;
    return {
      user: state.user,
      logout: () => keycloak.logout({ redirectUri: window.location.origin }),
      // Token vigente (renovado si está a punto de caducar) para llamar a APIs protegidas
      getToken: async () => {
        await keycloak.updateToken(MIN_TOKEN_VALIDITY);
        return keycloak.token;
      },
    };
  }, [state.user]);

  if (state.status === 'loading') {
    return <Loader label="Iniciando sesión" />;
  }

  if (state.status === 'error') {
    return (
      <div className="status-message" role="alert">
        <h1>No se ha podido iniciar sesión</h1>
        <p>
          No hay conexión con el servidor de identidad en <code>{KEYCLOAK_CONFIG.url}</code>.
        </p>
        <p>
          Arráncalo con <code>docker compose up -d keycloak</code> y recarga la página.
        </p>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
