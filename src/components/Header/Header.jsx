import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/auth';
import { useCart } from '../../context/cart';
import Breadcrumbs from './Breadcrumbs';
import './Header.css';

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
      <path
        d="M6 6h15l-1.5 9h-12L6 6Zm0 0L5 3H2m6 17.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Header() {
  const { count } = useCart();
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header__bar container">
        <Link to="/" className="header__logo" aria-label="ITX Mobile Store, ir al inicio">
          <span className="header__logo-mark" aria-hidden="true" />
          ITX<span className="header__logo-light">Mobile</span>
        </Link>

        <div className="header__actions">
          <div className="header__user">
            <span className="header__user-name" title={user?.username}>
              Hola, {user?.name}
            </span>
            <button type="button" className="header__logout" onClick={logout}>
              Cerrar sesión
            </button>
          </div>

          <div
            className="header__cart"
            role="status"
            aria-label={`${count} ${count === 1 ? 'producto' : 'productos'} en la cesta`}
          >
            <CartIcon />
            <span className="header__cart-count" data-testid="cart-count">
              {count}
            </span>
          </div>
        </div>
      </div>
      <div className="header__crumbs container">
        <Breadcrumbs />
      </div>
    </header>
  );
}
