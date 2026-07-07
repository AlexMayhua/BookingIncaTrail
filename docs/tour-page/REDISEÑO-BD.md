# Rediseño de Base de Datos — Modelo Normalizado (Brief / Anotaciones)

> **Propósito.** Documento de diseño para un **nuevo modelo de datos** más
> estructurado, normalizado y flexible, orientado a **SEO, tiempos de consulta y
> build**. NO modifica el código ni el esquema actuales: es el plano para
> construir la nueva estructura (en otro proyecto o en una fase posterior).
>
> Continúa la línea de [REDISEÑO.md](./REDISEÑO.md) (UI/SEO). Aquí el foco es la
> **capa de datos** que alimenta `[travel]/[slug].js` y `[travel].js`.
>
> Contexto del modelo actual: [01-modelo-datos.md](./01-modelo-datos.md) ·
> [02-flujo-datos.md](./02-flujo-datos.md) · [05-elementos-clave.md](./05-elementos-clave.md).

- **Fecha:** 2026-07-07
- **Decisiones fijadas:** entregable = solo diseño · i18n = **tabla de traducciones** (normalizado).

---

## 0. Resumen ejecutivo

Hoy todo vive en **una sola colección `trips`** (un documento por idioma) con
arrays sin esquema (`gallery`, `information`, `quickstats`, `ardiscounts`), y las
**categorías y FAQs están hardcodeadas en el código** (`categoryHelpers.js`,
`CategoryFAQs.js`). Eso provoca:

- Duplicación de datos entre idiomas y matching de slug frágil.
- FAQs que **no** pueden alimentar bien el JSON-LD (`FAQPage`) porque no están en BD.
- Categorías sin contenido propio para `[travel].js` (título/desc/hero hardcodeados).
- Consultas que traen documentos completos aunque solo se necesiten campos mínimos.

El rediseño separa las entidades y aplica **un principio rector**:

> **Normalizar lo compartido, consultado o reutilizado** (categorías, media,
> FAQs, tours y sus traducciones, secciones de contenido).
> **Embeber lo pequeño y propio del tour que siempre se lee junto** (quickstats,
> descuentos por grupo, config de disponibilidad).

---

## 1. Diagrama de entidades (ER)

```
                         ┌───────────────────┐
                         │     Category      │
                         │  (idioma-neutro)  │
                         │  _id, key, order, │
                         │  isNavbar, ...    │
                         └─────────┬─────────┘
                                   │ 1
                 ┌─────────────────┼──────────────────┐
                 │ N               │ N                │ N
        ┌────────▼─────────┐  ┌────▼──────────────┐   │
        │ CategoryTransl.  │  │       Tour        │   │
        │ categoryId (FK)  │  │  (idioma-neutro)  │   │
        │ locale, slug,    │  │ _id, categoryId FK│   │
        │ title, meta, ... │  │ price, wetravel,  │   │
        └──────────────────┘  │ availability{},   │   │
                              │ quickstats[],     │   │
                              │ groupDiscounts[]  │   │
                              └───┬───────┬───────┘
                        1 │        │ 1     │ 1
             ┌────────────▼──┐  ┌──▼──────────────┐  ┌▼───────────────┐
             │ TourTranslat. │  │  TourSection    │  │   TourImage    │
             │ tourId (FK)   │  │  tourId (FK)    │  │  tourId (FK)   │
             │ locale, slug, │  │  type, order    │  │  mediaId (FK)──┼──► Media
             │ title, desc,  │  │       │ 1        │  │  role, order   │   _id,url,
             │ meta_*, ...   │  │       │ N        │  │  alt{en,es}    │   w,h,mime
             └───────────────┘  │  ┌────▼────────┐ │  └────────────────┘
                                │  │SectionTransl│ │
                                │  │ sectionId FK│ │        ┌──────────┐
                                │  │ locale,     │ │        │   Faq    │
                                │  │ title,      │ │        │ scope,   │
                                │  │ content     │ │        │ refId FK │
                                │  └─────────────┘ │        │ order    │
                                └──────────────────┘        └────┬─────┘
                                                                 │ 1
                                                            ┌────▼────────┐
                                                            │ FaqTransl.  │
                                                            │ faqId (FK)  │
                                                            │ locale,     │
                                                            │ question,   │
                                                            │ answer      │
                                                            └─────────────┘
```

