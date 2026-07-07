# Modelo de Datos — `Trip`

Archivo: `src/modules/trips/model/trip.model.js`

La página de detalle consume un único documento `Trip` de MongoDB (Mongoose).
El schema es intencionalmente **flexible**: la mayoría de campos son opcionales
y varios son arrays de subdocumentos libres (`type: Array`), por lo que su forma
real la define el panel admin al crear/editar el tour.

## Schema completo

```js
const TripSchema = new mongoose.Schema(
  {
    title:             { type: String },   // Título del tour (H1)
    sub_title:         { type: String },   // Subtítulo (H2 dorado)
    highlight:         { type: String },   // Frase destacada en cursiva
    price:             { type: Number },   // Precio base en USD
    duration:          { type: String },   // Duración legible ("4 Days / 3 Nights")
    category:          { type: String },   // Categoría (slug), define [travel]
    wetravel:          { type: String },   // UUID de WeTravel para checkout
    lang:              { type: String },   // 'en' | 'es' | 'all'
    description:       { type: String },   // HTML enriquecido (intro)
    information:       { type: Array },    // Secciones (itinerario, incluye, etc.)
    gallery:           { type: Array },    // Imágenes { url, alt }
    quickstats:        { type: Array },    // Datos rápidos { title, content }
    slug:              { type: String },   // Slug único, define [slug]
    offer:             { type: String },   // Texto de oferta (opcional)
    isDeals:           { type: Boolean },  // Marca como "deal"
    discount:          { type: Number },   // % de descuento (listados)
    meta_title:        { type: String },   // <title> SEO
    meta_description:  { type: String },   // meta description SEO
    navbar_description:{ type: String },   // Descripción corta para navbar
    linkedTripId:      { type: String },   // Vínculo a tour en otro idioma
    url_brochure:      { type: String },   // URL PDF del folleto
    enableDiscount:    { type: Boolean },  // Activa lógica de descuento
    ardiscounts:       { type: Array },    // Descuentos por tamaño de grupo
  },
  { timestamps: true },  // createdAt / updatedAt automáticos
);
```

## Índices

```js
TripSchema.index({ slug: 1, lang: 1 });      // ← usado por getTripBySlug
TripSchema.index({ category: 1, lang: 1 });  // ← usado por getToursByCategory
```

Estos dos índices compuestos son **clave para el rendimiento** de la página:
- `{ slug, lang }` resuelve la búsqueda del tour exacto.
- `{ category, lang }` resuelve la lista de tours similares.

## Registro del modelo

```js
export default mongoose.models.trip || mongoose.model('trip', TripSchema);
```

El patrón `mongoose.models.trip || …` evita recompilar el modelo en hot-reload
de Next.js (colección física: `trips`).

---

## Estructura de los campos `Array`

El schema declara estos campos como `Array` genérico; su forma real (deducida
del render en los componentes) es la siguiente.

### `gallery` — Galería de imágenes

```js
gallery: [
  { url: 'https://.../img-1.webp', alt: 'Machu Picchu al amanecer' },
  { url: 'https://.../img-2.webp', alt: '...' },
  // ...
]
```

Uso por posición (¡el orden importa!):

| Índice | Uso |
|--------|-----|
| `gallery[0]` | **Hero** de la página, imagen OG y primera imagen de JSON-LD `Product`. |
| `gallery[tab]` | Imagen grande activa de la galería (según pestaña seleccionada). |
| `gallery[length-1]` | Imagen **flotante** junto a la descripción (con zoom). |
| Miniaturas | Si `length > 5` se recorta la última (`slice(0, -1)`); si no, se muestran todas. |

- La galería solo se renderiza como grid si `gallery.length > 1`.
- Cada imagen usa `alt` con fallback a `tour.title`.

### `quickstats` — Datos rápidos del hero

```js
quickstats: [
  { title: 'TYPE', content: 'Trekking' },
  { title: 'DURATION', content: '4D / 3N' },
  { title: 'GROUP', content: 'Max 12' },
  { title: 'DIFFICULTY', content: 'Moderate' },
  { title: 'ACCOMMODATION', content: 'Camping' },
  { title: 'LANGUAGE', content: 'EN / ES' },
]
```

- Se muestran **máximo 6** (`slice(0, 6)`) en el hero, cada uno con un icono
  fijo por posición (ver `STAT_ICONS` en `03-componentes.md`).
- `quickstats[0].content` se reutiliza como badge/categoría en el hero y en las
  tarjetas del carrusel de similares.

### `information` — Secciones de contenido

```js
information: [
  { title: 'Itinerary', content: '<h3>Day 1 ...</h3><p>...</p>' },
  { title: 'What is included', content: '<h4>Includes</h4><ul>...</ul>...' },
  { title: 'Recommendations', content: '<p>...</p>' },
  // ...
]
```

Cada objeto = una sección con `title` y `content` (HTML). El tipo de sección se
detecta por el `title` (ver `TourContentDesktop` / `Tabs`):

| Detección | Tipo | Render |
|-----------|------|--------|
| `title` = "itinerary"/"itinerario" | `itinerary` | Se extraen los "Day N / Día N" como sub-navegación. |
| `title` contiene "incluye"/"includes"/"included" | `includes` | Se divide en dos columnas (Incluye / No incluye). |
| Resto | `default` | Render genérico del HTML. |

### `ardiscounts` — Descuentos por grupo

```js
ardiscounts: [
  { persons: '2', pdiscount: 5 },
  { persons: '4', pdiscount: 10 },
  { persons: '6', pdiscount: 15 },
  { persons: '8', pdiscount: 20 },
]
```

- Solo se renderiza el bloque "Descuentos por Grupo" si `ardiscounts.length > 0`.
- Por cada entrada se calcula el precio con descuento:
  `precioBase * (1 - pdiscount/100)`.

---

## Campos y cómo se usan en la página

| Campo | Dónde se usa |
|-------|--------------|
| `title` | H1 del hero, breadcrumb, JSON-LD, título del modal de disponibilidad. |
| `sub_title` | H2 dorado bajo el hero; fallback de description SEO. |
| `highlight` | Frase en cursiva bajo el subtítulo. |
| `price` | Precio del hero (`$XX`), base para descuentos y `Offer` de JSON-LD. |
| `slug` | Determina `[slug]`, dispara la carga de la API financiera, keys de canonical/OG. |
| `category` | Debe coincidir con `[travel]` normalizado, si no → 404. |
| `wetravel` | UUID para el checkout embebido de WeTravel (CTA y calendario). |
| `description` | HTML de intro, parseado con `html-react-parser`. |
| `information` | Secciones (itinerario/incluye/otros) en Tabs (móvil) y TourContentDesktop. |
| `gallery` | Hero, OG, galería, imagen flotante con zoom. |
| `quickstats` | 6 datos rápidos con iconos en el hero. |
| `ardiscounts` | Grid de descuentos por grupo. |
| `url_brochure` | Botón "Descargar Folleto". |
| `meta_title` / `meta_description` | SEO (`TourSeo`). |
| `duration` / `discount` | Se seleccionan en la query de similares y se muestran en el carrusel. |

> **Nota:** `offer`, `isDeals`, `enableDiscount`, `linkedTripId`,
> `navbar_description` existen en el modelo pero **no** se consumen directamente
> en el render de esta página (se usan en listados, navbar o admin).
