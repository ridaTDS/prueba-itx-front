/**
 * Utilidades para normalizar y presentar los datos que devuelve el API.
 * El API tiene algunos campos con erratas (p. ej. `dimentions`, `secondaryCmera`) y valores
 * que pueden ser texto, lista o venir vacíos, así que se tratan de forma defensiva.
 */

const NOT_AVAILABLE = '—';

export function normalize(text) {
  return String(text ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Filtra por marca y modelo. Todas las palabras de la búsqueda deben aparecer,
 * sin importar mayúsculas, tildes ni el orden ("galaxy samsung" encuentra "Samsung Galaxy").
 */
export function filterProducts(products, query) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return products;

  return products.filter((product) => {
    const haystack = normalize(`${product.brand} ${product.model}`);
    return terms.every((term) => haystack.includes(term));
  });
}

export function formatPrice(price) {
  if (price === null || price === undefined || price === '') return 'Precio no disponible';
  const value = Number(price);
  if (Number.isNaN(value)) return String(price);
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
}

function formatValue(value) {
  if (Array.isArray(value)) {
    const items = value.map((item) => String(item).trim()).filter(Boolean);
    return items.length ? items.join(', ') : NOT_AVAILABLE;
  }
  if (value === null || value === undefined || String(value).trim() === '') return NOT_AVAILABLE;
  return String(value).trim();
}

function firstDefined(product, ...keys) {
  for (const key of keys) {
    if (product[key] !== undefined && product[key] !== null && product[key] !== '') return product[key];
  }
  return undefined;
}

function withUnit(value, unit) {
  const formatted = formatValue(value);
  if (formatted === NOT_AVAILABLE || /[a-z]/i.test(formatted)) return formatted;
  return `${formatted} ${unit}`;
}

/**
 * Lista de atributos a mostrar en la descripción del producto.
 */
export function getProductSpecs(product) {
  return [
    { label: 'Marca', value: formatValue(product.brand) },
    { label: 'Modelo', value: formatValue(product.model) },
    { label: 'Precio', value: formatPrice(product.price) },
    { label: 'CPU', value: formatValue(product.cpu) },
    { label: 'RAM', value: formatValue(product.ram) },
    { label: 'Sistema operativo', value: formatValue(product.os) },
    { label: 'Resolución de pantalla', value: formatValue(product.displayResolution) },
    { label: 'Batería', value: formatValue(product.battery) },
    {
      label: 'Cámara principal',
      value: formatValue(firstDefined(product, 'primaryCamera')),
    },
    {
      label: 'Cámara frontal',
      value: formatValue(firstDefined(product, 'secondaryCamera', 'secondaryCmera')),
    },
    { label: 'Dimensiones', value: formatValue(firstDefined(product, 'dimensions', 'dimentions')) },
    { label: 'Peso', value: withUnit(product.weight, 'g') },
  ];
}

export function getOptions(product) {
  return {
    storages: product?.options?.storages ?? [],
    colors: product?.options?.colors ?? [],
  };
}
