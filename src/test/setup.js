import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';

// jsdom no implementa el scroll de la ventana
window.scrollTo = vi.fn();

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});
