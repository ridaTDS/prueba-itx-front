import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';
import App from '../App';

export function renderApp(route = '/') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <CartProvider>
        <App />
      </CartProvider>
    </MemoryRouter>,
  );
}
