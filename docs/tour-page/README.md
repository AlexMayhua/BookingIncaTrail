# Página de Detalle de Tour — `[travel]/[slug].js`

Documentación completa de la ruta dinámica que renderiza el detalle de un tour
individual: `src/pages/[travel]/[slug].js`.

Esta ruta es la página más importante del sitio de cara a conversión: muestra un
tour concreto, su galería, itinerario, precios/descuentos, disponibilidad en
tiempo real y CTAs de reserva (WeTravel / WhatsApp).

## URL y parámetros

```
/[travel]/[slug]
   │        │
   │        └── slug del trip           → ej. "classic-inca-trail"
   └── categoría (normalizada)          → ej. "inca-trail"
```

Ejemplos reales:

- `/inca-trail/classic-inca-trail`
- `/salkantay/salkantay-trek-to-machu-picchu`
- `/rainbow-mountain/rainbow-mountain-day-tour`

El segmento `[travel]` se **normaliza** con `normalizeCategorySlug` (aplica
alias, minúsculas y trim). Si la categoría real del trip no coincide con el
`[travel]` de la URL → `notFound` (404). Esto evita URLs duplicadas para el
mismo tour bajo categorías incorrectas.

## Índice de la documentación

| Documento | Contenido |
|-----------|-----------|
| [01-modelo-datos.md](./01-modelo-datos.md) | Modelo `Trip` de Mongoose, TODOS los campos, y la estructura interna de los arrays (`gallery`, `information`, `quickstats`, `ardiscounts`). |
| [02-flujo-datos.md](./02-flujo-datos.md) | ISR (`getStaticPaths` / `getStaticProps`), capa service → repository → MongoDB, y cómo llegan los props a la página. |
| [03-componentes.md](./03-componentes.md) | Árbol y descripción de cada componente (`TourSeo`, `TourHero`, `TourMainContent`, `TourContentDesktop`, `Availability`, `Slider`, `CategoryFAQs`, `Tabs`). |
| [04-estado-interactividad.md](./04-estado-interactividad.md) | Estado de React, API de disponibilidad financiera, modal de reserva, galería, zoom y navegación sticky. |
| [05-elementos-clave.md](./05-elementos-clave.md) | Helpers de categoría, i18n, config de marca, SEO/JSON-LD e integraciones externas (WeTravel, WhatsApp, machupicchuavailability). |
| [REDISEÑO.md](./REDISEÑO.md) | **Brief para el nuevo diseño (otro proyecto)**: auditoría móvil con Playwright, duplicidad a eliminar, requisitos SEO/i18n (canonical + hreflang EN/ES) y guía de dirección visual. |
| [REDISEÑO-BD.md](./REDISEÑO-BD.md) | **Brief del nuevo modelo de datos normalizado**: colecciones (Category, Tour, TourTranslation, Section, Faq, Media, Reviews), FKs simuladas, índices, i18n con slugs por locale, read model de navbar, rendimiento/build y plan de migración. |
| [REDISEÑO-SEO-SCHEMA.md](./REDISEÑO-SEO-SCHEMA.md) | **Brief de datos estructurados (JSON-LD)**: análisis de los warnings de Search Console, campo por campo del `Product`/`Offer`, de dónde salen las reseñas reales, `returnPolicyCategory` vs Términos, y snippet completo. |

## Vista rápida del render

```
<TourPage>
├── <TourSeo>            → <Head> JSON-LD + <NextSeo> (meta, OG, canonical)
├── <TourHero>           → imagen fondo, título, precio, quickstats (6 iconos)
├── <TourMainContent>    → subtítulo, highlight, brochure, breadcrumb,
│   │                       descripción HTML, galería, información (tabs/desktop),
│   │                       descuentos por grupo, bloque de contacto, CTA flotante
│   ├── <Tabs>           → información en móvil (< lg)
│   ├── <TourContentDesktop> → información en desktop (≥ lg) con nav sticky
│   └── <Calendar>       → modal de disponibilidad (Availability.js)
├── "More {categoría} Tours"
│   └── <TourSlider>     → carrusel de tours similares (keen-slider)
└── <CategoryFAQs>       → FAQs por categoría (carga dinámica, JSON-LD FAQPage)
```

## Dependencias directas (imports de la página)

| Import | Rol |
|--------|-----|
| `getTripBySlug`, `getToursByCategory` | Servicios de datos (`trip.service`). |
| `getCategoryTitle`, `getCategoryImagePath`, `normalizeCategorySlug` | Helpers de categoría. |
| `BRAND` | Config de marca (email de contacto, URLs, redes). |
| `en` / `es` (`@/lang/*/slug`) | Diccionarios i18n de la página. |
| `TravelSectionTitle`, `TourSlider` | Título reutilizable + carrusel de similares. |
| `TourSeo`, `TourHero`, `TourMainContent` | Bloques principales del detalle. |
| `CategoryFAQs` | Import **dinámico** (`next/dynamic`, `ssr: true`). |
