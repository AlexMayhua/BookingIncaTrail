# Rediseño de Datos Estructurados (Schema.org / JSON-LD) — Brief

> **Propósito.** Documentar, campo por campo, qué datos estructurados emitimos
> hoy, qué reclama Google Search Console, qué falta y qué añadir para tener
> **control total y cobertura completa** — en el detalle de tour y en el resto de
> plantillas. No modifica código: es el plano de la mejora.
>
> Relacionado: [REDISEÑO.md](./REDISEÑO.md) (UI/SEO general) ·
> [REDISEÑO-BD.md](./REDISEÑO-BD.md) (modelo de datos que alimenta estos campos).
>
> Fuente del análisis: informe de GSC "Mejorar el aspecto de los elementos"
> (Merchant listings + Product snippets) y revisión de `TourSeo.js` / `TravelSeo.js`.

- **Fecha:** 2026-07-07
- **Severidad:** *warnings* (no errores). Los rich results **no se rompen**, pero
  se pierde elegibilidad para Merchant listings y Product snippets (estrellas).

---

## 1. Qué emitimos hoy

| Plantilla | Archivo | JSON-LD |
|-----------|---------|---------|
| Detalle de tour | `TourSeo.js` | `Organization`, `TouristAttraction`, `Product`(+`Offer`+`aggregateRating`), `BreadcrumbList`. |
| Categoría | `TravelSeo.js` | `BreadcrumbList`, `ItemList`→`Product`(+`Offer` **solo price**), `TouristDestination`. |
| FAQs | `CategoryFAQs.js` | `FAQPage` (hoy desde datos hardcodeados). |
| Home | `index.js`, `home/tour1/Tour1Section.js` | (auditar). |

**Origen de los conteos de GSC:** los números altos (75, 57) provienen sobre
todo del **`ItemList` de categoría**, cuyos `Product` solo llevan `price` +
`priceCurrency`. Los ~28 provienen del `Product` del detalle.

---

## 2. 🔴 Riesgo prioritario: `aggregateRating`/`review` inventados

`TourSeo.js` emite hoy:

```js
aggregateRating: { ratingValue: '4.9', reviewCount: '150', ... } // FIJO, sin review
```

- **Política de Google:** las valoraciones deben ser **reales, específicas del
  producto y visibles en la página**. Inventarlas es motivo de **acción manual
  por spam de datos estructurados**.
- El "Falta `review`" del informe pide **objetos `Review` reales**, no solo el
  agregado.

**Acción:** emitir `aggregateRating`+`review` **solo con datos reales** (ver §5).
Si aún no hay reseñas, **retirar el bloque** hasta tenerlas. Nunca "rellenar"
este warning con datos falsos.

---

## 3. Decisión de tipo: `Product` vs `TouristTrip`

Los campos que Google reclama (`shippingDetails`, `hasMerchantReturnPolicy`,
`GTIN`) son de **bienes físicos enviables**. Un tour es un **servicio**.

- **Recomendado:** mantener `Product`+`Offer` (da precio en resultados) y
  rellenar los campos aplicables de forma **honesta** (sin envío; política de
  cancelación real; identificador propio). Opcionalmente **añadir `TouristTrip`**
  (semánticamente correcto, con `itinerary` desde las secciones).

---

## 4. Tabla campo por campo

| Campo (GSC) | Estado actual | ¿Aplica? | Valor / **fuente de dato** |
|---|---|---|---|
| `description` (Product) | usa `meta_description` (a veces vacío) | Sí | Fallback no vacío: `meta_description \|\| sub_title \|\| title`. Fuente: `tour_translations`. |
| `availability` (offers) | `InStock` fijo | Sí | Real: `InStock`/`SoldOut`/`PreOrder` según API/fechas. Fuente: `tours.availability` + API. |
| identificador / `brand` | `brand` sí; sin id | Parcial | `sku` (=slug) + `mpn` (código interno) + `brand` con `@id`. Fuente: `tours.sku/mpn`, `brandConfig`. |
| `validFrom` (offers) | falta | Sí | Fecha de inicio de vigencia del precio. Fuente: `tours.availability.validFrom` o `updatedAt`. |
| `priceValidUntil` (offers) | ✓ | Sí | OK (hoy+1 año). |
| `hasMerchantReturnPolicy` (offers) | falta | Reinterpretar | `MerchantReturnPolicy` = política de **cancelación** (ver §6). Fuente: `tours.cancellationPolicy`. |
| `shippingDetails` (offers) | falta | No (servicio) | `OfferShippingDetails` con `shippingRate` 0. Valor fijo (sin envío). |
| `aggregateRating` (Product) | **falso** | Sí | Solo real (§2, §5). Fuente: colección `reviews`. |
| `review` (Product) | falta | Sí | Objetos `Review` reales. Fuente: colección `reviews`. |

