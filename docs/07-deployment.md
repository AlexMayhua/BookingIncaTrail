# Deployment

## Build De Produccion

```bash
npm install
npm run build
```

`npm run build` ejecuta primero `scripts/generate-navbar-snapshot.mjs`, que requiere `MONGODB_URI` para generar datos reales del navbar. Si falla, conserva/escribe fallback según disponibilidad del snapshot.

## Start De Produccion

```bash
npm run start
```

El script inicia:

```bash
next start -H 0.0.0.0 -p 3000
```

## PM2

Existe `ecosystem.config.js` con:

- App: `booking-inca-trail`.
- Script: `./node_modules/.bin/next`.
- Args: `start -p 3000`.
- `cwd`: `/root/projects/BookingIncaTRail`.
- Modo: `fork`, `instances: 1`.
- Logs: `/root/logs/booking-inca-error.log` y `/root/logs/booking-inca-out.log`.
- `NODE_ENV=production`, `PORT=3000`.

Ejemplo:

```bash
pm2 start ecosystem.config.js
```

Pendiente de confirmar: si el path `/root/projects/BookingIncaTRail` coincide con el servidor actual.

## Sitemaps

Los sitemaps se generan en runtime mediante `getServerSideProps`:

- `/sitemap.xml`
- `/sitemap-base.xml`
- `/sitemap-en.xml`
- `/sitemap-es.xml`

`next-sitemap.config.js` existe, pero está configurado con `exclude: ['/*']`, `generateRobotsTxt: false` y `generateIndexSitemap: false`. La generación activa observada es por rutas Next.js.

## Variables Criticas En Produccion

- `MONGODB_URI`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_INTERNAL_API_URL`
- `ACCESS_TOKEN_SECRET`
- `REFRESH_TOKEN_SECRET`
- `RESEND_API_KEY`
- `RECAPTCHA_SECRET_KEY`
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- `NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID` si se usa GTM

## Storage Local

El proyecto usa `/public/storage/**` para imágenes locales de trips en flujos de upload/migración. En despliegues con builds efímeros o contenedores, confirmar cómo se persiste ese directorio.

Pendiente de confirmar: estrategia final de persistencia de `public/storage` en producción.

## Base De Datos

La app depende de MongoDB para:

- Páginas de home/categorías/tours.
- Sitemaps de tours.
- Navbar dinámico.
- Admin de trips y usuarios.
- Auth admin.

Pendiente de confirmar: backups reales, porque `package.json` referencia `scripts/backup-mongodb.js`, pero ese archivo no se encontró en el árbol revisado.

## Checklist De Despliegue

- Configurar `.env.local` o variables del entorno del servidor.
- Ejecutar `npm install`.
- Validar conexión a MongoDB.
- Ejecutar `npm run build`.
- Verificar que `src/data/navbarSnapshot.json` se genere o conserve correctamente.
- Iniciar con `npm run start` o PM2.
- Verificar `/`, `/contact`, una categoría, un tour, `/sitemap.xml` y `/admin/ra`.
- Verificar que `/api/contact` tenga Resend y reCAPTCHA configurados.
