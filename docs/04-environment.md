# Environment

La referencia principal es `.env.example`. No se documentan valores de `.env` ni `.env.local` para evitar exponer secretos.

## Variables Confirmadas Por Codigo

| Variable | Uso observado | Publica |
| -------- | ------------- | ------- |
| `NEXT_PUBLIC_BASE_URL` | Declarada en `.env.example`; uso directo no confirmado. | Si |
| `NEXT_PUBLIC_API_URL` | Base API en cliente en `src/lib/constants.js`. | Si |
| `NEXT_PUBLIC_INTERNAL_API_URL` | Base API server-side en `src/lib/constants.js`. | Si |
| `MONGODB_URI` | Conexion Mongoose en `src/lib/mongodb.js` y scripts. | No |
| `NEXT_PUBLIC_BRAND_NAME` | Nombre de marca en `BRAND`. | Si |
| `NEXT_PUBLIC_SITE_URL` | Canonical, sitemap, CORS y marca. | Si |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Contacto, SEO y validacion de `/api/contact`. | Si |
| `NEXT_PUBLIC_CONTACT_PHONE` | Contacto visible y marca. | Si |
| `NEXT_PUBLIC_BLOG_URL` | Campo opcional en `BRAND`; uso activo pendiente de confirmar. | Si |
| `NEXT_PUBLIC_FACEBOOK_URL` | Links sociales. | Si |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Links sociales. | Si |
| `NEXT_PUBLIC_TIKTOK_URL` | Links sociales. | Si |
| `NEXT_PUBLIC_YOUTUBE_URL` | Links sociales. | Si |
| `NEXT_PUBLIC_GOOGLE_VERIFICATION` | Meta tag de Search Console en `next-seo.config.js`. | Si |
| `NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID` | GTM en `_app.js`. | Si |
| `RECAPTCHA_SECRET_KEY` | Validacion server-side en `/api/contact`. | No |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Widget de reCAPTCHA en formulario. | Si |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | Exportada en `src/lib/constants.js`; uso activo pendiente de confirmar. | Si |
| `ACCESS_TOKEN_SECRET` | Firma/verificacion de access token JWT. | No |
| `REFRESH_TOKEN_SECRET` | Firma/verificacion de refresh token JWT. | No |
| `RESEND_API_KEY` | Cliente Resend para `/api/contact`. | No |
| `NEXT_PUBLIC_CLOUD_NAME` | Helper de Cloudinary en `src/utils/imageUpload.js`. | Si |
| `NEXT_PUBLIC_CLOUD_API` | Endpoint Cloudinary en `src/utils/imageUpload.js`. | Si |
| `NEXT_PUBLIC_CLOUD_UPLOAD_PRESET_TRIP` | Preset upload para trips. | Si |
| `NEXT_PUBLIC_CLOUD_UPLOAD_PRESET_BLOG` | Preset upload para blog. | Si |
| `NEXT_PUBLIC_WORDPRESS_URL` | Cliente WordPress headless. | Si |
| `NODE_ENV` | CORS/cookies y entorno Next.js. | No |
| `PORT` | Fallback de API URL y PM2. | No |

## Variables Minimas Para Desarrollo Funcional

- `MONGODB_URI`: necesaria para consultar trips/usuarios y para el build si se quiere generar navbar real.
- `NEXT_PUBLIC_SITE_URL`: importante para canonical, sitemap y CORS en producción.
- `ACCESS_TOKEN_SECRET` y `REFRESH_TOKEN_SECRET`: necesarias para login/admin.
- `RESEND_API_KEY`, `RECAPTCHA_SECRET_KEY` y `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`: necesarias para que `/api/contact` funcione completamente.

## CORS

`src/utils/cors.js` permite en desarrollo:

- `http://localhost:3000`
- `http://localhost:3001`
- `http://127.0.0.1:3000`

En producción usa `NEXT_PUBLIC_SITE_URL`. Si no está configurado, retorna `https://none.invalid` como fallback restrictivo.

Nota: algunos endpoints públicos de trips usan `NextCors` directamente con `origin: '*'`. Es comportamiento actual observado.

## Seguridad

- Las variables sin `NEXT_PUBLIC_` no deben exponerse en cliente.
- `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `RESEND_API_KEY`, `RECAPTCHA_SECRET_KEY` y `MONGODB_URI` deben mantenerse fuera del repositorio.
- Pendiente de confirmar: politica final para CORS abierto en endpoints públicos.
