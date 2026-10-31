import { useState } from 'react';
import './ProductImage.css';

export default function ProductImage({ src, alt, loading = 'eager' }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="product-image product-image--placeholder" role="img" aria-label={alt}>
        <svg viewBox="0 0 32 32" width="48" height="48" aria-hidden="true">
          <rect x="9" y="3" width="14" height="26" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="16" cy="25" r="1" fill="currentColor" />
        </svg>
      </div>
    );
  }

  return (
    <img className="product-image" src={src} alt={alt} loading={loading} onError={() => setFailed(true)} />
  );
}
