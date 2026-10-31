import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp } from '../../test/renderWithProviders';
import { products } from '../../test/fixtures';
import * as api from '../../api/products';

vi.mock('../../api/products');

async function findProductItems() {
  const list = await screen.findByRole('list', { name: 'Productos' });
  return within(list).getAllByRole('listitem');
}

describe('ProductListPage', () => {
  beforeEach(() => {
    api.getProducts.mockResolvedValue(products);
  });

  it('muestra todos los productos con imagen, marca, modelo y precio', async () => {
    renderApp('/');

    const items = await findProductItems();
    expect(items).toHaveLength(3);

    const first = within(items[0]);
    expect(first.getByRole('img', { name: 'Acer Iconia Talk S' })).toBeInTheDocument();
    expect(first.getByText('Acer')).toBeInTheDocument();
    expect(first.getByText('Iconia Talk S')).toBeInTheDocument();
    expect(first.getByText(/170,00/)).toBeInTheDocument();
  });

  it('filtra en tiempo real por marca y modelo', async () => {
    const user = userEvent.setup();
    renderApp('/');
    await findProductItems();

    await user.type(screen.getByRole('searchbox'), 'gal');

    const items = await findProductItems();
    expect(items).toHaveLength(1);
    expect(within(items[0]).getByText('Galaxy S8')).toBeInTheDocument();
    expect(screen.getByText('1 resultado')).toBeInTheDocument();
  });

  it('informa cuando no hay resultados', async () => {
    const user = userEvent.setup();
    renderApp('/');
    await findProductItems();

    await user.type(screen.getByRole('searchbox'), 'nokia');

    expect(screen.getByText(/No hay productos que coincidan/)).toBeInTheDocument();
  });

  it('enlaza cada producto con su detalle', async () => {
    renderApp('/');

    const links = await screen.findAllByRole('link', { name: /Iconia Talk S/ });
    expect(links[0]).toHaveAttribute('href', '/product/a1');
  });

  it('muestra un error si el API falla', async () => {
    api.getProducts.mockRejectedValue(new Error('boom'));
    renderApp('/');

    expect(await screen.findByRole('alert')).toHaveTextContent('No se han podido cargar los productos');
  });
});
