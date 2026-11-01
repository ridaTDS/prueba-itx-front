import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../auth/auth';
import { CartProvider } from '../context/CartProvider';
import App from '../App';

export function createTestAuth(overrides = {}) {
  return {
    user: { username: 'demo', name: 'Demo' },
    logout: vi.fn(),
    getToken: vi.fn().mockResolvedValue('test-token'),
    ...overrides,
  };
}

// La sesión se simula: los tests de la aplicación no dependen de Keycloak
export function renderApp(route = '/', auth = createTestAuth()) {
  return render(
    <AuthContext.Provider value={auth}>
      <MemoryRouter initialEntries={[route]}>
        <CartProvider>
          <App />
        </CartProvider>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}
