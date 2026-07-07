# Estado e Interactividad (cliente)

Todo el estado de React vive en el componente de página `TourPage` y se pasa
por props a `TourMainContent`. Aquí se documenta cada pieza dinámica.

## Estado de React

```js
// Disponibilidad / datos financieros
const [dataget, setFinancials] = useState({ data: [] });
const [tourDays, setTourDays]  = useState('');

// Galería
const [tab, setTab]         = useState(0);      // índice de imagen activa
const [isZoomed, setIsZoomed] = useState(false); // zoom de la imagen flotante

// Modal de reserva
const [isOpen, setIsOpen] = useState(false);
const modalRef = useRef(null);
```

| Estado | Propósito |
|--------|-----------|
| `dataget` | Datos de disponibilidad por fecha (API externa). `{ data, updatedAt }`. |
| `tourDays` | Nº de días del tour (para calcular fecha fin en el checkout WeTravel). |
| `tab` | Miniatura/imagen seleccionada en la galería. |
| `isZoomed` | Overlay de zoom de la imagen de descripción. |
| `isOpen` | Visibilidad del modal de disponibilidad. |
| `modalRef` | Referencia al cuadro del modal (para cerrar al hacer click fuera). |

## API de disponibilidad financiera

`fetchFinancial()` carga disponibilidad **solo para 3 slugs concretos** (los que
tienen integración con `machupicchuavailability.com`):

```js
switch (tour.slug) {
  case 'classic-inca-trail':
    url = 'https://machupicchuavailability.com/api?idRuta=1&idLugar=2'; days = 3; break;
  case 'short-inca-trail':
    url = 'https://machupicchuavailability.com/api?idRuta=5&idLugar=2'; days = 1; break;
  case 'salkantay-trek-to-machu-picchu':
    url = 'https://machupicchuavailability.com/api?idRuta=3&idLugar=2'; days = 3; break;
  default:
    return;  // el resto de tours no tiene disponibilidad en tiempo real
}
```

Características:

- Se ejecuta en un `useEffect` que depende de `tour?.slug`; al cambiar de tour
  primero **resetea** `dataget` a `{ data: [] }` y luego vuelve a pedir.
- Usa `AbortController` con **timeout de 5 s** para no bloquear la UI si la API
  externa no responde.
- Solo aplica los datos si `response.ok` **y** `data.success`.
- Fallos silenciosos: `console.warn` (excepto abortos), la página sigue
  funcionando sin disponibilidad.

```js
useEffect(() => {
  setFinancials({ data: [] });
  fetchFinancial();
}, [tour?.slug]);
```

## Lógica del CTA / modal (`handleOpen`)

```js
const handleOpen = () => {
  if (!dataget?.data || dataget.data.length === 0) {
    // Sin disponibilidad en tiempo real → checkout directo o WhatsApp
    const url = tour?.wetravel
      ? `https://www.wetravel.com/checkout_embed?uuid=${tour.wetravel}`
      : `https://api.whatsapp.com/send/?phone=51970811976&text=${encodeURIComponent(tour?.title || '')}`;
    window.open(url, '_blank', 'noopener,noreferrer')?.focus();
    return;
  }
  setIsOpen(true);  // Con disponibilidad → abre el calendario
};
```

Árbol de decisión del botón flotante:

```
click en CTA
│
├── ¿hay dataget.data (disponibilidad)?
│   ├── NO  → ¿tiene wetravel?
│   │         ├── SÍ → abre checkout WeTravel en pestaña nueva
│   │         └── NO → abre WhatsApp con el título del tour
│   └── SÍ  → abre modal con <Calendar> (selección de fecha)
```

- El **texto** del botón también depende del estado:
  `dataget.data.length > 0 ? t.availability : t.booking`.

## Cierre del modal

```js
const handleClose = () => setIsOpen(false);
const handleBackdropClick = (e) => {
  if (modalRef.current && !modalRef.current.contains(e.target)) handleClose();
};
```

Además, un `useEffect` fuerza `isOpen = false` al cambiar de `tour.slug` (evita
que el modal quede abierto al navegar entre tours).

## Galería y zoom

- `setTab(index)` cambia la imagen grande activa al pulsar una miniatura.
- `setIsZoomed(true)` abre el overlay de zoom (imagen `gallery[length-1]`);
  se cierra con el botón `×` o click en el fondo.

## Guard de carga

Si `tour` no está definido (transición de `fallback: 'blocking'`), se muestra un
spinner con texto i18n:

```js
if (!tour) {
  return (/* spinner + "Loading tour content..." / "Cargando contenido del tour..." */);
}
```

## Resumen: estático vs dinámico

| Dato | Origen | Momento |
|------|--------|---------|
| `tour`, `category`, `similarTours` | `getStaticProps` (MongoDB) | Build / ISR (servidor). |
| `dataget` (disponibilidad) | `machupicchuavailability.com` | Cliente, al montar / cambiar slug. |
| Interacciones (tab, zoom, modal) | Estado React local | Cliente. |
