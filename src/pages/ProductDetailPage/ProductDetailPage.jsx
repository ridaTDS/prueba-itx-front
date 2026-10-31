import { Link, useParams } from 'react-router-dom';
import ProductImage from '../../components/ProductImage/ProductImage';
import ProductDescription from '../../components/ProductDescription/ProductDescription';
import ProductActions from '../../components/ProductActions/ProductActions';
import Loader from '../../components/Loader/Loader';
import { useProduct } from '../../hooks/useProducts';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { product, loading, error } = useProduct(id);

  return (
    <section className="pdp">
      <Link to="/" className="back-link">
        ← Volver al listado
      </Link>

      {loading && <Loader label="Cargando producto" />}

      {error && (
        <p className="status-message" role="alert">
          {error.status === 404
            ? 'El producto no existe.'
            : 'No se ha podido cargar el producto. Inténtalo de nuevo más tarde.'}
        </p>
      )}

      {!loading && product && (
        <div className="pdp__layout">
          <div className="pdp__image">
            <ProductImage src={product.imgUrl} alt={`${product.brand} ${product.model}`} />
          </div>
          <div className="pdp__details">
            <ProductDescription product={product} />
            <ProductActions key={product.id} product={product} />
          </div>
        </div>
      )}
    </section>
  );
}
