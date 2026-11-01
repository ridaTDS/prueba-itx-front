import { useState } from 'react';
import { useCart } from '../../context/cart';
import { getOptions } from '../../utils/product';
import OptionSelector from './OptionSelector';
import './ProductActions.css';

// Si sólo hay una opción, se selecciona por defecto
function defaultCode(options) {
  return options.length === 1 ? options[0].code : null;
}

export default function ProductActions({ product }) {
  const { addToCart } = useCart();
  const { storages, colors } = getOptions(product);

  const [storageCode, setStorageCode] = useState(() => defaultCode(storages));
  const [colorCode, setColorCode] = useState(() => defaultCode(colors));
  const [status, setStatus] = useState({ state: 'idle' });

  const canAdd = storageCode !== null && colorCode !== null && status.state !== 'loading';

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canAdd) return;

    setStatus({ state: 'loading' });
    try {
      await addToCart({ id: product.id, colorCode, storageCode });
      setStatus({ state: 'success' });
    } catch {
      setStatus({ state: 'error' });
    }
  };

  return (
    <form className="actions" onSubmit={handleSubmit} aria-label="Opciones de compra">
      <OptionSelector
        label="Almacenamiento"
        name="storage"
        options={storages}
        value={storageCode}
        onChange={(code) => {
          setStorageCode(code);
          setStatus({ state: 'idle' });
        }}
      />
      <OptionSelector
        label="Color"
        name="color"
        options={colors}
        value={colorCode}
        onChange={(code) => {
          setColorCode(code);
          setStatus({ state: 'idle' });
        }}
      />

      <button type="submit" className="actions__add" disabled={!canAdd}>
        {status.state === 'loading' ? 'Añadiendo…' : 'Añadir a la cesta'}
      </button>

      <p className="actions__feedback" aria-live="polite">
        {!canAdd && status.state === 'idle' && 'Selecciona almacenamiento y color.'}
        {status.state === 'success' && '✓ Producto añadido a la cesta.'}
        {status.state === 'error' && 'No se ha podido añadir el producto. Inténtalo de nuevo.'}
      </p>
    </form>
  );
}
