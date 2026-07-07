# Components

## Layout Global

- `src/pages/_app.js` importa estilos globales, configura `DefaultSeo`, Google Tag Manager y `DataProvider`.
- `src/layout/Layout.js` envuelve páginas públicas con `Header`, fondo global, `Notify`, `Modal`, `Footer`, `ScrollToTop` y `WhatsAppChat`.
- Las rutas admin no usan `Layout`; `_app.js` detecta `pathname.startsWith('/admin')`.

## Navbar/Header

- `src/components/navbar/Header.js` es el header usado por `Layout`.
- Usa `useHeaderMenuData`/datos de categorías para mostrar un menú desktop y mobile.
- Usa `TourPanel` para paneles de tours por categoría.
- Cambia idioma con `router.push(router.pathname, router.asPath, { locale })`.
- Usa configuración de marca y redes desde `BRAND`.

Componentes relacionados:

- `src/components/navbar/TourPanel.js`: panel visual con lista de tours, descripción e imagen activa.
- `src/hooks/useNavbarData.js`: carga snapshot de navbar desde `src/data/navbarSnapshot.json`, usa cache en memoria/sessionStorage y refresca desde `/api/trip/navbar`.
- `src/hooks/useHeaderMenuData.js`: pendiente de revisar en detalle si se quiere documentar diferencias frente a `useNavbarData`.
- `src/components/navbar/Navbar.js`: componente grande de navbar legacy o alternativo. No aparece usado por `Layout`; pendiente de confirmar si está obsoleto.

## Home

- `src/components/home/FrontPage.js`: hero principal.
- `src/components/home/Tour1.js` y `src/components/home/tour1/*`: listado/sección de tours en home.
- `src/components/home/Section1.js`, `Section6.js`, `Section7.js`, `Section9.js`, `SectionAlliances.js`: secciones de contenido cargadas dinámicamente desde `index.js`.
- `src/components/home/SectionAllTours.js`: importado en home, pero no usado en el render actual observado.

## Categorias Y Tours

- `src/components/travel/TravelSeo.js`: SEO para página de categoría.
- `src/components/travel/TravelHero.js`: hero de categoría.
- `src/components/travel/TravelSectionTitle.js`: título reutilizable.
- `src/components/travel/TravelToursList.js`: carrusel/listado de tours por categoría con `keen-slider`.
- `src/components/travel/tour-page/TourSeo.js`: SEO para detalle de tour.
- `src/components/travel/tour-page/TourHero.js`: hero del tour.
- `src/components/travel/tour-page/TourMainContent.js`: contenido principal del tour, galería, tabs, descuentos, CTA y disponibilidad.
- `src/components/travel/tour-page/TourContentDesktop.js`: vista desktop de información del tour.
- `src/components/category/CategoryFAQs.js`: FAQs por categoría.

## Formularios Y Contacto

- `src/components/general/EmailFormulary.js`: formulario de contacto con selección de país, selección de tour, reCAPTCHA y submit a `/api/contact`.
- Carga opciones de tours desde `/api/trip?locale=...&fields=title,-_id`.
- Requiere `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` en cliente y `RECAPTCHA_SECRET_KEY` en API.

## Admin

- `src/admin/ReactAdminApp.js`: registra recursos `trips` y `users`.
- `src/admin/authProvider.js`: login, refresh, logout, permisos e identidad para React Admin.
- `src/admin/dataProvider.js` y `src/admin/combinedDataProvider.js`: enrutan operaciones por recurso.
- `src/admin/resources/trip/*`: lista, creación, edición, campos y data provider de trips.
- `src/admin/resources/user/*`: lista, creación, edición y data provider de usuarios.

## Estado Global

- `src/store/GlobalState.js` crea `DataContext` con `notify`, `cart`, `modal` y `orders`.
- Persiste `cart` en `localStorage` bajo la clave `ecommerce_next`.
- `src/store/Reducers.js` maneja acciones `NOTIFY`, `ADD_CART`, `ADD_MODAL`, `ADD_ORDERS`.

## Tailwind Y Estilos

- `tailwind.config.js` escanea `./src/**/*.{js,ts,jsx,tsx}`.
- Colores extendidos principales: `primary`, `secondary`, `dark`, `dark-alt`, `cream`, `brown`, `yellow`.
- Breakpoints personalizados: `xs: 380px` y `3xl: 120rem`.
- Animaciones extendidas: `slidein`, `fadein`, `fadeinup`, `fadeoutleft`.
- `_app.js` importa múltiples CSS: `globals.css`, `react-datepicker.css`, `custom-tailwind.css`, `cal.css`, `hero.css`, `tours.css`, `categories-section.css`, estilos de `keen-slider` y `react-quill-new`.

## Imagenes

- `next.config.js` permite imágenes locales en `/assets/**`, `/img/**`, `/home/**`, `/storage/**`.
- Permite remotas desde `https://res.cloudinary.com/**` y `http://localhost/**`.
- Admin upload de trips guarda base64 en storage local mediante `tripGalleryStorage.service`.