**Colecciones nuevas:** `categories`, `category_translations`, `tours`,
`tour_translations`, `tour_sections`, `tour_section_translations`, `media`,
`tour_images`, `faqs`, `faq_translations`.
**Embebido dentro de `tours`:** `quickstats[]`, `groupDiscounts[]`, `availability{}`.

---

## 2. Colecciones (esquema propuesto)

Notación: 🔑 índice · `→` referencia (FK simulada, ver §4).

### 2.1 `categories` (idioma-neutro)

| Campo | Tipo | Notas |
|-------|------|-------|
| `_id` | ObjectId | PK. |
| `key` | String | Clave canónica estable: `inca-trail`, `salkantay`… 🔑 único. Reemplaza `NAVBAR_CATEGORY_KEYS`. |
| `order` | Number | Orden global. |
| `isNavbar` | Boolean | Aparece en el navbar. 🔑 |
| `navbarOrder` | Number | Orden dentro del navbar. |
| `heroMediaId` | ObjectId → `media` | Imagen de categoría (reemplaza `getCategoryImagePath`). |
| `status` | String | `published` / `draft`. |
| `createdAt/updatedAt` | Date | timestamps. |

### 2.2 `category_translations`

| Campo | Tipo | Notas |
|-------|------|-------|
| `_id` | ObjectId | PK. |
| `categoryId` | ObjectId → `categories` | 🔑 |
| `locale` | String | `en` / `es`. |
| `slug` | String | Slug **localizado** (define `[travel]`). 🔑 `{locale, slug}` único. |
| `title` | String | Reemplaza `getCategoryTitle`. |
| `description` | String | Reemplaza `getCategoryDescription`. |
| `meta_title` / `meta_description` | String | SEO de `[travel].js`. |
| `h1` / `intro` | String | Contenido propio de la página de categoría. |

🔑 índices: `{ locale, slug }` (único), `{ categoryId, locale }` (único).

### 2.3 `tours` (idioma-neutro — datos compartidos)

| Campo | Tipo | Notas |
|-------|------|-------|
| `_id` | ObjectId | PK. |
| `categoryId` | ObjectId → `categories` | 🔑 |
| `price` | Number | USD. |
| `durationDays` / `durationNights` | Number | Estructurado (hoy `duration` es String libre). |
| `wetravel` | String | UUID checkout. |
| `difficulty` | String | enum controlado. |
| `groupSizeMax` | Number | — |
| `isDeals` | Boolean | 🔑 |
| `discount` | Number | % listados. |
| `enableDiscount` | Boolean | — |
| `sku` / `code` | String | Identificador de producto para JSON-LD (`sku`/`mpn`). |
| `itemCondition` | String | Fijo `NewCondition` (o config). Para `Offer`. |
| `cancellationPolicy` | Object | `{ category, days, url }` → `hasMerchantReturnPolicy` (ver [REDISEÑO-SEO-SCHEMA.md §6](./REDISEÑO-SEO-SCHEMA.md)). |
| `order` | Number | Orden en su categoría. |
| `status` | String | `published` / `draft` / `archived`. 🔑 |
| `availability` | Object (embebido) | Ver §2.9. **Elimina el `switch` hardcodeado** de `[slug].js`. |
| `quickstats` | Array (embebido) | Ver §2.8. |
| `groupDiscounts` | Array (embebido) | Ver §2.8 (antes `ardiscounts`). |
| `createdAt/updatedAt` | Date | timestamps. |

### 2.4 `tour_translations`

| Campo | Tipo | Notas |
|-------|------|-------|
| `_id` | ObjectId | PK. |
| `tourId` | ObjectId → `tours` | 🔑 |
| `locale` | String | `en` / `es`. |
| `slug` | String | Slug **localizado** (define `[slug]`). 🔑 `{locale, slug}` único. |
| `title` | String | — |
| `sub_title` | String | — |
| `highlight` | String | — |
| `description` | String (HTML) | Intro enriquecida (sanitizar). |
| `navbar_description` | String | Para el read model del navbar. |
| `url_brochure` | String | — |
| `offer` | String | — |
| `meta_title` / `meta_description` | String | SEO de `[slug].js`. |

