import { formatPrice, getProductSpecs } from '../../utils/product';
import './ProductDescription.css';

const HIDDEN_IN_TABLE = new Set(['Marca', 'Modelo', 'Precio']);

export default function ProductDescription({ product }) {
  const specs = getProductSpecs(product);

  return (
    <div className="description">
      <p className="description__brand">{product.brand}</p>
      <h1 className="description__model">{product.model}</h1>
      <p className="description__price">{formatPrice(product.price)}</p>

      <h2 className="description__heading">Características</h2>
      <dl className="description__specs">
        {specs
          .filter((spec) => !HIDDEN_IN_TABLE.has(spec.label))
          .map((spec) => (
            <div className="description__row" key={spec.label}>
              <dt>{spec.label}</dt>
              <dd>{spec.value}</dd>
            </div>
          ))}
      </dl>
    </div>
  );
}
