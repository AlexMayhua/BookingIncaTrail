# Flujo de Datos — ISR y capa de servicios

Cómo la página obtiene sus datos desde MongoDB hasta los props de React.

## Arquitectura por capas

```
[travel]/[slug].js  (getStaticProps)
        │
        ▼
trip.service.js         ← lógica de negocio / normalización
        │
        ▼
trip.repository.js      ← queries Mongoose (.lean())
        │
        ▼
lib/mongodb.js (connectDB) → MongoDB Atlas (colección "trips")
```

Esta separación **page → service → repository → DB** mantiene la página libre de
detalles de base de datos.

## `getStaticPaths`

```js
export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' };
}
```

- **No pre-genera** ninguna ruta en build (`paths: []`).
- `fallback: 'blocking'`: la primera visita a una URL nueva se renderiza en el
  servidor (SSR "on-demand"), se cachea y las siguientes se sirven estáticas.
- Ventaja: se pueden añadir tours nuevos sin re-desplegar el sitio.

## `getStaticProps`

```js
export async function getStaticProps({ params, locale }) {
  const { slug } = params;
  const travel = normalizeCategorySlug(params.travel);  // normaliza categoría
  const lang = locale || 'es';

  const tour = await getTripBySlug(slug, lang);          // 1. tour exacto
  if (!tour || normalizeCategorySlug(tour.category) !== travel) {
    return { notFound: true };                           // 2. guard de coherencia
  }

  const categoryTours = await getToursByCategory(travel, lang);  // 3. similares
  const similarTours = categoryTours.filter((t) => t.slug !== slug);

  return {
    props: {
      tour: JSON.parse(JSON.stringify(tour)),            // 4. serialización
      category: travel,
      similarTours: JSON.parse(JSON.stringify(similarTours)),
    },
    revalidate: 3600,                                    // 5. ISR: revalida cada 1h
  };
}
```

Paso a paso:

1. **`getTripBySlug(slug, lang)`** — busca el tour por `slug` + `lang`.
2. **Guard de coherencia** — si no existe, o su `category` normalizada no
   coincide con el `[travel]` de la URL → **404**. Evita URLs duplicadas.
3. **`getToursByCategory(travel, lang)`** — tours de la misma categoría para el
   carrusel "More … Tours".
4. **Serialización** — `JSON.parse(JSON.stringify(...))` elimina tipos no
   serializables de Mongo (ObjectId, Date) que Next.js no permite en props.
5. **`revalidate: 3600`** — regeneración incremental (ISR): la página se
   reconstruye en segundo plano como máximo una vez por hora.

## Servicios consumidos (`trip.service.js`)

### `getTripBySlug(slug, lang)`

```js
export async function getTripBySlug(slug, lang) {
  const trip = await tripRepository.findTripBySlug(slug, lang);
  if (!trip) return null;
  return trip;
}
```
→ `Trip.findOne({ slug, lang }).lean()` (usa índice `{ slug, lang }`).

> Ojo: busca por `lang` exacto (no incluye `lang: 'all'`), a diferencia de otros
> servicios. El tour debe existir en el idioma solicitado.

### `getToursByCategory(category, lang)`

```js
export async function getToursByCategory(category, locale) {
  const normalizedCategory = normalizeCategorySlug(category);
  if (!normalizedCategory) return [];
  return tripRepository.findTripsByCategory(normalizedCategory, locale);
}
```
→ `findTripsByCategory` filtra `{ category }` + `$or: [{lang}, {lang:'all'}]` y
**selecciona solo los campos necesarios** para las tarjetas del carrusel:

```js
.select('title slug category meta_description gallery price duration discount quickstats updatedAt')
```

Esto reduce el payload: el carrusel no necesita `information`, `description`,
etc.

## Repositorio (`trip.repository.js`)

Todas las funciones llaman a `connectDB()` primero y usan `.lean()` para
devolver POJOs (más ligeros y serializables). Funciones relevantes para esta
página:

| Función | Query |
|---------|-------|
| `findTripBySlug(slug, lang)` | `Trip.findOne({ slug, lang }).lean()` |
| `findTripsByCategory(category, lang)` | `Trip.find({ category, $or:[{lang},{lang:'all'}] }).select(...).lean()` |

## Resumen del contrato de props

```js
TourPage({ tour, category, similarTours })
```

| Prop | Tipo | Origen |
|------|------|--------|
| `tour` | Objeto `Trip` completo (POJO) | `getTripBySlug` |
| `category` | string (slug normalizado) | `normalizeCategorySlug(params.travel)` |
| `similarTours` | `Trip[]` (campos reducidos, sin el actual) | `getToursByCategory` filtrado |

Estos props son estáticos (generados en build/ISR). Los datos **dinámicos**
(disponibilidad en tiempo real) se cargan en cliente — ver
[04-estado-interactividad.md](./04-estado-interactividad.md).