🔑 índices: `{ locale, slug }` (único), `{ tourId, locale }` (único).

> Denormalización útil: guardar `categorySlug` (del locale) en
> `tour_translations` para construir URLs/hreflang sin un join extra en el hot path.

### 2.5 `tour_sections` (el array `information` normalizado)

| Campo | Tipo | Notas |
|-------|------|-------|
| `_id` | ObjectId | PK. |
| `tourId` | ObjectId → `tours` | 🔑 |
| `type` | String | `itinerary` / `includes` / `default`. Sustituye la detección por título. |
| `order` | Number | Orden de secciones. |

### 2.6 `tour_section_translations`

| Campo | Tipo | Notas |
|-------|------|-------|
| `sectionId` | ObjectId → `tour_sections` | 🔑 |
| `locale` | String | `en` / `es`. |
| `title` | String | Título de la sección. |
| `content` | String (HTML) | Contenido (sanitizar). |

> **Itinerario estructurado (opcional, recomendado a futuro):** en vez de HTML
> con "Day N", una sub-colección `itinerary_days(sectionId, dayNumber, order)` +
> traducción `(title, body)`. Habilita JSON-LD de itinerario y navegación por día
> sin parsear HTML. Se puede posponer sin bloquear el rediseño.

### 2.7 `media`, `tour_images`, `faqs`, `faq_translations`

**`media`** (biblioteca de imágenes reutilizable):

| Campo | Tipo | Notas |
|-------|------|-------|
| `_id` | ObjectId | PK. |
| `url` | String | 🔑 único. |
| `width` / `height` | Number | Para `next/image` y OG. |
| `mimeType` | String | — |
| `categoryId` | ObjectId → `categories` | Opcional (organización). |

**`tour_images`** (join tour ↔ media, con rol y orden — simula N:M ordenada):

| Campo | Tipo | Notas |
|-------|------|-------|
| `tourId` | ObjectId → `tours` | 🔑 |
| `mediaId` | ObjectId → `media` | — |
| `role` | String | `hero` / `gallery` / `description`. Sustituye el uso por posición (`gallery[0]`, `gallery[last]`). |
| `order` | Number | Orden en la galería. |
| `alt` | Object `{en, es}` | Alt **localizado** (accesibilidad + SEO). |

**`faqs`** (pregunta/respuesta en BD — alimenta JSON-LD `FAQPage`):

| Campo | Tipo | Notas |
|-------|------|-------|
| `_id` | ObjectId | PK. |
| `scope` | String | `category` / `tour`. |
| `refId` | ObjectId | → `categories` o `tours` según `scope`. 🔑 `{scope, refId}`. |
| `order` | Number | — |

**`faq_translations`**: `{ faqId → faqs, locale, question, answer }`.

> Esto convierte las FAQs hardcodeadas de `CategoryFAQs.js` en datos, y permite
> generar el `FAQPage` JSON-LD **desde la misma fuente** que se muestra (sin
> divergencias).

### 2.8 Embebidos en `tours` (pequeños y siempre co-leídos)

```js
// quickstats: máximo 6, propios del tour, siempre se leen con el tour.
quickstats: [
  { icon: 'duration', order: 0,
    label: { en: 'Duration', es: 'Duración' },
    value: { en: '4D / 3N',  es: '4D / 3N' } },
  // ...
]

// groupDiscounts (antes ardiscounts)
groupDiscounts: [
  { persons: 2, pdiscount: 5 },
  { persons: 4, pdiscount: 10 },
]
```

**Por qué embebidos y no tablas:** son ≤ 6 elementos, no se consultan de forma
independiente, no se reutilizan entre tours y siempre se leen junto al tour.
Normalizarlos añadiría joins sin beneficio. El `icon` pasa a ser una **clave
semántica** (`duration`, `group`, `difficulty`…) en lugar de depender del orden
del array (bug actual `STAT_ICONS[index]`).

