# Overview

BookingIncaTrail es una aplicación Next.js para publicar tours y trekking en Perú, con páginas públicas multidioma, detalle de tours, formulario de contacto, sitemaps dinámicos y un panel administrativo basado en React Admin.

## Stack Confirmado

- Next.js `15.1.11` con Pages Router en `src/pages`.
- React `19.2.3`.
- Tailwind CSS `3.4.19` con PostCSS y Autoprefixer.
- MongoDB/Mongoose para persistencia de trips y usuarios.
- React Admin `5.14.3` para `/admin/ra`.
- `next-seo` para SEO por página.
- `@next/third-parties/google` para Google Tag Manager.
- Resend para envío del formulario de contacto.
- reCAPTCHA para validar el formulario de contacto.
- `nextjs-cors` para CORS en rutas API.
- WeTravel se usa como checkout externo cuando el tour tiene `wetravel`.

## Router

El proyecto usa Pages Router. No se encontró carpeta `app/` en la raíz ni `pages/` en la raíz. Las rutas están en `src/pages`.

## Funcionalidades Confirmadas

- Home con tours obtenidos desde MongoDB mediante `listTrips` y generación estática con ISR.
- Rutas dinámicas de categoría: `/:travel`.
- Rutas dinámicas de tour: `/:travel/:slug`.
- i18n configurado en Next.js con locales `en` y `es`, default `en`.
- Formulario de contacto en `/contact` que llama a `/api/contact`.
- Panel admin en `/admin/ra/[[...slug]]` con recursos `trips` y `users`.
- APIs públicas para trips, categorías, deals y navbar.
- APIs protegidas para administrar trips y usuarios.
- Sitemaps dinámicos en `/sitemap.xml`, `/sitemap-base.xml`, `/sitemap-en.xml` y `/sitemap-es.xml`.
- Snapshot de datos del navbar generado durante `npm run build`.
- Almacenamiento local de imágenes de galería bajo `public/storage` en flujos admin/migración.

## Pendiente De Confirmar

- Datos reales de producción en MongoDB y estructura exacta de documentos existentes.
- Si WordPress headless está en uso en producción. Existe `src/lib/wordpress.js`, pero no se encontraron imports desde páginas actuales.
- Configuración real de PayPal. Existe `NEXT_PUBLIC_PAYPAL_CLIENT_ID` y dependencia `react-paypal-button-v2`, pero el flujo activo observado usa WeTravel o WhatsApp.
- Flujo real del libro de reclamaciones. La página muestra un formulario, pero el submit actual solo ejecuta `alert` y no persiste ni envía datos.
- Si `src/components/navbar/Navbar.js` sigue en uso. El layout actual usa `Header`, no `Navbar`.

## Estructura Principal

```text
src/
  admin/               React Admin y data providers
  components/          Componentes UI públicos y compartidos
  hooks/               Hooks de navbar/header
  lang/                Textos en en/es
  layout/              Layout público global
  lib/                 Configuración, MongoDB, SEO/sitemap, clientes
  modules/             Lógica de dominio: auth, trips, users
  pages/               Pages Router y API routes
  store/               Contexto global básico
  styles/              CSS global y estilos específicos
  utils/               Helpers de categorías, CORS, imágenes, fetch
scripts/               Scripts operativos
public/                Assets públicos y storage local
```
