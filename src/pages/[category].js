import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { API_URL } from '../lib/constants';
import { getData } from '../utils/fetchData';
import TourSlider from '../components/Slider';
import Breadcrumbs from '../components/Breadcrumbs';
import { NextSeo } from 'next-seo';
import { getCategoryImage, preloadImages, getCategoryImagesForPreload } from '../utils/imageUtils';
import { getCategoryTitle, getCategoryDescription, getCategoryImagePath } from '../utils/categoryHelpers';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import TitleLabel from '../components/general/TitleLabel';
import { BRAND, absoluteUrl } from '../lib/brandConfig';
import en from '../lang/en/home';
import es from '../lang/es/home';

// Lazy load componentes below-the-fold para mejorar performance
const Section6 = dynamic(() => import('../components/home/Section6'), {
  loading: () => <div className="min-h-[400px]" />,
  ssr: true
});
const Section9 = dynamic(() => import('../components/home/Section9'), {
  loading: () => <div className="min-h-[300px]" />,
  ssr: true
});
const Section1 = dynamic(() => import('../components/home/Section1'), {
  loading: () => <div className="min-h-[400px]" />,
  ssr: true
});
const CategoryFAQs = dynamic(() => import('../components/category/CategoryFAQs'), {
  loading: () => <div className="min-h-[300px]" />,
  ssr: true
});

