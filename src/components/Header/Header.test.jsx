import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createTestAuth, renderApp } from '../../test/renderWithProviders';
import { CART_STORAGE_KEY } from '../../context/cart';

// La cabecera es la misma en todas las vistas: se prueba en una sin peticiones al API
const ROUTE = '/pagina-sin-datos';

describe('Header', () => {
  it('enlaza el logo con la vista principal', () => {
    renderApp(ROUTE);

    expect(screen.getByRole('link', { name: /ir al inicio/ })).toHaveAttribute('href', '/');
  });

  it('muestra el número de productos de la cesta guardado', () => {
    window.localStorage.setItem(CART_STORAGE_KEY, '4');
    renderApp(ROUTE);

    expect(screen.getByTestId('cart-count')).toHaveTextContent('4');
  });

  it('muestra 0 si la cesta está vacía', () => {
    renderApp(ROUTE);

    expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
  });

  it('muestra el usuario de la sesión y permite cerrarla', async () => {
    const auth = createTestAuth();
    renderApp(ROUTE, auth);

    expect(screen.getByText('Hola, Demo')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }));

    expect(auth.logout).toHaveBeenCalledTimes(1);
  });
});
