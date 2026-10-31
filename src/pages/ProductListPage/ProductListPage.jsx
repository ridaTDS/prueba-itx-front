import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Search from '../../components/Search/Search';
import ProductItem from '../../components/ProductItem/ProductItem';
import Loader from '../../components/Loader/Loader';
import { useProducts } from '../../hooks/useProducts';
import { filterProducts } from '../../utils/product';
import './ProductListPage.css';

export default function ProductListPage() {
  const { products, loading, error } = useProducts();
  // La búsqueda vive en la URL: se conserva al volver desde el detalle y se puede compartir
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';

  const filtered = useMemo(() => filterProducts(products, query), [products, query]);

  const handleSearch = (value) => {
    setSearchParams(value ? { q: value } : {}, { replace: true });
  };

  return (
    <section className="plp" aria-labelledby="plp-title">
      <div className="plp__toolbar">
        <h1 id="plp-title" className="plp__title">
          Móviles
        </h1>
        <Search value={query} onChange={handleSearch} resultCount={loading ? undefined : filtered.length} />
      </div>

      {loading && <Loader label="Cargando productos" />}

      {error && (
        <p className="status-message" role="alert">
          No se han podido cargar los productos. Inténtalo de nuevo más tarde.
        </p>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className="status-message">No hay productos que coincidan con «{query}».</p>
      )}

      {!loading && !error && filtered.length > 0 && (
        <ul className="plp__grid">
          {filtered.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </ul>
      )}
    </section>
  );
}