const CategoryPage = ({ initialTrips, category, categoryData, error }) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'en' ? en : es;
  const [trips, setTrips] = useState(initialTrips || []);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('title');
  const [filterBy, setFilterBy] = useState('all');

  // Redirigir a 404 si hay error
  useEffect(() => {
    if (error) {
      router.push('/404');
    }
  }, [error, router]);

  // Función para ordenar tours
  const sortTrips = (trips, sortType) => {
    if (!trips || !Array.isArray(trips)) {
      return [];
    }
    const sortedTrips = [...trips];
    switch (sortType) {
      case 'price-low':
        return sortedTrips.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price-high':
        return sortedTrips.sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'duration':
        return sortedTrips.sort((a, b) => (a.duration || 0) - (b.duration || 0));
      case 'title':
      default:
        return sortedTrips.sort((a, b) => a.title.localeCompare(b.title));
    }
  };

  // Función para filtrar tours
  const filterTrips = (trips, filterType) => {
    if (!trips || !Array.isArray(trips)) {
      return [];
    }
    switch (filterType) {
      case 'short':
        return trips.filter(trip => (trip.duration || 0) <= 3);
      case 'medium':
        return trips.filter(trip => (trip.duration || 0) > 3 && (trip.duration || 0) <= 7);
      case 'long':
        return trips.filter(trip => (trip.duration || 0) > 7);
      case 'all':
      default:
        return trips;
    }
  };

  // Aplicar filtros y ordenamiento
  const processedTrips = sortTrips(filterTrips(trips, filterBy), sortBy);

  // Configuración de la categoría
  const categoryTitle = categoryData?.title || getCategoryTitle(category);
  const categoryDescription = categoryData?.description || getCategoryDescription(category);
  const categoryImage = getCategoryImage(category, 'hero');
  const categoryImagePath = getCategoryImagePath(category);

  // Preload de imágenes críticas
  useEffect(() => {
    const imagesToPreload = getCategoryImagesForPreload(category);
    preloadImages(imagesToPreload);
  }, [category]);

  if (error) {
    return null; // El useEffect redirigirá a 404
  }

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": locale === 'en' ? 'Home' : 'Inicio',
                    "item": absoluteUrl('/')
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": categoryTitle,
                    "item": absoluteUrl(`/${category}`)
                  }
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": `${categoryTitle} Tours`,
                "description": categoryDescription,
                "numberOfItems": trips.length,
                "itemListElement": trips.slice(0, 10).map((trip, index) => ({
                  "@type": "ListItem",
                  "position": index + 1,
                  "item": {
                    "@type": "Product",
                    "name": trip.title,
                    "url": absoluteUrl(`/${category}/${trip.slug}`),
                    "image": trip.gallery?.[0]?.url || '',
                    "offers": {
                      "@type": "Offer",
                      "price": trip.price?.toFixed(2) || "0.00",
                      "priceCurrency": "USD"
                    }
                  }
                }))
              },
              {
                "@context": "https://schema.org",
                "@type": "TouristDestination",
                "name": categoryTitle,
                "description": categoryDescription,
                "url": absoluteUrl(`/${category}`),
                "image": categoryImage
              }
            ])
          }}
        />
      </Head>
      <NextSeo
        title={`${categoryTitle} - Tours y Aventuras | BookingIncatrail`}
        description={categoryDescription}
        openGraph={{
          title: `${categoryTitle} - Tours y Aventuras | BookingIncatrail`,
          description: categoryDescription,
          images: [
            {
              url: categoryImage,
              width: 1200,
              height: 630,
              alt: categoryTitle,
            },
          ],
        }}
      />
      {/* Hero Section - Diseño Mejorado */}
      <section className="category-hero-section">
        {/* Imagen de fondo */}
        <div
          className="category-hero-bg"
          style={{
            backgroundImage: `url(${categoryImagePath})`,
          }}
        ></div>

        {/* Overlay gradiente moderno */}
        <div className="category-hero-overlay"></div>

        {/* Contenido del Hero */}
        <div className="category-hero-content">
          <div className="category-hero-inner">
            {/* Breadcrumbs integrado en hero */}
            <nav className="category-hero-breadcrumbs">
              <Link href="/" className="breadcrumb-link">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                {locale === 'en' ? 'Home' : 'Inicio'}
              </Link>
              <svg className="w-4 h-4 breadcrumb-separator" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="breadcrumb-current">{categoryTitle}</span>
            </nav>

            {/* Badge de categoría */}
            <div className="category-badge">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {locale === 'en' ? 'Category' : 'Categoría'}
            </div>

            {/* Título principal */}
            <h1 className="category-hero-title">
              {categoryTitle}
            </h1>

            {/* Descripción */}
            <p className="category-hero-description">
              {categoryDescription}
            </p>

            {/* Stats compactos */}
            <div className="category-hero-stats">
              <div className="category-stat">
                <span className="category-stat-number">{trips.length}</span>
                <span className="category-stat-label">{trips.length === 1 ? 'Tour' : 'Tours'}</span>
              </div>
              <div className="category-stat-divider"></div>
              <div className="category-stat">
                <LazyLoadImage src="/assets/icon/type-tour.png" alt="Type" className="w-5 h-5" />
                <span className="category-stat-label">{locale === 'en' ? 'Adventure' : 'Aventura'}</span>
              </div>
              <div className="category-stat-divider"></div>
              <div className="category-stat">
                <LazyLoadImage src="/assets/icon/languages.png" alt="Languages" className="w-5 h-5" />
                <span className="category-stat-label">ES / EN</span>
              </div>
            </div>

            {/* Botón CTA */}
            <div className="category-hero-cta">
              <a href="#tours" className="category-cta-btn">
                {locale === 'en' ? 'Explore Tours' : 'Explorar Tours'}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Quick Stats flotante al final */}
        <div className="category-quick-stats-container">
          <div className="category-quick-stats">
            <div className="quick-stat-item">
              <LazyLoadImage src="/assets/icon/group-zise.png" alt="Grupo" className="w-8 h-8" />
              <div className="quick-stat-text">
                <span className="quick-stat-label">{locale === 'en' ? 'Group Size' : 'Tamaño Grupo'}</span>
                <span className="quick-stat-value">{locale === 'en' ? 'Small & Private' : 'Pequeños y Privados'}</span>
              </div>
            </div>
            <div className="quick-stat-item">
              <LazyLoadImage src="/assets/icon/dificult.png" alt="Dificultad" className="w-8 h-8" />
              <div className="quick-stat-text">
                <span className="quick-stat-label">{locale === 'en' ? 'Difficulty' : 'Dificultad'}</span>
                <span className="quick-stat-value">{locale === 'en' ? 'All Levels' : 'Todos los Niveles'}</span>
              </div>
            </div>
            <div className="quick-stat-item">
              <LazyLoadImage src="/assets/icon/type-tour.png" alt="Tours" className="w-8 h-8" />
              <div className="quick-stat-text">
                <span className="quick-stat-label">{locale === 'en' ? 'Available' : 'Disponibles'}</span>
                <span className="quick-stat-value">{trips.length} {trips.length === 1 ? 'Tour' : 'Tours'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Contenido principal */}
      <div className="2xl:container mx-auto">
        <div className="lg:mx-24 mx-3">

          {/* Título de sección - Mismo estilo que Home */}
          <div className="text-center mb-8 md:mb-12 mt-10">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-primary inline-block mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              {locale === 'en' ? `Explore our ${categoryTitle} Tours` : `Explora nuestros tours de ${categoryTitle}`}
            </h2>
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="w-16 h-1 bg-secondary rounded-full"></div>
              <div className="w-8 h-1 bg-secondary/60 rounded-full"></div>
              <div className="w-4 h-1 bg-secondary/30 rounded-full"></div>
            </div>
          </div>

          {/* Filtros y Ordenamiento mejorado */}
          <section id="tours" className="py-6">
            <div className="filters-container">
              <div className="filters-inner">
                {/* Filtros principales */}
                <div className="filter-controls">
                  <div className="filter-group">
                    <label className="filter-label">
                      <svg className="filter-icon" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
                      </svg>
                      {locale === 'en' ? 'Sort' : 'Ordenar'}
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="filter-select"
                    >
                      <option value="title">{locale === 'en' ? 'Name' : 'Nombre'}</option>
                      <option value="price-low">{locale === 'en' ? 'Price ↑' : 'Precio ↑'}</option>
                      <option value="price-high">{locale === 'en' ? 'Price ↓' : 'Precio ↓'}</option>
                      <option value="duration">{locale === 'en' ? 'Duration' : 'Duración'}</option>
                    </select>
                  </div>

                  <div className="filter-group">
                    <label className="filter-label">
                      <svg className="filter-icon" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                      </svg>
                      {locale === 'en' ? 'Duration' : 'Duración'}
                    </label>
                    <select
                      value={filterBy}
                      onChange={(e) => setFilterBy(e.target.value)}
                      className="filter-select"
                    >
                      <option value="all">{locale === 'en' ? 'All' : 'Todos'}</option>
                      <option value="short">{locale === 'en' ? '1-3 days' : '1-3 días'}</option>
                      <option value="medium">{locale === 'en' ? '4-7 days' : '4-7 días'}</option>
                      <option value="long">{locale === 'en' ? '8+ days' : '8+ días'}</option>
                    </select>
                  </div>
                </div>

                {/* Contador de resultados */}
                <div className="filter-results">
                  <div className="results-badge">
                    <svg className="results-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                    <div className="results-text">
                      <span className="results-number">{processedTrips.length}</span>
                      <span className="results-label">{locale === 'en' ? `of ${trips.length}` : `de ${trips.length}`}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tours Slider - Mismo estilo que Home */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-secondary"></div>
              </div>
            ) : processedTrips.length > 0 ? (
              <TourSlider tours={processedTrips} t={t} />
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-xl">
                <div className="text-gray-500 text-xl mb-6">
                  {locale === 'en'
                    ? 'No tours found matching the selected filters.'
                    : 'No se encontraron tours que coincidan con los filtros seleccionados.'}
                </div>
                <button
                  onClick={() => {
                    setFilterBy('all');
                    setSortBy('title');
                  }}
                  className="bg-secondary text-primary px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors duration-300 shadow-lg"
                >
                  {locale === 'en' ? 'Clear filters' : 'Limpiar filtros'}
                </button>
              </div>
            )}
          </section>

          {/* Componentes reutilizados de Home para consistencia visual */}
          {trips.length > 0 && (
            <>
              {/* Sección de Estadísticas/Achievements - Mismo estilo que Home */}
              <Section9 />

              {/* Sección "Por qué elegirnos" - Mismo estilo que Home */}
              <Section1 />

              {/* Sección de Testimonios - Mismo estilo que Home */}
              <Section6 />
            </>
          )}

          {/* Sección de FAQs */}
          <CategoryFAQs category={category} />

        </div>
      </div>
    </>
  );
};

