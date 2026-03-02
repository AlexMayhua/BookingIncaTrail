import { NextSeo } from "next-seo"
import { useState } from "react";
import { useRouter } from "next/router"
import Head from "next/head"
import dynamic from "next/dynamic"
import en from '../lang/en/home'
import es from '../lang/es/home'
import { API_URL } from "../lib/constants";
import FrontPage from "../components/home/FrontPage";
import { BRAND, absoluteUrl, getLogoUrlAbsolute } from '../lib/brandConfig';
import CategoriesSection from '../components/home/CategoriesSection';

// Lazy load componentes below-the-fold para mejorar performance
const Section1 = dynamic(() => import("../components/home/Section1"), {
  loading: () => <div className="min-h-[400px]" />,
  ssr: true
});
const Section6 = dynamic(() => import("../components/home/Section6"), {
  loading: () => <div className="min-h-[400px]" />,
  ssr: true
});
const Section7 = dynamic(() => import("../components/home/Section7"), {
  loading: () => <div className="min-h-[300px]" />,
  ssr: true
});
const Section9 = dynamic(() => import("../components/home/Section9"), {
  loading: () => <div className="min-h-[300px]" />,
  ssr: true
});
const ServicesCarousel = dynamic(() => import("../components/home/ServicesCarousel"), {
  loading: () => <div className="min-h-[400px]" />,
  ssr: true
});



export default function Index({ topTreks = [], allServices = [] }) {
  const router = useRouter()
  const { locale } = router;
  const t = locale === 'en' ? en : es;

  // Asegurar que topTreks sea un array
  const treks = Array.isArray(topTreks) ? topTreks : [];

  const text = "<p>A professional local tour company -<strong>&nbsp;100% Peruvian</strong>. We offer&nbsp;<strong>trips to Machu Picchu</strong>, The original<strong>&nbsp;Classic Inca trail</strong>&nbsp;(no shortcuts!),&nbsp;<strong>Salkantay trekking, Lares trek, Choquequirao trek,</strong>&nbsp;as well as customized treks and hikes for professional hikers.<br /> We also offer approachable hikes for those unable to participate in the classical routes.<br /> <strong>Owned by Abraham Ocon Rojas, Official Tour guide of Machu Picchu with 17 years of experience</strong>&nbsp;in Peruvian treks, hikes and historical sites. We would gladly take you on your next unforgetable life changing expedition!</p>"

  const [isOpen, setIsOpen] = useState(false);

  // Función que cierra si haces clic en el fondo oscuro
  const handleOverlayClick = (e) => {
    if (e.target.id === "modal-overlay") {
      setIsOpen(false);
    }
  };

  function limitWords(text, wordLimit = 15) {
    return text.split(' ').slice(0, wordLimit).join(' ') + ' ...';
  }

  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": BRAND.name,
                "url": BRAND.siteUrl,
                "logo": getLogoUrlAbsolute(),
                "description": t.meta_description,
                "address": {
                  "@type": "PostalAddress",
                  "addressCountry": "PE",
                  "addressRegion": "Cusco"
                },
                "contactPoint": {
                  "@type": "ContactPoint",
                  "telephone": BRAND.contactPhone,
                  "contactType": "customer service",
                  "email": BRAND.contactEmail,
                  "availableLanguage": ["Spanish", "English"]
                },
                "sameAs": [
                  BRAND.social.facebook,
                  BRAND.social.instagram,
                  BRAND.social.tiktok,
                  BRAND.social.youtube
                ].filter(Boolean)
              },
              {
                "@context": "https://schema.org",
                "@type": "TravelAgency",
                "name": BRAND.name,
                "url": BRAND.siteUrl,
                "logo": getLogoUrlAbsolute(),
                "priceRange": "$$",
                "address": {
                  "@type": "PostalAddress",
                  "addressCountry": "PE",
                  "addressRegion": "Cusco"
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.9",
                  "reviewCount": "8900",
                  "bestRating": "5",
                  "worstRating": "1"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": "Featured Tours",
                "description": "Top adventure tours in Peru",
                "numberOfItems": treks.length,
                "itemListElement": treks.slice(0, 10).map((trek, index) => ({
                  "@type": "ListItem",
                  "position": index + 1,
                  "item": {
                    "@type": "Product",
                    "name": trek.title,
                    "url": absoluteUrl(`/${trek.category}/${trek.slug}`),
                    "image": trek.gallery?.[0]?.url || '',
                    "offers": {
                      "@type": "Offer",
                      "price": trek.price?.toFixed(2) || "0.00",
                      "priceCurrency": "USD"
                    }
                  }
                }))
              }
            ])
          }}
        />
      </Head>
      <NextSeo
        title={t.meta_title}
        description={t.meta_description}
        canonical={absoluteUrl('/')}
        openGraph={{
          url: absoluteUrl('/'),
          title: t.meta_title,
          description: t.meta_description,
          images: [
            {
              url: '/img/hero/hero-slider-4-min.jpg',
              width: 1400,
              height: 465,
              type: 'image/jpg',
            }
          ],
          site_name: BRAND.name,
        }}
      />


      {/* Hero Section con Top Tours integrado */}
      <FrontPage topTours={treks} />

      {/* Sección de Categorías */}
      <CategoriesSection />

      {/* Carrusel de Servicios */}
      <ServicesCarousel services={allServices} />

      {/* Main Content Container */}
      <div className="2xl:container mx-auto">
        <div className="lg:mx-20 mx-5 md:mx-8">

          {/* Secciones con mejor espaciado */}
          <Section6 />
          <Section7 />
          <Section1 />
          <Section9 />

          <section className="pb-8 mb-8 md:pb-10 md:mb-10">
            {/* <h2 className="lg:text-4xl text-xl my-8 text-center">...</h2> */}
            <div className="flex justify-center px-4">
              <div className="flex flex-wrap justify-center gap-4 max-w-screen-xl">
                <div className="w-full max-w-xs sm:w-56 md:w-60">
                  <img
                    src="/img/other/esnna.jpg"
                    alt="ESNNA"
                    title="ESNNA"
                    className="rounded-t transition duration-300 ease-in-out hover:scale-110 w-full cursor-pointer"
                    onClick={() => setIsZoomed(true)}
                  />
                  {isZoomed && (
                    <div
                      className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4"
                      onClick={() => setIsZoomed(false)} // cerrar al hacer clic fuera
                    >
                      <div className="relative max-w-full max-h-full">
                        {/* Botón ✕ para cerrar */}
                        <button
                          onClick={() => setIsZoomed(false)}
                          className="absolute top-2 right-2 text-blue bg-cream rounded-full p-0 m-0 hover:text-cream hover:bg-blue text-3xl w-9"
                        >
                          &times;
                        </button>

                        {/* Imagen ampliada */}
                        <img
                          src="/img/other/esnna.jpg"
                          alt="ESNNA"
                          title="ESNNA"
                          className="max-w-full sm:max-w-sm  object-contain rounded shadow-lg"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  )
}

