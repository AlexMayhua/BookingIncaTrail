# Architecture

## Vista General

```mermaid
flowchart LR
  Browser[Browser]
  NextPages[Next.js Pages Router]
  PublicPages[Paginas publicas]
  AdminPage[React Admin /admin/ra]
  ApiRoutes[API Routes]
  Services[Services]
  Repositories[Repositories]
  Mongo[(MongoDB)]
  External[Servicios externos]
  StaticAssets[public assets/storage]

  Browser --> NextPages
  NextPages --> PublicPages
  NextPages --> AdminPage
  PublicPages --> ApiRoutes
  AdminPage --> ApiRoutes
  ApiRoutes --> Services
  Services --> Repositories
  Repositories --> Mongo
  PublicPages --> StaticAssets
  ApiRoutes --> External
  PublicPages --> External
```

## Capas

- `src/pages`: define rutas públicas, rutas admin, sitemaps y API routes.
- `src/components`: renderiza UI pública, componentes de tours, navbar, footer, formularios y elementos generales.
- `src/modules`: concentra dominio y acceso a datos.
- `src/modules/trips`: controller, service, repository y model para tours.
- `src/modules/auth`: login, refresh token, cookies, JWT y guardas.
- `src/modules/users`: servicios y modelo de usuarios del admin.
- `src/lib`: configuración de marca, MongoDB, constantes, sitemap, GTM, WordPress y API client.
- `src/utils`: helpers transversales para categorías, CORS, imágenes, validación y caché.

## Flujo De Trips Publicos

```mermaid
sequenceDiagram
  participant Page as Pagina Next.js
  participant Service as trip.service
  participant Repo as trip.repository
  participant DB as MongoDB

  Page->>Service: listTrips/getToursByCategory/getTripBySlug
  Service->>Repo: consulta con filtros normalizados
  Repo->>DB: Trip.find / Trip.findOne
  DB-->>Repo: documentos lean()
  Repo-->>Service: trips
  Service-->>Page: datos serializables
  Page-->>Page: render SSG/ISR
```

## Flujo API De Trips

```mermaid
flowchart TD
  Req[Request API]
  Route[src/pages/api/*]
  Cors[CORS]
  Auth[authGuard + requireRole]
  Controller[trip.controller]
  Service[trip.service]
  Repo[trip.repository]
  DB[(MongoDB)]

  Req --> Route
  Route --> Cors
  Route -->|public GET| Controller
  Route -->|admin mutation| Auth
  Auth --> Controller
  Controller --> Service
  Service --> Repo
  Repo --> DB
```

## Autenticacion Admin

```mermaid
sequenceDiagram
  participant RA as React Admin
  participant Login as /api/auth/login
  participant Refresh as /api/auth/refresh
  participant AdminAPI as /api/admin/*
  participant DB as MongoDB

  RA->>Login: POST email/password
  Login->>DB: buscar usuario
  Login-->>RA: access_token + user
  Login-->>RA: cookie HttpOnly refreshtoken
  RA->>AdminAPI: Bearer access_token
  AdminAPI->>AdminAPI: authGuard + role admin
  RA->>Refresh: GET con cookie
  Refresh-->>RA: nuevo access_token
```

## Persistencia

- `Trip` usa colección/modelo `trip` con campos como `title`, `slug`, `category`, `lang`, `price`, `gallery`, `information`, `isDeals`, `discount`, `wetravel`, `meta_title`, `meta_description`, `navbar_description` y otros.
- `User` usa modelo `user` con `name`, `email`, `password`, `role`, `root` y `avatar`.
- `connectDB` cachea la conexión Mongoose en `global.mongoose`.

## Integraciones Externas Confirmadas

- MongoDB por `MONGODB_URI`.
- Resend por `RESEND_API_KEY`.
- reCAPTCHA por `RECAPTCHA_SECRET_KEY` y `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`.
- Google Tag Manager por `NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID`.
- WeTravel por campo `tour.wetravel`.
- API externa `machupicchuavailability.com` para disponibilidad en slugs específicos.

## Integraciones Pendientes De Confirmar

- WordPress headless: cliente presente, sin uso confirmado en rutas actuales.
- Cloudinary: helpers y variables presentes, pero el flujo admin leído guarda imágenes localmente en `public/storage`.
- PayPal: variable y dependencia presentes, uso activo no confirmado.
