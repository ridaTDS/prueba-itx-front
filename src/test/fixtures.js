export const products = [
  { id: 'a1', brand: 'Acer', model: 'Iconia Talk S', price: '170', imgUrl: 'https://img/a1.jpg' },
  { id: 's1', brand: 'Samsung', model: 'Galaxy S8', price: '', imgUrl: 'https://img/s1.jpg' },
  { id: 'l1', brand: 'Alcatel', model: 'Idol 4', price: '250', imgUrl: 'https://img/l1.jpg' },
];

export const productDetail = {
  id: 'a1',
  brand: 'Acer',
  model: 'Iconia Talk S',
  price: '170',
  imgUrl: 'https://img/a1.jpg',
  cpu: 'Quad-core 1.3 GHz Cortex-A53',
  ram: '2 GB RAM',
  os: 'Android 6.0 (Marshmallow)',
  displayResolution: '720 x 1280 pixels',
  battery: 'Non-removable Li-Ion 3400 mAh battery',
  primaryCamera: ['13 MP', 'autofocus'],
  secondaryCmera: ['2 MP', '720p'],
  dimentions: '191.7 x 101 x 9.4 mm',
  weight: '260',
  options: {
    colors: [{ code: 1000, name: 'Black' }],
    storages: [
      { code: 2000, name: '16 GB' },
      { code: 2001, name: '32 GB' },
    ],
  },
};
