import { useEffect, useState } from 'react';

/**
 * Ejecuta una función asíncrona cada vez que cambian sus dependencias y expone
 * { data, error, loading }. Ignora respuestas de ejecuciones ya obsoletas.
 */
export function useAsync(asyncFn, deps) {
  const [state, setState] = useState({ data: undefined, error: undefined, loading: true });

  useEffect(() => {
    let active = true;
    setState((prev) => ({ data: prev.data, error: undefined, loading: true }));

    asyncFn()
      .then((data) => active && setState({ data, error: undefined, loading: false }))
      .catch((error) => active && setState({ data: undefined, error, loading: false }));

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
