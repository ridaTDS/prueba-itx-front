# ITX Mobile Store

Mini aplicación (SPA) para comprar dispositivos móviles, desarrollada como prueba técnica de front-end.

Tiene dos vistas:

- **PLP** (`/`): listado de productos con búsqueda en tiempo real por marca y modelo.
- **PDP** (`/product/:id`): imagen, descripción y acciones (almacenamiento, color, añadir a la cesta).

## Requisitos

- Node.js 18 o superior
- npm 9 o superior

## Puesta en marcha

```bash
npm install
npm start
```

La aplicación queda disponible en http://localhost:5173.

## Scripts

| Script | Descripción |
|---|---|
| `npm start` | Arranca la aplicación en modo desarrollo (Vite). |
| `npm run build` | Genera la versión de producción en `dist/`. |
| `npm test` | Lanza los tests (Vitest + Testing Library). |
| `npm run lint` | Comprueba el código con ESLint. |
| `npm run preview` | Sirve en local la build de producción. |

## Configuración

La URL del API se puede cambiar con la variable de entorno `VITE_API_URL`
(por defecto `https://itx-frontend-test.onrender.com`). Ver `.env.example`.

> El API está alojado en Render (plan gratuito): la primera petición tras un tiempo de
> inactividad puede tardar unos segundos mientras el servicio se despierta.

## Stack

- **React 18** + **React Router 6** (enrutado en cliente, sin SSR).
- **Vite** como herramienta de desarrollo y build.
- **Vitest** + **Testing Library** para los tests.
- **ESLint** (flat config) con reglas de React y hooks.
- CSS plano con variables y BEM, sin dependencias de estilos.
