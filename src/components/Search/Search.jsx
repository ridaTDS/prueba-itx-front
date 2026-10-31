import './Search.css';

export default function Search({ value, onChange, resultCount }) {
  return (
    <div className="search">
      <label htmlFor="product-search" className="visually-hidden">
        Buscar por marca o modelo
      </label>
      <svg className="search__icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path
          d="m21 21-4.3-4.3M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      <input
        id="product-search"
        type="search"
        className="search__input"
        placeholder="Buscar por marca o modelo"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="off"
      />
      {resultCount !== undefined && (
        <span className="search__count" aria-live="polite">
          {resultCount} {resultCount === 1 ? 'resultado' : 'resultados'}
        </span>
      )}
    </div>
  );
}
