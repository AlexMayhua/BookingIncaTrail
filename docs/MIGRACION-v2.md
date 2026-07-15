# Migración a nuevo repositorio / nueva versión — Análisis

> Análisis de arquitectura generado por Codex (GPT) sobre la documentación actual
> (`docs/`), con el lente de migrar el proyecto a un **nuevo repositorio** y una
> **nueva versión**. Punto de partida para la propuesta de migración (SDD).
>
> Stack actual: Next.js (Pages Router) + MongoDB/Mongoose + React Admin — agencia
> de viajes Inca Trail.

---

## 1. Resumen ejecutivo

El proyecto es **migrable, pero no conviene un "copy/paste"** a un repo nuevo. La
base funcional está clara: Next.js, MongoDB/Mongoose, ISR, React Admin, tours
multidioma, SEO, sitemaps y checkout externo.

La migración debe tratarse como una **nueva versión con modernización** de
arquitectura, modelo de datos y SEO, no solo un upgrade visual.

Los mayores riesgos: modelo `Trip` demasiado flexible, datos hardcodeados,
almacenamiento local de imágenes, SEO multidioma defectuoso y endpoints admin
parcialmente desprotegidos.

**Viabilidad: alta**, si se migra **por fases**, con compatibilidad temporal
contra el modelo actual y scripts idempotentes de datos.

---

## 2. Arquitectura actual

### Conservar

- **Separación `page → service → repository → MongoDB`.** Buena base; evita que
  las páginas dependan directamente de Mongoose.
- **ISR con `fallback: 'blocking'`.** Correcto para tours que cambian poco;
  permite publicar nuevos tours sin redeploy masivo.
- **Índices `{ slug, lang }` y `{ category, lang }`.** Mínimos necesarios para
  detalle y categoría. Deben evolucionar, no desaparecer.
- **Snapshot / read model del navbar.** El navbar no debe consultar documentos
  pesados de tours en runtime.
- **Configuración de marca vía `NEXT_PUBLIC_*`.** Mantener un `brandConfig`, pero
  más tipado y validado.
- **React Admin** como backoffice (con hardening de auth, uploads y contratos).
- **Checkout externo WeTravel + fallback WhatsApp.** Decisión pragmática de
  conversión.

### Reemplazar / deuda técnica

- **Pages Router → App Router** (Server Components, Route Handlers, Metadata API,
  `generateStaticParams` selectivo).
- **Modelo `Trip` monolítico y flexible.** Permite casi cualquier forma en
  `gallery`, `information`, `quickstats`, `ardiscounts`. Frágil para migración,
  SEO, validación y admin.
- **i18n basado en documentos separados por `lang`** → entidades neutras +
  colecciones de traducción (`Tour`, `TourTranslation`, `CategoryTranslation`…).
- **Categorías, FAQs, disponibilidad, teléfonos y ratings hardcodeados** → datos
  administrables.
- **Doble render móvil/desktop de `information`.** Duplica contenido en el DOM y
  la lógica de parseo → único árbol responsive.
- **SEO manual con `next-seo`** → Metadata API, alternates, canonical, OpenGraph,
  JSON-LD centralizado.
- **Storage local en `public/storage`** → Cloudinary, S3/R2 o similar.
- **Auth admin casera** sin documentación completa de expiración, rotación,
  cookie domain y seguridad → endurecer o mover a solución estándar.

---

## 3. Riesgos de migración

- 🔴 **Datos reales desconocidos.** Falta auditar la forma real en MongoDB.
  Riesgo alto de documentos con arrays incompletos, `lang` inconsistente,
  categorías antiguas, slugs duplicados o campos vacíos.
- 🔴 **`getTripBySlug` busca `lang` exacto** (no incluye `lang: 'all'`). Puede
  romper tours que hoy dependen de comportamientos mixtos (produce 404).
- 🔴 **SEO multidioma incorrecto.** Canonical ES apunta a EN, faltan hreflang,
  `<html lang>` incorrecto, `og:locale` hardcodeado.
- 🔴 **Structured data con `aggregateRating` falso.** Riesgo de acción manual de
  Google o pérdida de rich results. Eliminar o respaldar con reseñas reales.
- 🔴 **Endpoints admin GET sin auth** (`/api/admin/trip`, `/api/admin/trip/[id]`).
- 🟠 **Acoplamiento URL ↔ `category` ↔ `slug`.** Si la categoría normalizada no
  coincide, la página da 404. Requiere redirects y validación.
- 🟠 **Galería dependiente de posiciones.** `gallery[0]` es hero/OG y
  `gallery[last]` es imagen flotante. Preservar roles, no solo copiar arrays.
- 🟠 **Quickstats dependientes del orden.** Íconos por índice; si cambia el orden
  la UI queda semánticamente incorrecta.
- 🟠 **HTML libre en `description` e `information`.** XSS, HTML roto, parseo
  frágil de itinerarios. Necesita sanitización y pruebas con contenido real.
- 🟠 **Disponibilidad hardcodeada por slug.** Solo tres slugs tienen API externa;
  cambiar slugs localizados rompe la disponibilidad.
- 🟠 **Uploads locales** se pierden en deploy efímero (Vercel/Docker/serverless).
- 🟠 **Scripts inexistentes.** `backup-mongodb.js` y `generate-favicons.js` están
  en `package.json` pero no en el árbol.