// Categorías válidas del sitio - Actualizado Enero 2026
const VALID_CATEGORIES = [
  'ausangate',
  'choquequirao',        // ✅ AGREGADO: Trek a ciudad hermana de Machu Picchu
  'day-tours',
  'family-tours',        // ✅ AGREGADO: Tours diseñados para familias con niños
  'inca-jungle',
  'inca-trail',
  'luxury-glamping',     // ✅ AGREGADO: Glamping de lujo en Valle Sagrado
  'machupicchu',
  'peru-packages',
  'rainbow-mountain',
  'sacred-lakes',        // ✅ AGREGADO: Lagunas sagradas de Cusco
  'salkantay',
  'sustainable-tours'    // ✅ AGREGADO: Turismo sostenible y responsable
  // REMOVIDO: 'cusco' (sin tours, reemplazado por 'day-tours')
  // REMOVIDO: 'alternative-tours' (deprecated, tours migrados a categorías específicas)
];

export async function getStaticPaths() {
  // Pre-generar páginas para todas las categorías en ambos idiomas
  const paths = [];

  VALID_CATEGORIES.forEach(category => {
    paths.push({ params: { category }, locale: 'es' });
    paths.push({ params: { category }, locale: 'en' });
  });

  return {
    paths,
    fallback: 'blocking' // Genera páginas bajo demanda para nuevas categorías
  };
}

export async function getStaticProps({ params, locale }) {
  const { category } = params;
  const lang = locale || 'es';

  // Validar categoría
  if (!VALID_CATEGORIES.includes(category)) {
    return { notFound: true };
  }

  try {
    // Solo traer campos necesarios para las tarjetas (sin description completa para reducir peso)
    const fields = 'title,slug,category,price,duration,difficulty,group_size,gallery,quickstats,discount';
    const tripsRes = await getData(`trip?category=${category}&locale=${lang}&fields=${fields}`);

    if (!tripsRes || tripsRes.err) {
      return {
        props: {
          error: true,
          category,
          initialTrips: [],
          categoryData: null
        },
        revalidate: 3600 // Reintentar cada hora
      };
    }

    return {
      props: {
        initialTrips: tripsRes || [],
        category,
        categoryData: {
          title: getCategoryTitle(category),
          description: getCategoryDescription(category),
          image: getCategoryImagePath(category)
        },
        error: false
      },
      revalidate: 3600 // Regenerar cada hora (ISR)
    };
  } catch (error) {
    console.error('Error fetching category data:', error);
    return {
      props: {
        error: true,
        category,
        initialTrips: [],
        categoryData: null
      },
      revalidate: 3600
    };
  }
}

export default CategoryPage;