**Otros arreglos detectados en el código (no salen en GSC):**

- `Organization.url` apunta a la URL del tour → debe ser la **raíz** del sitio.
- `Organization` se repite en cada página → centralizar **una vez** (global) con
  `@id`, y referenciarla como `brand`/`seller` desde el `Product`.
- Falta `WebSite` + `SearchAction` global (sitelinks searchbox).
- Falta `inLanguage` por locale y `@id` para enlazar entidades.
- Canonical/hreflang por idioma siguen mal (ver [REDISEÑO.md §3](./REDISEÑO.md)):
  afecta a cómo Google consolida estos rich results entre EN/ES.
- `TravelSeo.js`: cada `Product` del `ItemList` debe llevar al menos
  `description`, `brand` y `offers.availability` (principal fuente de los conteos).

---

## 5. ¿De dónde salen las reseñas reales?

Google exige que las reseñas: (a) sean del **ítem concreto**, (b) estén
**visibles en la página**, y (c) **no** sean solo un agregado importado de un
tercero sin mostrarlas. Opciones, de más a menos recomendable para un operador de
tours:

1. **Reseñas propias (first-party)** — un formulario post-tour en tu sitio guarda
   la reseña en la colección `reviews`. Ventaja: control total, las muestras y
   marcas con `Review`/`aggregateRating` legítimamente. Es la base recomendada.
2. **TripAdvisor** — la plataforma de referencia en turismo. Puedes:
   - Mostrar sus reseñas con su **widget oficial**, o
   - Importar (con permiso/API) a tu colección `reviews` y mostrarlas en la página.
3. **Proveedores de reseñas "partner" de Google** (Trustpilot, Yotpo, REVIEWS.io,
   Feefo) — recopilan reseñas verificadas y ofrecen widgets/API; algunos son
   *licensed review partners* de Google, lo que facilita que las estrellas
   aparezcan. Requiere plan de pago.
4. **Google Business Profile / plataformas de venta (Viator/GetYourGuide)** —
   útiles como reputación, **pero** no debes marcar como `aggregateRating` propio
   un agregado que **no** muestras en tu página. Solo si las **muestras** y tienes
   derecho a reproducirlas.

**Regla de oro:** el número que pongas en `aggregateRating` debe **coincidir** con
las reseñas realmente visibles en esa página. Modelo de datos propuesto:
colección `reviews` (+ `review_translations`) — ver
[REDISEÑO-BD.md](./REDISEÑO-BD.md).

---

## 6. `returnPolicyCategory` y tu página de Términos

**No** puedes poner `https://bookingincatrail.com/terms-conditions` como valor de
`returnPolicyCategory`: es un campo de **enumeración** y solo acepta valores de
schema.org:

| Enum válido | Cuándo usarlo |
|-------------|---------------|
| `https://schema.org/MerchantReturnFiniteReturnWindow` | Cancelación/reembolso permitido hasta **N días** antes. Requiere `merchantReturnDays`. |
| `https://schema.org/MerchantReturnUnlimitedWindow` | Reembolso sin límite de tiempo (raro en tours). |
| `https://schema.org/MerchantReturnNotPermitted` | Tour **no reembolsable**. |

**Cómo mapear tu política de cancelación (que vive en Términos):**

```jsonc
"hasMerchantReturnPolicy": {
  "@type": "MerchantReturnPolicy",
  "applicableCountry": "PE",
  "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
  "merchantReturnDays": 30,               // según tu política real
  "returnMethod": "https://schema.org/ReturnByMail",
  "returnFees": "https://schema.org/FreeReturn",
  "url": "https://bookingincatrail.com/terms-conditions"  // ← aquí sí enlazas Términos
}
```