### 2.9 `availability` (embebido) — elimina el hardcode

```js
availability: {
  provider: 'machupicchu',   // o null si no aplica
  idRuta: 1,
  idLugar: 2,
  tourDays: 3,
  enabled: true,
}
```

Hoy el mapeo slug→API vive en un `switch` dentro de `[slug].js`. Moviéndolo al
documento, **añadir disponibilidad a un tour nuevo no requiere tocar código**.

### 2.10 `reviews` + `review_translations` (reseñas reales)

Necesarias para emitir `aggregateRating`/`review` **legítimos** (hoy están
hardcodeados/falsos — riesgo de penalización; ver
[REDISEÑO-SEO-SCHEMA.md §2 y §5](./REDISEÑO-SEO-SCHEMA.md)).

**`reviews`**

| Campo | Tipo | Notas |
|-------|------|-------|
| `_id` | ObjectId | PK. |
| `tourId` | ObjectId → `tours` | 🔑 |
| `authorName` | String | Autor real. |
| `rating` | Number | 1–5. |
| `source` | String | `first-party` / `tripadvisor` / `trustpilot`… (trazabilidad). |
| `datePublished` | Date | — |
| `status` | String | `published` / `pending`. |

**`review_translations`**: `{ reviewId → reviews, locale, body }` (el cuerpo puede
traducirse; `rating`/`author` son neutros).

> **Regla:** solo se muestran/serializan reseñas `published` y **visibles en la
> página**; el `aggregateRating` se calcula de esas mismas reseñas (coincidencia
> obligatoria con lo visible). Fuentes posibles en
> [REDISEÑO-SEO-SCHEMA.md §5](./REDISEÑO-SEO-SCHEMA.md).

---

## 3. Estrategia i18n y URLs matcheadas EN/ES

### 3.1 Slugs localizados

Cada traducción tiene su propio `slug`. Ejemplo:

| tourId | locale | categorySlug | slug | URL |
|--------|--------|--------------|------|-----|
| `T1` | `en` | `inca-trail` | `classic-inca-trail` | `/inca-trail/classic-inca-trail` |
| `T1` | `es` | `camino-inca` | `camino-inca-clasico` | `/es/camino-inca/camino-inca-clasico` |

> Hoy ambos idiomas comparten el mismo slug de URL y el canonical es idéntico
> (duplicado — ver [REDISEÑO.md §3](./REDISEÑO.md)). Con slug por locale, cada
> idioma tiene URL propia y correcta.

### 3.2 Resolución de canonical + hreflang (una sola consulta extra)

Dado un `tourId`, se leen **sus dos traducciones** para construir alternates:

```
canonical(locale)  = base + prefijo(locale) + '/' + categorySlug(locale) + '/' + slug(locale)
hreflang 'en'      = canonical('en')
hreflang 'es'      = canonical('es')
hreflang 'x-default' = canonical('en')   // defaultLocale del proyecto
```

Como `tour_translations` está indexado por `{ tourId, locale }`, obtener ambas
traducciones para los alternates es una lectura barata. Esto **habilita
directamente** los requisitos SEO de [REDISEÑO.md §3](./REDISEÑO.md).

### 3.3 "¿El contenido es adecuado para ambos idiomas?"

Sí, con la tabla de traducciones el contenido es **independiente por idioma**
(no una traducción-espejo forzada): cada `*_translation` puede tener su propio
título, meta, slug e incluso secciones/FAQs redactadas para su mercado. El
`Tour`/`Category` idioma-neutro garantiza que precio, categoría, media y
disponibilidad **no se dupliquen ni se desincronicen** entre idiomas.

---

## 4. Simulación de foreign keys en MongoDB

MongoDB no tiene FKs reales. La estrategia:

1. **Referencias por `ObjectId`** + `ref` de Mongoose (`categoryId`, `tourId`,
   `mediaId`, `faqId`, `sectionId`).
2. **Índice en cada FK** para joins/lookup rápidos.
3. **Lecturas**: `populate()` (Mongoose) o `$lookup` (aggregation) cuando se
   necesitan datos relacionados; en el hot path, preferir **consultas dirigidas
   por índice** y denormalización puntual (ej. `categorySlug` en la traducción)
   para evitar joins.
