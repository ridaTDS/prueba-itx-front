import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="status-message">
      <h1>Página no encontrada</h1>
      <p>La página que buscas no existe.</p>
      <Link to="/" className="back-link">
        ← Volver al listado
      </Link>
    </section>
  );
}
