# Componentes

Descripción de cada componente que participa en el render de la página de
detalle, sus props y responsabilidades.

## Árbol de componentes

```
TourPage ([travel]/[slug].js)
├── TourSeo                          src/components/travel/tour-page/TourSeo.js
├── TourHero                         src/components/travel/tour-page/TourHero.js
├── TourMainContent                  src/components/travel/tour-page/TourMainContent.js
│   ├── Tabs (móvil < lg)            src/components/general/Tabs.js
│   │   └── AccordionFromHtml        (para el itinerario)
│   ├── TourContentDesktop (≥ lg)    src/components/travel/tour-page/TourContentDesktop.js
│   └── Calendar (modal)             src/components/Availability.js
├── TravelSectionTitle               src/components/travel/TravelSectionTitle.js
├── TourSlider                       src/components/Slider.js
└── CategoryFAQs (dynamic import)    src/components/category/CategoryFAQs.js
```

---

## `TourSeo`

**Responsabilidad:** todo el SEO técnico del detalle. No renderiza UI visible.

Props: `{ tour, category, categoryTitle, originalPrice }`.

Genera:

1. **`<Head>` con JSON-LD** (array de 4 schemas):
   - `Organization` — marca, logo y redes (`BRAND.social`).
   - `TouristAttraction` — nombre, descripción, todas las imágenes de la galería.
   - `Product` — precio (`originalPrice.toFixed(2)`), `Offer` con
     `priceValidUntil` = hoy + 1 año, y `AggregateRating` **fijo** (4.9 / 150
     reviews).
   - `BreadcrumbList` — Home → categoría → tour.
2. **`<NextSeo>`** — `title`, `description`, `canonical` y `openGraph`
   (usa `gallery[0]` como imagen OG 1600×620).

URLs absolutas construidas con `absoluteUrl()` de `brandConfig`.

> ⚠️ El `AggregateRating` está **hardcodeado**. Si se auditan rich results,
> tenerlo en cuenta.

---

## `TourHero`

**Responsabilidad:** cabecera visual full-bleed del tour.

Props: `{ category, categoryTitle, heroImage, locale, originalPrice, tour }`.

Contiene:

- Fondo con `heroImage` (= `gallery[0].url` o imagen de categoría) + overlay
  oscuro (`bg-black/50`).
- Badge superior con `quickstats[0].content` (fallback "Tour").
- `<h1>` con `tour.title` (fuente Playfair Display).
- Precio grande: `${originalPrice.toFixed(0)}` + "Per Person / Por Persona".
- Grid de **quickstats** (máx. 6) con iconos fijos por posición:

```js
const STAT_ICONS = [
  '/assets/icon/type-tour_vectorized.svg',      // quickstats[0]
  '/assets/icon/time_vectorized.svg',           // quickstats[1]
  '/assets/icon/group-zise_vectorized.svg',     // quickstats[2]
  '/assets/icon/dificult-meter_vectorized.svg', // quickstats[3]
  '/assets/icon/accommodation_vectorized.svg',  // quickstats[4]
  '/assets/icon/languages_vectorized.svg',      // quickstats[5]
];
```

El icono se elige por índice (`STAT_ICONS[index] || STAT_ICONS[0]`), por lo que
**el orden de `quickstats` determina el icono**.

---

## `TourMainContent`

**Responsabilidad:** el cuerpo principal de la página. Es el componente más
grande y orquesta contenido + interactividad.

Props (recibe estado y handlers desde la página):

```
category, categoryTitle, dataget, handleBackdropClick, handleClose, handleOpen,
isOpen, isZoomed, locale, modalRef, originalPrice, setIsZoomed, setTab, t, tab,
tour, tourDays, contactEmail
```

Renderiza en orden:

1. **Subtítulo** (`sub_title`) — H2 dorado, si existe.
2. **Highlight + brochure** — frase en cursiva y botón "Descargar Folleto"
   (`url_brochure`), si existen.
3. **Breadcrumb** — Home → categoría → título del tour.
4. **Descripción** (`tour.description`) — HTML parseado con
   `html-react-parser`; los `<p>` vacíos se sustituyen por un espaciador
   (`isEmptyDescriptionParagraph`). Incluye la imagen flotante
   (`gallery[length-1]`) con **zoom** a pantalla completa (`isZoomed`).
5. **Galería** — solo si `gallery.length > 1`: imagen grande activa
   (`gallery[tab]`) + miniaturas clicables (`setTab`).
6. **Información** (`tour.information`):
   - Móvil (`block lg:hidden`) → `<Tabs>`.
   - Desktop (`hidden lg:block`) → `<TourContentDesktop>`.
7. **Descuentos por grupo** (`ardiscounts`) — grid con precio calculado.
8. **Bloque de contacto** — teléfono WhatsApp fijo (`+51 970811976`) y email
   (`contactEmail` desde `BRAND`).
9. **CTA flotante** (`fixed bottom`) — botón que abre el modal o redirige
   (texto: `t.availability` si hay fechas, si no `t.booking`).
