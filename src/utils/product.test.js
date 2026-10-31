import { filterProducts, formatPrice, getProductSpecs } from './product';

const products = [
  { id: '1', brand: 'Acer', model: 'Iconia Talk S' },
  { id: '2', brand: 'Samsung', model: 'Galaxy S8' },
  { id: '3', brand: 'Alcatel', model: 'Idol 4' },
];

describe('filterProducts', () => {
  it('devuelve todos los productos si la búsqueda está vacía', () => {
    expect(filterProducts(products, '   ')).toHaveLength(3);
  });

  it('filtra por marca', () => {
    expect(filterProducts(products, 'samsung').map((p) => p.id)).toEqual(['2']);
  });

  it('filtra por modelo sin distinguir mayúsculas', () => {
    expect(filterProducts(products, 'ICONIA').map((p) => p.id)).toEqual(['1']);
  });

  it('combina marca y modelo en cualquier orden', () => {
    expect(filterProducts(products, 'galaxy samsung').map((p) => p.id)).toEqual(['2']);
  });

  it('busca coincidencias parciales', () => {
    expect(filterProducts(products, 'ido').map((p) => p.id)).toEqual(['3']);
  });
});

describe('formatPrice', () => {
  it('formatea en euros', () => {
    expect(formatPrice('170')).toMatch(/170,00\s€/);
  });

  it('indica cuando no hay precio', () => {
    expect(formatPrice('')).toBe('Precio no disponible');
  });
});

describe('getProductSpecs', () => {
  it('tolera campos con erratas del API y listas', () => {
    const specs = getProductSpecs({
      brand: 'Acer',
      model: 'Liquid',
      primaryCamera: ['13 MP', 'autofocus'],
      secondaryCmera: '5 MP',
      dimentions: '145 x 72 x 8 mm',
      weight: '150',
    });
    const byLabel = Object.fromEntries(specs.map((s) => [s.label, s.value]));

    expect(byLabel['Cámara principal']).toBe('13 MP, autofocus');
    expect(byLabel['Cámara frontal']).toBe('5 MP');
    expect(byLabel.Dimensiones).toBe('145 x 72 x 8 mm');
    expect(byLabel.Peso).toBe('150 g');
    expect(byLabel.CPU).toBe('—');
  });
});
