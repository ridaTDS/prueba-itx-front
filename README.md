# ITX Mobile Store

Mini aplicación (SPA) para comprar dispositivos móviles, desarrollada como prueba técnica de front-end.

Tiene dos vistas:

- **PLP** (`/`): listado de productos con búsqueda en tiempo real por marca y modelo.
- **PDP** (`/product/:id`): imagen, descripción y acciones (almacenamiento, color, añadir a la cesta).

El acceso está protegido con **login OIDC contra Keycloak** (ver [Seguridad](#seguridad)).

## Requisitos

- Node.js 18 o superior
- npm 9 o superior
- Docker (para Keycloak)

## Puesta en marcha

```bash
# 1. Servidor de identidad (si no lo tienes ya levantado desde el proyecto de back)
docker compose up -d keycloak

# 2. Aplicación
npm install
npm start
```

La aplicación queda disponible en http://localhost:5173 y redirige al login de Keycloak.
Usuario de prueba: **`demo` / `demo`**.

Keycloak tarda unos 20-30 segundos en arrancar la primera vez; si la aplicación muestra
"No se ha podido iniciar sesión", espera un poco y recarga.

## Scripts

| Script | Descripción |
|---|---|
| `npm start` | Arranca la aplicación en modo desarrollo (Vite). |
| `npm run build` | Genera la versión de producción en `dist/`. |
| `npm test` | Lanza los tests (Vitest + Testing Library). |
| `npm run lint` | Comprueba el código con ESLint. |
| `npm run preview` | Sirve en local la build de producción. |

## Configuración

Variables de entorno (ver `.env.example`):

| Variable | Por defecto |
|---|---|
| `VITE_API_URL` | `https://itx-frontend-test.onrender.com` |
| `VITE_KEYCLOAK_URL` | `http://localhost:8080` |
| `VITE_KEYCLOAK_REALM` | `itx` |
| `VITE_KEYCLOAK_CLIENT_ID` | `itx-mobile-store` |

> El API está alojado en Render (plan gratuito): la primera petición tras un tiempo de
> inactividad puede tardar unos segundos mientras el servicio se despierta.

## Stack

- **React 18** + **React Router 6** (enrutado en cliente, sin SSR).
- **keycloak-js** para la autenticación OIDC.
- **Vite** como herramienta de desarrollo y build.
- **Vitest** + **Testing Library** para los tests.
- **ESLint** (flat config) con reglas de React y hooks.
- CSS plano con variables y BEM, sin dependencias de estilos.

## Estructura

```
src/
├── api/            # Cliente HTTP (con caché) y endpoints del API
├── auth/           # AuthProvider y useAuth: sesión con Keycloak (OIDC + PKCE)
├── components/     # Header (+ Breadcrumbs), Search, ProductItem, ProductImage,
│                   # ProductDescription, ProductActions, Loader
├── context/        # CartProvider y useCart: contador de la cesta persistido
├── hooks/          # useAsync, useProducts / useProduct
├── pages/          # ProductListPage (PLP), ProductDetailPage (PDP), NotFoundPage
├── styles/         # Variables y estilos globales
├── utils/          # Caché con expiración, filtrado y formateo de productos
└── test/           # Configuración y utilidades de test
```

## Decisiones técnicas

**Caché en cliente (1 hora).** Todas las peticiones GET pasan por `cachedGet` (`src/api/client.js`):

- La respuesta se guarda en `localStorage` junto con su fecha de expiración (`src/utils/cache.js`),
  así sobrevive a recargas de página. Hay una copia en memoria por si `localStorage` no está
  disponible o está lleno.
- Pasada una hora, la entrada se descarta y la siguiente lectura vuelve a pedir el dato al API.
- Las peticiones simultáneas al mismo recurso se agrupan en una sola (p. ej. la PDP y el
  breadcrumb piden el mismo producto a la vez).

**Cesta.** El número que devuelve `POST /api/cart` se guarda en un contexto de React y en
`localStorage`, de modo que la cabecera lo muestra en todas las vistas y se mantiene al recargar.

**Búsqueda.** Filtra en tiempo real sobre los datos ya cargados, por marca y modelo, sin
distinguir mayúsculas ni tildes y admitiendo varias palabras en cualquier orden
("galaxy samsung"). El texto se guarda en la URL (`?q=`), por lo que se conserva al volver
desde el detalle y la búsqueda se puede compartir.

**Acciones del producto.** Los selectores de almacenamiento y color son grupos de radio buttons
accesibles con aspecto de botones. Si sólo hay una opción, se selecciona por defecto; el botón
de añadir sólo se habilita cuando hay almacenamiento y color seleccionados.

**Datos del API.** Algunos campos del API llegan con erratas (`dimentions`, `secondaryCmera`),
intercambiados (`displayResolution` trae el tamaño de pantalla), como texto o como lista, o
vacíos, y hay opciones de almacenamiento sin nombre. `getProductSpecs` (`src/utils/product.js`) los normaliza
para la vista; los valores que faltan se muestran como "—" y un precio vacío como
"Precio no disponible".

**Layout.** La PLP usa un grid de 1 a 4 columnas según el ancho de pantalla (máximo 4 por
fila). La PDP tiene dos columnas (imagen | descripción y acciones) que se apilan en móvil.

**Accesibilidad.** HTML semántico, `aria-live` para resultados de búsqueda y feedback de
la cesta, breadcrumbs con `aria-current`, foco visible y textos alternativos en las imágenes.

## Seguridad

La aplicación sólo se muestra a usuarios autenticados (`src/auth/AuthProvider.jsx`):

- **Authorization Code + PKCE (S256)** contra Keycloak con un cliente público
  (`itx-mobile-store`): el front no guarda ningún secreto.
- Mientras se comprueba la sesión no se renderiza la aplicación; sin sesión se redirige al login.
- El token se renueva automáticamente antes de caducar (`onTokenExpired` → `updateToken`).
- La cabecera muestra el usuario y un botón para **cerrar sesión** (logout en Keycloak y vuelta a la app).
- Los tokens se mantienen en memoria (no en `localStorage`), lo que reduce la exposición ante XSS.
- `useAuth().getToken()` devuelve un token vigente para llamar a APIs protegidas, como el
  API de productos similares del proyecto de back.

El API de productos de la prueba es pública y no admite autenticación, así que no se le envía
el token (añadir la cabecera `Authorization` provocaría un preflight CORS que ese API no acepta).

El realm se importa desde [`keycloak/itx-realm.json`](./keycloak/itx-realm.json), el mismo que
usa el proyecto de back. Consola de administración: http://localhost:8080 (`admin` / `admin`).

> Credenciales de ejemplo sólo para desarrollo local.

## Tests

- `utils/cache.test.js`: guardado, expiración a la hora y persistencia.
- `api/client.test.js`: caché de GET, agrupación de peticiones, revalidación y POST.
- `utils/product.test.js`: filtrado, formateo de precio y normalización de atributos.
- `pages/*/*.test.jsx`, `components/Header/Header.test.jsx`: flujos completos de la PLP,
  la PDP y la cabecera (búsqueda, selección por defecto, añadir a la cesta, contador y logout).
- `auth/AuthProvider.test.jsx`: login con PKCE, redirección sin sesión, error de Keycloak y logout
  (con un Keycloak simulado; el resto de tests usan una sesión simulada).
