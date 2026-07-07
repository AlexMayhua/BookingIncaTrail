# Troubleshooting

## `Define MONGODB_URI en las variables de entorno`

Causa probable: falta `MONGODB_URI`. `src/lib/mongodb.js` lanza error al importarse si no existe.

Acciones:

- Definir `MONGODB_URI` en `.env.local` o entorno de producción.
- Verificar que el usuario/IP tenga acceso al cluster MongoDB.
- Reintentar `npm run dev` o `npm run build`.

## Build Falla En `navbar:generate`

El build ejecuta `scripts/generate-navbar-snapshot.mjs` antes de `next build`.

Causas posibles:

- `MONGODB_URI` ausente.
- MongoDB inaccesible.
- Permisos insuficientes para escribir `src/data/navbarSnapshot.json`.

Comportamiento observado:

- Si falla, el script intenta conservar snapshot existente.
- Si no existe snapshot, escribe fallback vacío.

## Navbar Sin Tours

Causas posibles:

- `src/data/navbarSnapshot.json` vacío o viejo.
- `/api/trip/navbar` falla.
- Categorías fuera de `NAVBAR_CATEGORY_KEYS`.
- No hay trips en MongoDB para `lang` actual o `lang: 'all'`.

Acciones:

- Revisar `src/data/navbarSnapshot.json`.
- Probar `/api/trip/navbar?category=inca-trail,salkantay,rainbow-mountain,ausangate,day-tours,peru-packages,inca-jungle&locale=en`.
- Validar campos `category`, `lang`, `slug`, `title`, `gallery` en trips.

## Categoria Devuelve 404

`src/pages/[travel].js` devuelve `notFound` si `getToursByCategory(category, lang)` no encuentra tours.

Acciones:

- Confirmar que el slug esté normalizado por `normalizeCategorySlug`.
- Confirmar que existan trips con `category` igual al slug.
- Confirmar `lang` del trip: debe coincidir con locale o ser `all`.

## Tour Devuelve 404

`src/pages/[travel]/[slug].js` devuelve `notFound` si:

- No existe trip con `slug` y `lang`.
- La categoría normalizada del tour no coincide con `params.travel`.

Acciones:

- Revisar `slug`, `category` y `lang` en MongoDB.
- Confirmar que el enlace use `/${category}/${slug}`.

## `/api/contact` Devuelve 500

Causas confirmadas por código:

- Falta `RESEND_API_KEY`.
- Falta `RECAPTCHA_SECRET_KEY`.
- Falta `NEXT_PUBLIC_CONTACT_EMAIL`.
- Error de Resend.

Acciones:

- Configurar variables requeridas.
- Verificar que el dominio/remitente `enquire@bookingincatrail.com` esté autorizado en Resend. Pendiente de confirmar en cuenta Resend.
- Revisar respuesta de reCAPTCHA.

## Login Admin Falla

Causas posibles:

- Usuario no existe en MongoDB.
- Password incorrecto.
- Usuario no tiene `role: 'admin'` ni `root: true`.
- Faltan `ACCESS_TOKEN_SECRET` o `REFRESH_TOKEN_SECRET`.
- Cookie `refreshtoken` bloqueada por CORS/domain/HTTPS.

Acciones:

- Verificar documento en colección de usuarios.
- Verificar variables JWT.
- Confirmar `NEXT_PUBLIC_SITE_URL` para CORS en producción.

## APIs Admin Devuelven 401/403

Causas posibles:

- Access token ausente o expirado.
- Refresh token ausente/expirado.
- Usuario sin rol `admin`.

Acciones:

- Reingresar en `/admin/ra`.
- Confirmar cookie `refreshtoken`.
- Confirmar rol de usuario.

## Imagenes No Cargan

`next.config.js` permite `/assets/**`, `/img/**`, `/home/**`, `/storage/**`, Cloudinary y localhost.

Causas posibles:

- URL remota no incluida en `remotePatterns`.
- Imagen local fuera de rutas permitidas.
- Archivo no existe en `public`.
- `public/storage` no persistido en producción.

Acciones:

- Verificar ruta real del archivo.
- Si se usa otro host remoto, agregarlo a `images.remotePatterns`.
- Confirmar persistencia de `public/storage`.

## Sitemaps Vacios O Con Error

Causas posibles:

- MongoDB inaccesible.
- No hay trips para `en`/`es`.
- `NEXT_PUBLIC_SITE_URL` mal configurado.

Acciones:

- Probar `/sitemap-base.xml` primero.
- Probar `/sitemap-en.xml` y `/sitemap-es.xml`.
- Validar `BRAND.siteUrl` desde `NEXT_PUBLIC_SITE_URL`.

## Scripts Referenciados No Encontrados

`package.json` referencia:

- `scripts/backup-mongodb.js`
- `scripts/generate-favicons.js`

No se encontraron en el árbol revisado. Pendiente de confirmar si fueron eliminados, si se generan en otro paso o si los scripts deben actualizarse.