- El **valor** de la política es el enum; la **URL de Términos** va en el campo
  `url` del objeto `MerchantReturnPolicy` (schema.org lo permite como propiedad de
  cualquier `Thing`; Google puede ignorarla, pero documenta la fuente).
- Fuente de dato: `tours.cancellationPolicy` (`{ category, days, url }`) en el
  modelo nuevo, para no hardcodear.

> Nota: en turismo, "return policy" se interpreta como **política de
> cancelación**. Es honesto usar el enum que refleje tus condiciones reales.

---

## 7. Snippet `Product`/`Offer` completo propuesto

```jsonc
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": tour.title,
  "description": tour.meta_description || tour.sub_title || tour.title, // nunca vacío
  "image": tour.gallery?.map(i => i.url),
  "sku": tour.slug,
  "mpn": tour.code || tour.slug,
  "brand": { "@type": "Brand", "name": BRAND.name, "@id": absoluteUrl('/#organization') },
  "offers": {
    "@type": "Offer",
    "price": originalPrice.toFixed(2),
    "priceCurrency": "USD",
    "availability": realAvailability,      // desde API/fechas, no fijo
    "itemCondition": "https://schema.org/NewCondition",
    "url": canonicalPorLocale,             // con prefijo de idioma
    "validFrom": today,
    "priceValidUntil": todayPlus1Year,
    "seller": { "@id": absoluteUrl('/#organization') },
    "hasMerchantReturnPolicy": { /* ver §6 */ },
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "shippingRate": { "@type": "MonetaryAmount", "value": 0, "currency": "USD" },
      "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "PE" }
    }
  }
  // aggregateRating / review: SOLO si son reales (ver §2 y §5)
}
```

Global (una sola vez, p. ej. en `_app`):

```jsonc
[
  { "@context":"https://schema.org", "@type":"Organization",
    "@id": absoluteUrl('/#organization'), "name": BRAND.name,
    "url": absoluteUrl('/'), "logo": getLogoUrlAbsolute(), "sameAs": [ /* redes */ ] },
  { "@context":"https://schema.org", "@type":"WebSite",
    "@id": absoluteUrl('/#website'), "url": absoluteUrl('/'),
    "inLanguage": ["es","en"],
    "potentialAction": { "@type":"SearchAction",
      "target": absoluteUrl('/search?q={query}'), "query-input":"required name=query" } }
]
```

---

## 8. Checklist priorizado

- [ ] 🔴 Quitar o hacer **reales** `aggregateRating`/`review` (riesgo de penalización).
- [ ] 🟠 `Product.description` con fallback no vacío.
- [ ] 🟠 `offers.availability` real (desde API/fechas).
- [ ] 🟠 Identificador: `sku` + `mpn` + `brand` con `@id`.
- [ ] 🟠 `offers.validFrom` (+ `priceValidUntil` ya existe).
- [ ] 🟠 `hasMerchantReturnPolicy` (enum + `merchantReturnDays` + `url` a Términos).
- [ ] 🟠 `shippingDetails` con `shippingRate` 0.
- [ ] 🟡 Corregir `Organization.url`; centralizar `Organization`/`WebSite` global con `@id`.
- [ ] 🟡 `TravelSeo` `ItemList`: añadir `description`, `brand`, `offers.availability`.
- [ ] 🟡 Canonical/hreflang por locale (ver REDISEÑO.md).
- [ ] 🟡 Opcional: `TouristTrip` con `itinerary` desde `tour_sections`.
- [ ] 🟡 Validar todo en Rich Results Test tras implementar.

---

## 9. Fuentes de dato requeridas (cross-ref [REDISEÑO-BD.md](./REDISEÑO-BD.md))

| Campo schema | Colección/campo nuevo |
|--------------|-----------------------|
| `sku` / `mpn` | `tours.sku`, `tours.code` |
| `itemCondition` | fijo (`NewCondition`) |
| `hasMerchantReturnPolicy` | `tours.cancellationPolicy { category, days, url }` |
| `offers.availability` / `validFrom` | `tours.availability` (ya diseñado) + API |
| `aggregateRating` / `review` | **`reviews` + `review_translations`** (nuevas) |
| `brand` / `seller` / Organization | `brandConfig` con `@id` estable |
| `TouristTrip.itinerary` | `tour_sections` (tipadas) |