10. **Modal de disponibilidad** (`isOpen`) — renderiza `<Calendar>`.

---

## `TourContentDesktop`

**Responsabilidad:** vista desktop (≥ lg) de `tour.information` con navegación
lateral **sticky** y scroll-spy.

Props: `{ tourInformation = [], locale = 'en' }`.

Lógica interna:

- **`buildSections`** clasifica cada item por su `title` en `itinerary`,
  `includes` o `default` (ver [01-modelo-datos.md](./01-modelo-datos.md)).
- **`extractDaysFromHtml`** detecta encabezados "Day N / Día N" en el itinerario
  y genera sub-navegación (`DAY 1`, `DAY 2`, …).
- **`buildContentParserOptions`** transforma el HTML aplicando clases Tailwind a
  `h2/h3/h4`, `p`, `ul`, `ol`, `li` (y aplana listas anidadas).
- **`splitIncludesSection`** parte la sección "incluye" en dos columnas:
  **Incluye** (`isIncludeHeading`) vs **No incluye** (`isExcludeHeading`).
- **Scroll-spy**: un listener de `scroll`/`resize`/`orientationchange`
  (con `requestAnimationFrame`) marca la sección/día activo según la
  `activationLine` (= `headerOffset + 120`).
- **`scrollToId`** hace scroll suave a cada sección/día, compensando el alto del
  header sticky (`useHeaderOffset`).

La variable CSS `--header-offset` (de `useHeaderOffset`) coordina el
posicionamiento sticky de la nav y los títulos.

---

## `Tabs` (móvil)

Archivo: `src/components/general/Tabs.js`. Props: `{ tabsQuery }` (= `tour.information`).

- Barra de pestañas horizontal **sticky** (con sombra al fijarse mediante
  `IntersectionObserver` + sentinela).
- Cada pestaña = un item de `information`; muestra su `content` parseado.
- Si la pestaña es el itinerario (`isItineraryTab`) usa `AccordionFromHtml` para
  colapsar los días; el resto se renderiza con `parseSectionContent`
  (mismas reglas de transformación que en desktop).
- Se reinicia a la primera pestaña al cambiar de ruta (`router.asPath`).

---

## `Calendar` (Availability)

Archivo: `src/components/Availability.js`. Renderizado dentro del modal.

Props: `{ data, updatedAt, title, messages, tourDays, idTour, language }`.

- Calendario mensual con navegación de mes/año.
- Colorea cada día según **disponibilidad** (`data` de la API financiera):
  - `0` → rojo (sin cupos) → abre WhatsApp con mensaje "rojo".
  - `1–5` → naranja (pocos cupos) → WhatsApp con mensaje "naranja".
  - `> 5` → verde → abre checkout de **WeTravel** (`handleOpenIframe`).
- `handleOpenIframe` construye la URL de WeTravel con `idTour` (= `tour.wetravel`),
  `startDate` y `endDate` (calculado con `tourDays`).
- Los mensajes de WhatsApp vienen de `t.messages` (i18n).
- Muestra "Última actualización" con `updatedAt` de la API.

> Detalle: para fechas de años futuros muestra un número simulado de cupos
> (`Math.random()` 200–400) en lugar del dato real.

---

## `TourSlider`

Archivo: `src/components/Slider.js`. Carrusel de tours similares (`keen-slider`).

Props: `{ tours, t }` — recibe `similarTours.slice(0, 8)`.

- Autoplay cada 4 s (plugin propio, se pausa al hover/drag).
- Responsive: 1.15 / 2.2 / 3.5 / 4 slides según breakpoint.
- Cada tarjeta enlaza a `/${item.category}/${item.slug}`, muestra imagen
  (`gallery[0]`), badge de `discount`, `duration`, precio (con tachado si hay
  descuento) y CTA `t.btn_viewtrip`.

---

## `CategoryFAQs`

Archivo: `src/components/category/CategoryFAQs.js`. **Import dinámico** en la
página (`next/dynamic`, `ssr: true`, placeholder `min-h-[300px]`).

Props: `{ category }`.

- Contiene un diccionario `categoryFAQs` con 6 preguntas por categoría (ES/EN
  según `locale`); si la categoría no tiene set propio usa `generalFAQs`.
- Muestra las 6 primeras en grid de 2 columnas (acordeón controlado por
  `openIndex`).
- Emite **JSON-LD `FAQPage`** en `<Head>` (sanitizado con `DOMPurify`).

---

## `TravelSectionTitle`

Título de sección reutilizable (`src/components/travel/TravelSectionTitle.js`),
usado para "More {categoría} Tours". Prop: `{ title }`.

---

## Hook `useHeaderOffset`

Archivo: `src/hooks/useHeaderOffset.js`.

Devuelve la altura actual del header (`#headerDesktop`) para calcular offsets de
scroll/sticky. Se recalcula con `ResizeObserver`, `resize`, `orientationchange`
y cuando las fuentes terminan de cargar (`document.fonts.ready`). Lo usan
`TourContentDesktop` y `Tabs`.