export async function getStaticProps({ locale }) {
  const lang = locale
  try {
    // Fetch tours destacados (deals)
    const res1 = await fetch(`${API_URL}/api/trip/?locale=${lang}&isDeals=true&fields=title,slug,gallery,price,from,discount,category,quickstats,duration,meta_title,meta_description,isDeals`)
    const contentType1 = res1.headers.get('content-type') || '';

    // Fetch todos los servicios para el carrusel
    const res2 = await fetch(`${API_URL}/api/trip/?locale=${lang}&fields=title,slug,gallery,price,discount,category,quickstats,duration`)
    const contentType2 = res2.headers.get('content-type') || '';

    let topTreks = [];
    let allServices = [];

    if (res1.ok && contentType1.includes('application/json')) {
      topTreks = await res1.json();
    } else {
      console.error('getStaticProps: unexpected response fetching topTreks', { status: res1.status, contentType: contentType1 })
    }

    if (res2.ok && contentType2.includes('application/json')) {
      allServices = await res2.json();
    } else {
      console.error('getStaticProps: unexpected response fetching allServices', { status: res2.status, contentType: contentType2 })
    }

    return {
      props: { topTreks, allServices },
      revalidate: 3600 // Regenerar página cada hora (3600 segundos)
    }
  } catch (err) {
    console.error('getStaticProps: error fetching data', err)
    return { props: { topTreks: [], allServices: [] }, revalidate: 3600 }
  }
}