import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from './AuthContext';

function createFakeKeycloak({ init }) {
  return {
    init: vi.fn(init),
    login: vi.fn(),
    logout: vi.fn(),
    updateToken: vi.fn().mockResolvedValue(true),
    token: 'access-token',
    tokenParsed: { preferred_username: 'demo', given_name: 'Demo' },
  };
}

function SessionInfo() {
  const { user, logout } = useAuth();
  return (
    <>
      <p>Usuario: {user.name}</p>
      <button onClick={logout}>Salir</button>
    </>
  );
}

function renderWithKeycloak(keycloak) {
  return render(
    <AuthProvider keycloakFactory={() => keycloak}>
      <SessionInfo />
    </AuthProvider>,
  );
}

describe('AuthProvider', () => {
  it('inicia sesión con Authorization Code + PKCE y muestra la aplicación', async () => {
    const keycloak = createFakeKeycloak({ init: () => Promise.resolve(true) });
    renderWithKeycloak(keycloak);

    expect(await screen.findByText('Usuario: Demo')).toBeInTheDocument();
    expect(keycloak.init).toHaveBeenCalledWith(
      expect.objectContaining({ onLoad: 'login-required', pkceMethod: 'S256' }),
    );
  });

  it('no muestra la aplicación mientras se comprueba la sesión', () => {
    const keycloak = createFakeKeycloak({ init: () => new Promise(() => {}) });
    renderWithKeycloak(keycloak);

    expect(screen.getByText(/Iniciando sesión/)).toBeInTheDocument();
    expect(screen.queryByText(/Usuario:/)).not.toBeInTheDocument();
  });

  it('redirige al login si no hay sesión', async () => {
    const keycloak = createFakeKeycloak({ init: () => Promise.resolve(false) });
    renderWithKeycloak(keycloak);

    await vi.waitFor(() => expect(keycloak.login).toHaveBeenCalled());
    expect(screen.queryByText(/Usuario:/)).not.toBeInTheDocument();
  });

  it('muestra un error si el servidor de identidad no responde', async () => {
    const keycloak = createFakeKeycloak({ init: () => Promise.reject(new Error('Network error')) });
    renderWithKeycloak(keycloak);

    expect(await screen.findByRole('alert')).toHaveTextContent('No se ha podido iniciar sesión');
  });

  it('cierra la sesión volviendo a la aplicación', async () => {
    const keycloak = createFakeKeycloak({ init: () => Promise.resolve(true) });
    renderWithKeycloak(keycloak);

    await userEvent.click(await screen.findByRole('button', { name: 'Salir' }));

    expect(keycloak.logout).toHaveBeenCalledWith({ redirectUri: window.location.origin });
  });
});