---

## 4. Modernización recomendada

### Stack

- Next.js **App Router** + React Server Components para páginas públicas.
- **Route Handlers** en `app/api`.
- **Metadata API** para SEO.
- **TypeScript obligatorio.**
- **Zod o Valibot** para validar envs, payloads API y datos migrados.
- Mongoose con schemas estrictos (o driver MongoDB + modelos tipados).
- React Admin aislado en `/admin` como client-only.
- Tailwind 4 solo si el equipo lo acepta; si no, Tailwind 3 estable.
- Sustituir `next-seo` por Metadata API; `nextjs-cors` por CORS explícito en
  route handlers.

### Modelo de datos recomendado

Adoptar el diseño de `docs/tour-page/REDISEÑO-BD.md` como norte:

- `categories`
- `category_translations`
- `tours`
- `tour_translations`
- `tour_sections`
- `tour_section_translations`
- `media`
- `tour_images`

---

## 5. Huecos en la documentación (llenar antes de migrar)

- **Dump/análisis real de MongoDB:** conteos por colección, campos presentes,
  slugs duplicados, idiomas, categorías, documentos inválidos.
- **Contrato exacto de `Trip` real:** ejemplos reales de producción, no solo el
  schema Mongoose.
- **Reglas de agrupación EN/ES:** cómo unir tours traducidos si `linkedTripId`
  está vacío o inconsistente.
- **Política definitiva de URLs:** slugs localizados o compartidos, redirects
  legacy, canonical, x-default.
- **Mapa completo de redirects 301:** categorías eliminadas (`alternative-tours`)
  y typo (`peru-packajes`).
- **Estrategia de imágenes:** proveedor final, migración desde `public/storage`,
  naming, alt text, dimensiones, ownership.
- **Deploy objetivo:** Vercel / VPS+PM2 / Docker / serverless, CI/CD, logs,
  rollback.
- **Variables de entorno definitivas:** obligatorias, defaults, validación,
  dev/staging/prod.
- **Backup/restore real de MongoDB.**
- **Contratos de APIs externas:** WeTravel, Resend, reCAPTCHA,
  machupicchuavailability — límites, timeouts, fallbacks.
- **Política real de cancelación/reembolso** (para structured data y checkout).
- **Estrategia de reseñas reales** (si no existen, no emitir ratings).
- **Requisitos de accesibilidad y performance:** métricas objetivo, viewports,
  Lighthouse, Core Web Vitals.

---

## 6. Checklist de migración priorizado

1. **Congelar alcance de la nueva versión.** ¿Solo técnico, o también rediseño +
   nuevo modelo de datos + SEO completo? Recomendación: las tres, por fases.
2. **Auditar producción MongoDB.** Exportar muestra real; validar campos, slugs,
   categorías, idiomas, imágenes, `linkedTripId`, HTML e inconsistencias.
3. **Definir contrato de URL/i18n.** Slugs localizados, canonical, hreflang,
   redirects, `x-default`.
4. **Diseñar modelo nuevo final.** Base: `REDISEÑO-BD.md`; cerrar decisiones
   abiertas (itinerario HTML vs estructurado, media, navbar snapshot vs
   colección materializada).
5. **Crear nuevo repo con App Router + TypeScript.** Lint, formatting, env
   validation, estructura modular, CI básico.
6. **Implementar capa de datos nueva.** Modelos, índices, repositorios, servicios
   y queries optimizadas (home, categoría, detalle, navbar, sitemap).
7. **Crear script de migración idempotente.** `trips` → `tours` + traducciones +
   secciones + media + FAQs. Rerunnable y con reporte.
8. **Construir validadores de migración.** Conteos, URLs generadas, imágenes
   faltantes, slugs duplicados, tours sin traducción, categorías inválidas.
9. **Implementar páginas públicas.** Home, categoría, detalle, contacto,
   términos, complaints. Priorizar detalle y categoría (SEO/conversión).
10. **Implementar SEO correctamente.** Metadata API, canonical por locale,
    hreflang, sitemap con alternates, JSON-LD limpio, sin ratings falsos.
11. **Resolver storage de imágenes.** Migrar `public/storage` a Cloudinary/S3/R2.
12. **Rehacer navbar como read model** (snapshot o colección materializada por
    locale con proyección mínima).
13. **Migrar admin.** React Admin con recursos adaptados; validar auth, permisos,
    uploads, edición multidioma.
14. **Endurecer APIs.** Auth en todos los endpoints admin, validación de
    payloads, rate limits, CORS explícito, logs de errores.
15. **Implementar contacto.** Resend + reCAPTCHA + validación server-side.
16. **Pruebas críticas.** Servicios, migración, URL resolver, SEO metadata, auth
    admin, render de páginas principales.
17. **Auditoría visual/mobile.** iPhone SE, iPhone 14 Pro, Pixel 7, iPad Mini.
18. **Staging con datos reales.** Migración contra copia de producción; comparar
    páginas antiguas vs nuevas, sitemaps, rich results.
19. **Plan de redirects y cutover.** 301, TTL DNS/CDN, rollback, backup DB,
    freeze editorial temporal.
20. **Lanzamiento y monitoreo.** Logs, Search Console, indexación, 404,
    conversión de CTAs, formularios, admin.
