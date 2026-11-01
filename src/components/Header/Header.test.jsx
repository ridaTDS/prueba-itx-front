import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createTestAuth, renderApp } from '../../test/renderWithProviders';
import { CART_STORAGE_KEY } from '../../context/cart';
import * as api from '../../api/products';

vi.mock('../../api/products');

describe('Header', () => {
  beforeEach(() => {
    api.getProducts.mockResolvedValue([]);
  });

  it('enlaza el logo con la vista principal', () => {
    renderApp('/');

    expect(screen.getByRole('link', { name: /ir al inicio/ })).toHaveAttribute('href', '/');
  });

  it('muestra el número de productos de la cesta guardado', () => {
    window.localStorage.setItem(CART_STORAGE_KEY, '4');
    renderApp('/');

    expect(screen.getByTestId('cart-count')).toHaveTextContent('4');
  });

  it('muestra 0 si la cesta está vacía', () => {
    renderApp('/');

    expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
  });

  it('muestra el usuario de la sesión y permite cerrarla', async () => {
    const auth = createTestAuth();
    renderApp('/', auth);

    expect(screen.getByText('Hola, Demo')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }));

    expect(auth.logout).toHaveBeenCalledTimes(1);
  });
});
