import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp } from '../../test/renderWithProviders';
import { productDetail } from '../../test/fixtures';
import { CART_STORAGE_KEY } from '../../context/CartContext';
import * as api from '../../api/products';

vi.mock('../../api/products');

describe('ProductDetailPage', () => {
  beforeEach(() => {
    api.getProduct.mockResolvedValue(productDetail);
    api.addToCart.mockResolvedValue(3);
  });

  it('muestra la descripción del producto', async () => {
    renderApp('/product/a1');

    expect(await screen.findByRole('heading', { level: 1, name: 'Iconia Talk S' })).toBeInTheDocument();
    expect(screen.getByText('Quad-core 1.3 GHz Cortex-A53')).toBeInTheDocument();
    expect(screen.getByText('2 GB RAM')).toBeInTheDocument();
    expect(screen.getByText('Android 6.0 (Marshmallow)')).toBeInTheDocument();
    expect(screen.getByText('720 x 1280 pixels')).toBeInTheDocument();
    expect(screen.getByText('Non-removable Li-Ion 3400 mAh battery')).toBeInTheDocument();
    expect(screen.getByText('13 MP, autofocus')).toBeInTheDocument();
    expect(screen.getByText('191.7 x 101 x 9.4 mm')).toBeInTheDocument();
    expect(screen.getByText('260 g')).toBeInTheDocument();
    expect(api.getProduct).toHaveBeenCalledWith('a1');
  });

  it('muestra un enlace para volver al listado y el producto en el breadcrumb', async () => {
    renderApp('/product/a1');

    expect(await screen.findByRole('link', { name: /Volver al listado/ })).toHaveAttribute('href', '/');
    const breadcrumbs = screen.getByRole('navigation', { name: 'Ruta de navegación' });
    expect(within(breadcrumbs).getByRole('link', { name: 'Inicio' })).toHaveAttribute('href', '/');
    expect(await within(breadcrumbs).findByText('Acer Iconia Talk S')).toBeInTheDocument();
  });

  it('selecciona por defecto la opción cuando sólo hay una', async () => {
    renderApp('/product/a1');

    expect(await screen.findByRole('radio', { name: 'Black' })).toBeChecked();
    expect(screen.getByRole('radio', { name: '16 GB' })).not.toBeChecked();
    expect(screen.getByRole('button', { name: 'Añadir a la cesta' })).toBeDisabled();
  });

  it('añade el producto a la cesta y actualiza y persiste el contador', async () => {
    const user = userEvent.setup();
    renderApp('/product/a1');

    await user.click(await screen.findByRole('radio', { name: '32 GB' }));
    await user.click(screen.getByRole('button', { name: 'Añadir a la cesta' }));

    expect(api.addToCart).toHaveBeenCalledWith({ id: 'a1', colorCode: 1000, storageCode: 2001 });
    expect(await screen.findByText(/Producto añadido/)).toBeInTheDocument();
    expect(screen.getByTestId('cart-count')).toHaveTextContent('3');
    expect(window.localStorage.getItem(CART_STORAGE_KEY)).toBe('3');
  });

  it('muestra un error si no se puede añadir a la cesta', async () => {
    api.addToCart.mockRejectedValue(new Error('boom'));
    const user = userEvent.setup();
    renderApp('/product/a1');

    await user.click(await screen.findByRole('radio', { name: '16 GB' }));
    await user.click(screen.getByRole('button', { name: 'Añadir a la cesta' }));

    expect(await screen.findByText(/No se ha podido añadir/)).toBeInTheDocument();
  });
});
