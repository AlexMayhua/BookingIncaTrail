import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { API_URL } from '../../lib/constants';
import { getData } from '../../utils/fetchData';
import Breadcrumbs from '../../components/Breadcrumbs';
import TitleLabel from '../../components/general/TitleLabel';
import { absoluteUrl } from '../../lib/brandConfig';
import CategorySlider from '../../components/general/CategorySlider';
// Componentes de home para consistencia visual
import Section6 from '../../components/home/Section6'; // Testimonios
import Section7 from '../../components/home/Section7'; // FAQs
import Section1 from '../../components/home/Section1'; // Why Choose Us
import Section9 from '../../components/home/Section9'; // Achievements/Estadísticas

// Funciones helper para obtener descripción e imagen de categoría
const getServiceDescription = (category) => {
  const descriptions = {
    'inca-trail': 'Descubre el legendario Camino Inca a Machu Picchu',
    'salkantay': 'Aventura épica por la montaña Salkantay',
    'machupicchu': 'Visita la maravilla del mundo Machu Picchu',
    'ausangate': 'Explora la montaña sagrada de Ausangate',
    'peru-packages': 'Paquetes turísticos completos en Perú',
    'day-tours': 'Tours de un día en Cusco y alrededores',
    'rainbow-mountain': 'Conoce la espectacular Montaña de Colores',
    'alternative-tours': 'Tours alternativos únicos en Perú',
    'inca-jungle': 'Aventura en la selva hacia Machu Picchu'
  };
  return descriptions[category] || `Descubre los mejores tours de ${category.replace('-', ' ')}`;
};

const getServiceImage = (category) => {
  const images = {
    'inca-trail': '/img/navbar/inca-trail-post.jpg',
    'salkantay': '/img/navbar/salkantay-trek.jpg',
    'machupicchu': '/img/navbar/machu-picchu.jpeg',
    'ausangate': '/img/navbar/ausangate-trek.jpeg',
    'peru-packages': '/img/navbar/cusco-tours.jpg',
    'day-tours': '/img/navbar/cusco.jpeg',
    'rainbow-mountain': '/img/navbar/rainbow-montain-&-red-valley.jpg',
    'alternative-tours': '/img/navbar/ausangate-trek.jpeg',
    'inca-jungle': '/img/navbar/inca-jungle.jpg'
  };
  return images[category] || '/assets/default-category.jpg';
};

