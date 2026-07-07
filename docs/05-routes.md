# Routes

El proyecto usa Next.js Pages Router desde `src/pages` con i18n de Next (`en`, `es`). Las rutas en español se sirven con prefijo `/es` por la configuración i18n.

## Flujo De Rutas Publicas

```mermaid
flowchart TD
  User[Usuario]
  Home[/ o /es]
  Category[/:travel]
  Tour[/:travel/:slug]
  Static[Paginas estaticas]
  Contact[/contact]
  APIContact[/api/contact]
  TripsService[trip.service]
  Mongo[(MongoDB)]

  User --> Home
  User --> Category
  User --> Tour
  User --> Static
  User --> Contact
  Home --> TripsService
  Category --> TripsService
  Tour --> TripsService
  TripsService --> Mongo
  Contact --> APIContact
```

## Paginas Publicas

| Ruta | Archivo | Render/data |
| ---- | ------- | ----------- |
| `/` | `src/pages/index.js` | `getStaticProps`, `listTrips`, ISR `3600` |
| `/:travel` | `src/pages/[travel].js` | `getStaticPaths` vacio, `fallback: 'blocking'`, `getStaticProps`, ISR `3600` |
| `/:travel/:slug` | `src/pages/[travel]/[slug].js` | `getStaticPaths` vacio, `fallback: 'blocking'`, `getStaticProps`, ISR `3600` |
| `/contact` | `src/pages/contact.js` | Cliente, formulario que llama `/api/contact` |
| `/about-us` | `src/pages/about-us.js` | Cliente, contenido por idioma |
| `/terms-conditions` | `src/pages/terms-conditions/index.js` | Cliente, contenido por idioma |
| `/terms-conditions/complaintsBook` | `src/pages/terms-conditions/complaintsBook.js` | Cliente; submit actual muestra `alert` |
| `/404` | `src/pages/404.js` | Página custom de error |

## Admin

| Ruta | Archivo | Estado |
| ---- | ------- | ------ |
| `/admin/ra/[[...slug]]` | `src/pages/admin/ra/[[...slug]].js` | Carga `ReactAdminApp` con `ssr: false` |

El layout público se omite para rutas cuyo `pathname` empieza con `/admin`.

## Sitemaps

| Ruta | Archivo | Contenido |
| ---- | ------- | --------- |
| `/sitemap.xml` | `src/pages/sitemap.xml/index.js` | Sitemap index |
| `/sitemap-base.xml` | `src/pages/sitemap-base.xml/index.js` | Rutas base: home, about, contact, terms, complaints |
| `/sitemap-en.xml` | `src/pages/sitemap-en.xml/index.js` | Categorías y tours en inglés desde MongoDB |
| `/sitemap-es.xml` | `src/pages/sitemap-es.xml/index.js` | Categorías y tours en español desde MongoDB |

## API Publica

| Endpoint | Metodos | Archivo | Descripcion |
| -------- | ------- | ------- | ----------- |
| `/api/trip` | `GET` | `src/pages/api/trip/index.js` | Lista trips con `locale`, `category`, `isDeals`, `fields` |
| `/api/trip/[id]` | `GET` | `src/pages/api/trip/[id].js` | Obtiene trip por slug e idioma (`locale`) |
| `/api/trip/categories` | `GET` | `src/pages/api/trip/categories.js` | Lista categorías únicas |
| `/api/trip/deals` | `GET` | `src/pages/api/trip/deals.js` | Lista trips con `isDeals` |
| `/api/trip/navbar` | `GET` | `src/pages/api/trip/navbar.js` | Devuelve trips agrupados para navbar |
| `/api/trip/update` | `POST` | `src/pages/api/trip/update.js` | Actualiza `array_tour` en archivos `src/lang/*/navbar.js`; pendiente de confirmar uso actual |
| `/api/contact` | `POST` | `src/pages/api/contact.js` | Valida reCAPTCHA y envía correo con Resend |
| `/api/inbound-email` | Todos | `src/pages/api/inbound-email.js` | Responde que inbound email está deshabilitado |

## API De Autenticacion

| Endpoint | Metodo | Descripcion |
| -------- | ------ | ----------- |
| `/api/auth/login` | `POST` | Login admin, devuelve access token y setea refresh token HttpOnly |
| `/api/auth/refresh` | `GET` | Renueva access token desde cookie `refreshtoken` |
| `/api/auth/accessToken` | `GET` | Endpoint legacy equivalente a refresh |
| `/api/auth/logout` | `POST` | Limpia cookie de refresh token |

## API Admin

| Endpoint | Metodos | Proteccion | Descripcion |
| -------- | ------- | ---------- | ----------- |
| `/api/admin/trip` | `GET` | No exige auth en archivo actual | Lista trips admin con paginacion/filtros |
| `/api/admin/trip` | `POST` | `authGuard` + rol `admin` | Crea trip |
| `/api/admin/trip/[id]` | `GET` | No exige auth en archivo actual | Obtiene trip por ID |
| `/api/admin/trip/[id]` | `PUT`, `DELETE` | `authGuard` + rol `admin` | Actualiza/elimina trip |
| `/api/admin/trip/upload` | `POST` | `authGuard` + rol `admin` | Sube imagen base64 a storage local |
| `/api/admin/users` | `GET`, `POST` | `authGuard` + rol `admin` | Lista/crea usuarios |
| `/api/admin/users/[id]` | `GET`, `PUT`, `DELETE` | `authGuard` + rol `admin` | Lee/actualiza/elimina usuario |

## Redirects

`next.config.js` define redirects permanentes desde rutas legacy como `/category/inca-trail` hacia `/inca-trail`, y desde `alternative-tours` hacia nuevas categorías.
