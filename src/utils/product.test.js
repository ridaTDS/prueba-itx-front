import { filterProducts, formatPrice, getOptions, getProductSpecs } from './product';

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

describe('pantalla', () => {
  const specsOf = (product) => Object.fromEntries(getProductSpecs(product).map((s) => [s.label, s.value]));

  it('corrige resolución y tamaño cuando el API los devuelve intercambiados', () => {
    const specs = specsOf({
      displayResolution: '2.8 inches (~37.5% screen-to-body ratio)',
      displaySize: '240 x 400 pixels (~167 ppi pixel density)',
    });

    expect(specs['Resolución de pantalla']).toBe('240 x 400 pixels (~167 ppi pixel density)');
    expect(specs['Tamaño de pantalla']).toBe('2.8 inches (~37.5% screen-to-body ratio)');
  });

  it('respeta los campos cuando vienen bien', () => {
    const specs = specsOf({ displayResolution: '720 x 1280 pixels', displaySize: '5.0 inches' });

    expect(specs['Resolución de pantalla']).toBe('720 x 1280 pixels');
    expect(specs['Tamaño de pantalla']).toBe('5.0 inches');
  });
});

describe('getOptions', () => {
  it('da un nombre a las opciones que llegan sin él', () => {
    const { storages, colors } = getOptions({
      options: { storages: [{ code: 2000, name: '' }], colors: [{ code: 1000, name: 'Black' }] },
    });

    expect(storages).toEqual([{ code: 2000, name: 'Estándar' }]);
    expect(colors).toEqual([{ code: 1000, name: 'Black' }]);
  });
});
