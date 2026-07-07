# Elementos Clave para el Funcionamiento

Utilidades, configuración e integraciones externas de las que depende la página.

## 1. Helpers de categoría — `src/utils/categoryHelpers.js`

Funciones puras (cliente y servidor) que gobiernan la relación entre el segmento
`[travel]` de la URL y los datos:

| Función | Uso en la página |
|---------|------------------|
| `normalizeCategorySlug(cat)` | Aplica `CATEGORY_ALIASES`, minúsculas y trim. Se usa en `getStaticProps` para normalizar la URL y validar coherencia. |
| `getCategoryTitle(cat, locale)` | Título legible de la categoría (ES/EN) → breadcrumb, JSON-LD, título de similares. |
| `getCategoryImagePath(cat)` | Imagen de fallback del hero cuando `gallery[0]` no existe. |

Constantes importantes:

```js
export const CATEGORY_ALIASES = { 'peru-packajes': 'peru-packages' };
export const NAVBAR_CATEGORY_KEYS = [
  'inca-trail', 'salkantay', 'rainbow-mountain', 'ausangate',
  'day-tours', 'peru-packages', 'inca-jungle',
];
```

El diccionario de títulos/descripciones/imágenes cubre 13 categorías
(actualizado enero 2026: se eliminó `alternative-tours` y se añadieron
`choquequirao`, `sacred-lakes`, `luxury-glamping`, `family-tours`,
`sustainable-tours`).

## 2. Internacionalización (i18n)

- El idioma se toma de `router.locale` (Next.js i18n).
- La página elige el diccionario: `const t = locale === 'en' ? en : es;`
  (`src/lang/en/slug.js` / `src/lang/es/slug.js`).
- Claves usadas: `have_questions`, `call`, `email`, `availability`, `booking`,
  `from`, `btn_viewtrip`, y `messages` (los 3 textos de WhatsApp según cupos).
- Muchos textos cortos se resuelven inline con `locale === 'en' ? '…' : '…'`
  (ej. "Per Person / Por Persona", "Download Brochure / Descargar Folleto").

```js
messages: [
  { message_green_start, message_green_end },   // verde (hay cupos)
  { message_orange_start, message_orange_end }, // naranja (pocos cupos)
  { message_red_start, message_red_end },       // rojo (sin cupos)
]
```

## 3. Configuración de marca — `src/lib/brandConfig.js`

Objeto `BRAND` alimentado por variables de entorno `NEXT_PUBLIC_*`
(reemplazable sin tocar código). Lo que usa la página:

| Uso | Valor |
|-----|-------|
| `BRAND.contactEmail` | Email del bloque de contacto (pasado como `contactEmail`). |
| `BRAND.name` | Nombre en JSON-LD (`Organization`, `Product.brand`). |
| `BRAND.social.*` | `sameAs` en JSON-LD (facebook, instagram, tiktok, youtube). |
| `absoluteUrl(path)` | Construye URLs absolutas (canonical, OG, JSON-LD). |
| `getLogoUrlAbsolute()` | URL absoluta del logo para JSON-LD. |

Variables de entorno relevantes: `NEXT_PUBLIC_BRAND_NAME`,
`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CONTACT_EMAIL`,
`NEXT_PUBLIC_{FACEBOOK,INSTAGRAM,TIKTOK,YOUTUBE}_URL`.

> `NEXT_PUBLIC_SITE_URL` es **crítico** para SEO: sin él, canonical/OG apuntan a
> `http://localhost:3000`.

## 4. SEO / Datos estructurados

Generados por `TourSeo` (ver [03-componentes.md](./03-componentes.md)):

- **4 schemas JSON-LD**: `Organization`, `TouristAttraction`, `Product`
  (con `Offer` + `AggregateRating` fijo 4.9/150), `BreadcrumbList`.
- **`NextSeo`**: title, description, canonical y Open Graph con `gallery[0]`.
- `CategoryFAQs` añade un 5º schema `FAQPage`.

## 5. Integraciones externas

| Servicio | Para qué | Disparador |
|----------|----------|------------|
| **machupicchuavailability.com** | Disponibilidad de cupos por fecha. | `fetchFinancial()` solo para 3 slugs. |
| **WeTravel** (`checkout_embed`) | Checkout/reserva online (`uuid = tour.wetravel`). | CTA sin disponibilidad y días "verdes" del calendario. |
| **WhatsApp** (`api.whatsapp.com` / `wa.me`) | Contacto y reserva manual. Nº fijo `51970811976`. | CTA sin WeTravel y días naranja/rojo del calendario. |

### Flujo de reserva consolidado

```
                       ┌─ tiene disponibilidad ─→ modal <Calendar>
                       │                            ├─ día verde  → WeTravel
CTA "Booking/          │                            ├─ día naranja→ WhatsApp
 Availability" ────────┤                            └─ día rojo   → WhatsApp
                       │
                       └─ sin disponibilidad ─→ ¿wetravel? ─ SÍ → WeTravel
                                                            └ NO → WhatsApp
```

## 6. Rendimiento

- **ISR** (`revalidate: 3600`) + `fallback: 'blocking'` → páginas estáticas
  regeneradas cada hora sin re-deploy.
- Índices Mongo `{ slug, lang }` y `{ category, lang }`.
- `getToursByCategory` usa `.select(...)` para reducir el payload de similares.
- `next/image` en hero, galería y descripción (lazy/optimización).
- `CategoryFAQs` con **import dinámico** (code-splitting).
- API financiera con timeout de 5 s y `AbortController` (no bloquea el render).

## 7. Puntos de atención / mantenimiento

- **Datos hardcodeados**: `AggregateRating` (4.9/150), teléfono
  `51970811976`, y el mapeo slug→API financiera están en el código, no en BD.
- Añadir un tour con disponibilidad en tiempo real requiere **editar el
  `switch` de `fetchFinancial`** en `[slug].js`.
- El icono de cada `quickstat` depende del **orden** del array (`STAT_ICONS`).
- El orden de `gallery` importa: `[0]` = hero/OG, `[último]` = imagen flotante.
- La coherencia `category` ↔ `[travel]` es obligatoria o la página da 404.