4. **Integridad referencial en la capa de servicio** (Mongo no la impone):
   - Al borrar una `Category`, bloquear o cascada a `tours`/traducciones.
   - Al borrar un `Tour`, cascada a `tour_translations`, `tour_sections`(+trad),
     `tour_images`, `faqs`(scope=tour)+trad.
   - Validar que exista la `Category` referida antes de crear un `Tour`.
5. **Unicidad** que actúa como constraint: `{locale, slug}` único en traducciones
   evita colisiones de URL.

---

## 5. Índices y patrones de consulta por página

### 5.1 `[travel]/[slug].js` (detalle de tour)

```
1) tour_translations.findOne({ locale, slug })      🔑 {locale,slug}   → tourId (+ datos i18n)
2) tours.findById(tourId)                            PK                 → datos neutros + embebidos
3) tour_sections + tour_section_translations         🔑 {tourId}/{sectionId,locale}
4) tour_images (+ media)                             🔑 {tourId}
5) faqs(scope=tour|category) + faq_translations      🔑 {scope,refId}
6) tour_translations.find({ tourId })                🔑 {tourId,locale}  → hreflang alternates
7) similares: tours.find({ categoryId }) + trad.     🔑 {categoryId}
```

Todo por índice. Los pasos 2–5 pueden resolverse con **una aggregation con
`$lookup`** (un round-trip) o 3–4 lecturas indexadas paralelas. Se sirve bajo ISR
(`revalidate`), así que la consulta ocurre en revalidación, no en cada request.

### 5.2 `[travel].js` (categoría)

```
1) category_translations.findOne({ locale, slug })   🔑 {locale,slug}   → categoryId + contenido
2) tours.find({ categoryId, status:'published' })    🔑 {categoryId,status}
   + tour_translations por {tourId, locale} (proyección mínima para tarjetas)
3) faqs(scope=category, refId=categoryId) + trad.
```

### 5.3 Navbar (read model dedicado)

Ver §6.

---

## 6. Read model / snapshot del navbar

El navbar hoy ya usa un **snapshot** (`src/data/navbarSnapshot.json`) generado en
build. Se formaliza como un **read model** derivado del modelo normalizado:

- Consulta única: `categories.find({ isNavbar:true }).sort(navbarOrder)` + por cada
  una, top-N `tours` (`order`) con **proyección mínima** vía `tour_translations`
  (`title`, `navbar_description`, `slug`, `categorySlug`, primera imagen).
- Materializar por locale en un documento/JSON (`navbar_snapshots` o el JSON actual).
- El navbar **no** consulta la colección pesada de tours: lee solo el read model.

> Esto responde a tu punto: "el navbar debería ir aparte, con solo esa consulta y
> los nombres/info más importante". La proyección mínima + read model logra
> exactamente eso, sin arrastrar `information`/`description`.

Alternativa sin snapshot: una vista/colección materializada `nav_items` que el
admin refresca al publicar. Recomendado si se quiere navbar siempre fresco sin
rebuild.

---

## 7. Rendimiento y build

**Consultas / tiempo de respuesta:**
- Proyecciones mínimas por defecto (nunca traer HTML pesado para listados/navbar).
- Índices compuestos alineados a cada acceso (§5).
- Denormalización selectiva (`categorySlug` en traducción) para evitar joins en caliente.

**Build (hoy lento):**
- El build actual ejecuta `navbar:generate && next build`; con el read model, la
  generación del navbar es **una consulta proyectada barata** por locale.
- Mantener `getStaticPaths` con `fallback: 'blocking'` (no pre-render masivo) para
  que el build **no** escale con el nº de tours; el modelo normalizado + índices
  hacen que la generación on-demand (ISR) sea rápida.
- Opcional: pre-render solo del **top-N** por categoría (los más visitados) y el
  resto on-demand, para equilibrar TTFB y tiempo de build.
- Separar contenido pesado (secciones/HTML) de los listados evita cargar y
  serializar datos que la página de listado no usa.

