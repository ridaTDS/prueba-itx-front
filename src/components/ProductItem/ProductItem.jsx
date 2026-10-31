import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/product';
import ProductImage from '../ProductImage/ProductImage';
import './ProductItem.css';

export default function ProductItem({ product }) {
  return (
    <li className="product-item">
      <Link to={`/product/${product.id}`} className="product-item__link">
        <div className="product-item__image">
          <ProductImage src={product.imgUrl} alt={`${product.brand} ${product.model}`} loading="lazy" />
        </div>
        <div className="product-item__info">
          <p className="product-item__brand">{product.brand}</p>
          <h2 className="product-item__model">{product.model}</h2>
          <p className="product-item__price">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </li>
  );
}