const CategoriesPage = ({ categories, error }) => {
  const router = useRouter();
  const { locale } = router;
  
  // Breadcrumbs
  const breadcrumbItems = [
    { label: locale === 'en' ? 'Home' : 'Inicio', href: '/' },
    { label: locale === 'en' ? 'Categories' : 'Categorías', href: '/categories', current: true }
  ];

  // Datos para SEO
  const pageTitle = locale === 'en' 
    ? 'All Tour Categories - BookingIncatrail' 
    : 'Todas las Categorías de Tours - BookingIncatrail';
  const pageDescription = locale === 'en'
    ? 'Explore all our tour categories and tourist services in Peru. Find the perfect trip for you.'
    : 'Explora todas nuestras categorías de tours y servicios turísticos en Perú. Encuentra el viaje perfecto para ti.';

  if (error) {
    return (
      <div className="layoud-spacing">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-600 mb-4">Error al cargar categorías</h1>
          <p className="text-gray-500 mb-8">No se pudieron cargar las categorías en este momento.</p>
          <Link href="/" className="bg-secondary text-primary px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <NextSeo
        title={pageTitle}
        description={pageDescription}
        canonical={absoluteUrl('/categories')}
        openGraph={{
          title: pageTitle,
          description: pageDescription,
          url: absoluteUrl('/categories'),
          images: [
            {
              url: absoluteUrl('/assets/categories-hero.jpg'),
              width: 1200,
              height: 630,
              alt: 'Categorías de Tours',
            },
          ],
          type: 'website',
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: 'categorías, tours, viajes, Perú, Cusco, Machu Picchu, aventura, trekking',
          },
        ]}
      />

      <Head>
        {/* Structured Data para SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "name": "Categorías de Tours",
              "description": pageDescription,
              "url": absoluteUrl('/categories'),
              "mainEntity": {
                "@type": "ItemList",
                "numberOfItems": categories.length,
                "itemListElement": categories.map((category, index) => ({
                  "@type": "ListItem",
                  "position": index + 1,
                  "item": {
                    "@type": "Thing",
                    "name": category.name,
                    "description": category.description,
                    "url": absoluteUrl(`/category/${category.slug}`)
                  }
                }))
              }
            })
          }}
        />
      </Head>

      <div className="layoud-spacing">
        {/* Hero Section */}
        <section className="relative h-96 bg-cover bg-center bg-no-repeat" 
                 style={{ backgroundImage: "url('/assets/categories-hero.jpg')" }}>
          <div className="custom-overlay-negro"></div>
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 custom-text">
                {locale === 'en' ? 'Our Categories' : 'Nuestras Categorías'}
              </h1>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto">
                {locale === 'en' 
                  ? 'Discover all our tours organized by categories'
                  : 'Descubre todos nuestros tours organizados por categorías'}
              </p>
            </div>
          </div>
        </section>

        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Categorías con Slider - Mismo estilo que Home */}
        <section className="py-12 md:py-16 lg:py-20">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-primary inline-block mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              {locale === 'en' 
                ? `${categories.length} Available Categories` 
                : `${categories.length} Categorías Disponibles`}
            </h1>
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="w-16 h-1 bg-secondary rounded-full"></div>
              <div className="w-8 h-1 bg-secondary/60 rounded-full"></div>
              <div className="w-4 h-1 bg-secondary/30 rounded-full"></div>
            </div>
            <p className="text-gray-600 mt-6 max-w-2xl mx-auto text-lg">
              {locale === 'en'
                ? 'Explore our different tour categories and find the perfect experience for your next adventure in Peru.'
                : 'Explora nuestras diferentes categorías de tours y encuentra la experiencia perfecta para tu próxima aventura en Perú.'}
            </p>
          </div>
          <CategorySlider categories={categories} />
        </section>

        {/* Componentes reutilizados de Home para consistencia visual */}
        {categories.length > 0 && (
          <>
            {/* Sección de Estadísticas/Achievements - Mismo estilo que Home */}
            <Section9 />

            {/* Sección "Por qué elegirnos" - Mismo estilo que Home */}
            <Section1 />

            {/* Sección de Testimonios - Mismo estilo que Home */}
            <Section6 />

            {/* Sección de FAQs - Mismo estilo que Home */}
            <Section7 />
          </>
        )}
      </div>
    </>
  );
};

export async function getServerSideProps({ res }) {
  try {
    // Obtener todas las categorías con conteo de tours (solo campos necesarios)
    const tripsRes = await getData(`${API_URL}/api/trip?locale=es&fields=category,lang`);
    
    if (!tripsRes || tripsRes.err) {
      return {
        props: {
          error: true,
          categories: []
        }
      };
    }

    // Procesar categorías y contar tours por categoría
    const trips = tripsRes.trips || [];
    const categoryMap = new Map();

    trips.forEach(trip => {
      if (trip.category) {
        if (categoryMap.has(trip.category)) {
          categoryMap.set(trip.category, categoryMap.get(trip.category) + 1);
        } else {
          categoryMap.set(trip.category, 1);
        }
      }
    });

    // Crear array de categorías con información adicional
    const categories = Array.from(categoryMap.entries()).map(([slug, count]) => ({
      slug,
      name: slug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: getServiceDescription(slug) || `Descubre los mejores tours de ${slug.replace('-', ' ')}`,
      image: getServiceImage(slug) || '/assets/default-category.jpg',
      count
    }));

    // Ordenar categorías por nombre
    categories.sort((a, b) => a.name.localeCompare(b.name));

    // Configurar cache headers para mejor rendimiento
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

    return {
      props: {
        categories,
        error: false
      }
    };
  } catch (error) {
    console.error('Error fetching categories data:', error);
    return {
      props: {
        error: true,
        categories: []
      }
    };
  }
}

export default CategoriesPage;