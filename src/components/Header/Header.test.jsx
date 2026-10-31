import { screen } from '@testing-library/react';
import { renderApp } from '../../test/renderWithProviders';
import { CART_STORAGE_KEY } from '../../context/CartContext';
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
});
