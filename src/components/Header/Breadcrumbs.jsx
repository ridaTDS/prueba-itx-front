import { Link, useMatch } from 'react-router-dom';
import { useProduct } from '../../hooks/useProducts';

function ProductCrumb({ id }) {
  // El detalle ya está cacheado (lo pide también la PDP), así que no genera una petición extra
  const { product } = useProduct(id);
  return <>{product ? `${product.brand} ${product.model}` : 'Detalle del producto'}</>;
}

export default function Breadcrumbs() {
  const productMatch = useMatch('/product/:id');

  return (
    <nav aria-label="Ruta de navegación" className="breadcrumbs">
      <ol className="breadcrumbs__list">
        <li className="breadcrumbs__item">
          {productMatch ? (
            <Link to="/">Inicio</Link>
          ) : (
            <span aria-current="page">Inicio</span>
          )}
        </li>
        {productMatch && (
          <li className="breadcrumbs__item">
            <span aria-current="page">
              <ProductCrumb id={productMatch.params.id} />
            </span>
          </li>
        )}
      </ol>
    </nav>
  );
}