> Nota honesta: parte del tiempo de `next build` es compilación de JS/bundling y
> no depende de la BD. El rediseño ataca lo que **sí** depende de datos:
> generación del navbar, consultas de ISR y peso de payload por página.

---

## 8. Mapeo de migración (actual → nuevo)

| Actual (`trips`) | Destino |
|------------------|---------|
| `title, sub_title, highlight, description, navbar_description, url_brochure, offer, meta_title, meta_description` | `tour_translations` (por `locale`). |
| `price, wetravel, discount, isDeals, enableDiscount` | `tours` (neutro). |
| `duration` (String) | `tours.durationDays/Nights` (parsear). |
| `category` (String) | `tours.categoryId` (resolver/crear `categories` + `category_translations`). |
| `lang` | Determina `locale` de las filas `*_translation`. |
| `linkedTripId` | Se reemplaza por `tourId` compartido entre traducciones. |
| `gallery[]` | `media` + `tour_images` (con `role`/`order`/`alt{en,es}`). |
| `information[]` | `tour_sections` + `tour_section_translations` (asignar `type`). |
| `quickstats[]` | `tours.quickstats[]` (estructurado con `icon` semántico + i18n). |
| `ardiscounts[]` | `tours.groupDiscounts[]`. |
| Hardcode `categoryHelpers.js` | `categories` + `category_translations`. |
| Hardcode `CategoryFAQs.js` | `faqs` + `faq_translations` (scope=category). |
| Hardcode `switch` disponibilidad | `tours.availability{}`. |

**Fases sugeridas** (para la fase de implementación, fuera de este doc):
1. Crear colecciones + índices (sin borrar `trips`).
2. Script de migración idempotente: agrupar `trips` por `linkedTripId`/slug →
   `tours` + traducciones; extraer categorías, media, FAQs, secciones.
3. Verificación (conteos, URLs, hreflang, JSON-LD) contra producción.
4. Conmutar servicios de lectura al nuevo modelo detrás de un flag.
5. Retirar `trips` y los hardcodes.

---

## 9. Impacto en SEO

- **FAQs en BD** → `FAQPage` JSON-LD generado desde la misma fuente visible (sin
  divergencia texto/rich-result).
- **Slugs por locale + traducciones** → canonical propio por idioma + hreflang
  recíprocos + `x-default` (resuelve la duplicidad de [REDISEÑO.md §3](./REDISEÑO.md)).
- **`categories` con contenido** → `[travel].js` con meta/H1/intro propios por
  idioma (hoy hardcodeados/genéricos).
- **Media con `width/height/alt{en,es}`** → OG e `next/image` correctos y alt
  localizado.
- **Secciones tipadas** → base para JSON-LD de itinerario a futuro.

---

## 10. Criterios de aceptación del diseño

- [ ] Categorías, FAQs, media, secciones y traducciones son **datos**, no código.
- [ ] Un `Tour` idioma-neutro; contenido por idioma en `*_translation` con slug propio.
- [ ] FKs simuladas con `ObjectId` + índice + integridad en servicio.
- [ ] Cada página resuelve su consulta por índice con proyección mínima.
- [ ] Navbar servido por un read model ligero, sin tocar la colección pesada.
- [ ] `availability` en datos (sin `switch` en código).
- [ ] Plan de migración idempotente y reversible por flag.
- [ ] Habilita canonical/hreflang por idioma y `FAQPage` JSON-LD desde BD.

---

## 11. Decisiones abiertas (para validar antes de implementar)

1. **Itinerario**: ¿HTML en `tour_section_translations` (rápido) o
   `itinerary_days` estructurado (mejor SEO, más trabajo)? — recomendado empezar
   en HTML y evolucionar.
2. **Alt de media**: `alt{en,es}` en `tour_images` (propuesto) vs
   `media_translations`. — embebido es suficiente salvo reuso intensivo de media.
3. **Navbar**: snapshot en build (actual) vs colección materializada refrescada
   por el admin. — depende de cuán "fresco" deba estar el navbar.
4. **quickstats**: embebido (propuesto) vs colección `tour_stats`. — embebido
   salvo que quieras filtrar/consultar por stat.
