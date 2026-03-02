import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import en from '../../lang/en/slug'
import es from '../../lang/es/slug'
import { NextSeo } from "next-seo";
import { useRouter } from "next/router"
import parser from 'html-react-parser'
import Tabs from "../../components/general/Tabs"
import Error from "next/error"
import Link from "next/link";
import TitleLabel from "../../components/general/TitleLabel";
import { API_URL } from "../../lib/constants";
import { BRAND, absoluteUrl, getLogoUrlAbsolute } from '../../lib/brandConfig';
import { trackCustomEvent } from "../../lib/facebookPixel";
import { trackCustomEventTiktok } from "../../lib/tiktokPixel";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Breadcrumbs from "../../components/Breadcrumbs";
import Calendar from "../../components/Availability";
import TourSlider from "../../components/Slider"; // Slider de tours con estilos premium

// Lazy load componentes below-the-fold para mejorar performance
const Section6 = dynamic(() => import("../../components/home/Section6"), {
  loading: () => <div className="min-h-[400px]" />,
  ssr: true
});
const Section9 = dynamic(() => import("../../components/home/Section9"), {
  loading: () => <div className="min-h-[300px]" />,
  ssr: true
});
const Section1 = dynamic(() => import("../../components/home/Section1"), {
  loading: () => <div className="min-h-[400px]" />,
  ssr: true
});
const CategoryFAQs = dynamic(() => import("../../components/category/CategoryFAQs"), {
  loading: () => <div className="min-h-[300px]" />,
  ssr: true
});

export default function CategoryServicePage({ tour: initialTour, sujerencias: initialSujerencias, error, category }) {
  // Manejar errores primero
  if (error) {
    return <Error statusCode={error.statusCode} title={error.statusText} />
  }

  const [tab, setTab] = useState(0)
  const router = useRouter()
  const { locale } = router;
  const t = locale === 'en' ? en : es;

  // Estados para manejar los datos del tour dinámicamente
  const [tour, setTour] = useState(initialTour);
  const [sujerencias, setSujerencias] = useState(initialSujerencias);

  const [dataget, setFinancials] = useState({ data: [] });
  const [tourDays, setTourDays] = useState("");

  // Efecto para actualizar el tour cuando cambie la ruta
  useEffect(() => {
    const fetchTourData = async () => {
      if (router.query.slug && router.query.category && router.isReady) {
        try {
          const res = await fetch(`${API_URL}/api/trip/${router.query.slug}?locale=${locale}`);
          const newTour = await res.json();

          if (newTour && !newTour.error && newTour.category === router.query.category) {
            setTour(newTour);

            // Obtener sugerencias actualizadas
            const resSugerencias = await fetch(`${API_URL}/api/trip/?category=${router.query.category}&locale=${locale}&fields=title,slug,gallery,price,from,discount,category`);
            const newSujerencias = await resSugerencias.json();
            setSujerencias(newSujerencias.filter(item => item.slug !== router.query.slug));

            // Hacer scroll hacia arriba para posicionar correctamente el contenido
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            // Si el tour no existe o no coincide la categoría, mostrar error 404
            if (typeof window !== 'undefined') {
              window.location.href = '/404';
            }
          }
        } catch (error) {
          console.error('Error fetching tour data:', error);
          // En caso de error de red, solo redirigir si no hay tour actual
          if (!tour && typeof window !== 'undefined') {
            window.location.href = '/404';
          }
        }
      }
    };

    // Solo ejecutar cuando el router esté listo y tengamos los parámetros necesarios
    // Evitar ejecuciones innecesarias que pueden causar loops
    if (router.isReady && router.query.slug && router.query.category) {
      // Verificar si realmente necesitamos actualizar
      if (!tour || tour.slug !== router.query.slug || tour.category !== router.query.category) {
        fetchTourData();
      }
    }
  }, [router.query.slug, router.query.category, router.isReady, locale]);

  useEffect(() => {
    setFinancials({ data: [] });
    fetchFinancial();
  }, [tour?.slug]);

  const fetchFinancial = async () => {
    if (!tour?.slug) return; // Verificar que tour existe

    let url = "";
    let tourDays = "";

    switch (tour.slug) {
      case "classic-inca-trail":
        url = 'https://machupicchuavailability.com/api?idRuta=1&idLugar=2';
        tourDays = 3;
        break;
      case "short-inca-trail":
        url = 'https://machupicchuavailability.com/api?idRuta=5&idLugar=2';
        tourDays = 1;
        break;
      case "salkantay-trek-to-machu-picchu":
        url = 'https://machupicchuavailability.com/api?idRuta=3&idLugar=2';
        tourDays = 3;
        break;
      default:
        return;
    }

    setTourDays(tourDays);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

      const response = await fetch(url, {
        signal: controller.signal,
        mode: 'cors'
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn('Financial API returned non-OK status:', response.status);
        return;
      }

      const data = await response.json();

      if (data.success) {
        setFinancials(data.data);
      }
    } catch (error) {
      // Silenciar errores de red/timeout - la API externa puede no estar disponible
      if (error.name !== 'AbortError') {
        console.warn('Financial API unavailable:', error.message);
      }
    }
  };

  const originalPrice = tour?.price || 0;
  const enableDiscount = tour?.enableDiscount || false;
  const ardiscounts = tour?.ardiscounts || [];
  const tourslug = tour?.slug || "";

  // Calcular los valores iniciales de forma directa
  const calculateInitialValues = () => {
    if (!enableDiscount || ardiscounts.length === 0) {
      return { initialPersons: 1, lowestPrice: originalPrice, highestDiscount: 0 };
    }

    const sortedDiscounts = ardiscounts.sort((a, b) => b.pdiscount - a.pdiscount);
    const bestDiscount = sortedDiscounts[0];
    const bestPrice = originalPrice * (1 - bestDiscount.pdiscount / 100);

    return {
      initialPersons: bestDiscount.persons,
      lowestPrice: bestPrice,
      highestDiscount: bestDiscount.pdiscount,
    };
  };

  const [count, setCount] = useState(1);
  const [unitPrice, setUnitPrice] = useState(originalPrice);
  const [totalPrice, setTotalPrice] = useState(0);

  const minValue = 1;
  const maxValue = 10;

  useEffect(() => {
    const { initialPersons, lowestPrice } = calculateInitialValues();
    setCount(initialPersons);
    setUnitPrice(lowestPrice);
    setTotalPrice(lowestPrice * initialPersons);
  }, [tour, enableDiscount, ardiscounts, originalPrice]);

  // Función para calcular precios dinámicos
  const calculateDiscountedPrice = (numPassengers) => {
    if (!enableDiscount || ardiscounts.length === 0) return originalPrice;

    const applicableDiscount = ardiscounts
      .filter((discount) => numPassengers >= discount.persons)
      .reduce((max, curr) => (curr.pdiscount > max ? curr.pdiscount : max), 0);

    return originalPrice * (1 - applicableDiscount / 100);
  };

  // Actualizar precios dinámicos cuando cambia la cantidad de personas
  useEffect(() => {
    const newUnitPrice = calculateDiscountedPrice(count);
    setUnitPrice(newUnitPrice);
    setTotalPrice(newUnitPrice * count);
  }, [count, enableDiscount, ardiscounts, originalPrice]);


  if (error && error.statusCode) return <Error statusCode={error.statusCode} title={error.statusText} />

  const isActive = (index) => {
    if (tab === index) return " active";
    return ""
  }

  const discount = (tour.price - (tour.price * 15) / 100).toFixed(0)

  const handleBook = () => {
    trackCustomEvent('ButtonClick', {
      content_name: 'Book Now',
      content_category: 'User Actions',
    });

    trackCustomEventTiktok('ButtonClick', { buttonName: 'Book Now' });

    //router.push(`/book?tour=${tourslug}`)
    router.push(`/book?tour=${tourslug}&cantidadPeople=${count}`);
  }

  const icons = [
    {
      name: "Icono 1",
      icon: (
        <LazyLoadImage src="/assets/icon/type-tour.png" alt="" className="w-5 h-5 lg:w-10 lg:h-10 object-contain" />
      )
    },
    {
      name: "Icono 2",
      icon: (
        <LazyLoadImage src="/assets/icon/time.png" alt="" className="w-5 h-5 lg:w-10 lg:h-10 object-contain" />
      )
    },
    {
      name: "Icono 3",
      icon: (
        <LazyLoadImage src="/assets/icon/group-zise.png" alt="" className="w-5 h-5 lg:w-10 lg:h-10 object-contain" />
      )
    },
    {
      name: "Icono 4",
      icon: (
        <LazyLoadImage src="/assets/icon/dificult.png" alt="" className="w-5 h-5 lg:w-10 lg:h-10 object-contain" />
      )
    },
    {
      name: "Icono 5",
      icon: (
        <LazyLoadImage src="/assets/icon/accommodation.png" alt="" className="w-5 h-5 lg:w-10 lg:h-10 object-contain" />
      )
    },
    {
      name: "Icono 6",
      icon: (
        <LazyLoadImage src="/assets/icon/languages.png" alt="" className="w-5 h-5 lg:w-10 lg:h-10 object-contain" />

      )
    },

  ];

  const increment = () => {
    if (count < maxValue) {
      setCount(count + 1);
    }
  };

  const decrement = () => {
    if (count > minValue) {
      setCount(count - 1);
    }
  };

  useEffect(() => {
    setIsOpen(false);
  }, [tour?.slug]);

  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);

  //const handleOpen = () => setIsOpen(true);
  const handleOpen = (e) => {
    if (!dataget?.data || dataget.data.length === 0) {
      const url = tour?.wetravel
        ? `https://www.wetravel.com/checkout_embed?uuid=${tour.wetravel}`
        : `https://api.whatsapp.com/send/?phone=51970811976&text=${encodeURIComponent(tour?.title || "")}`;

      if (typeof window !== "undefined") {
        const newWin = window.open(url, "_blank", "noopener,noreferrer");
        if (newWin) newWin.focus();
      }
      return;
    }

    // Si hay fechas, abrimos el modal
    setIsOpen(true);
  };
  const handleClose = () => setIsOpen(false);

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleClose();
    }
  };

  const [isZoomed, setIsZoomed] = useState(false);

  // Verificar si el tour existe antes de renderizar
  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando contenido del servicio...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              [
                {
                  "@context": "https://schema.org",
                  "@type": "Organization",
                  "name": BRAND.name,
                  "url": absoluteUrl(`/${category}/${tour.slug}`),
                  "logo": getLogoUrlAbsolute(),
                  "sameAs": [BRAND.social.facebook, BRAND.social.instagram, BRAND.social.tiktok, BRAND.social.youtube].filter(Boolean)
                },
                {
                  "@context": "https://schema.org",
                  "@type": "TouristAttraction",
                  "name": tour.title,
                  "description": tour.meta_description,
                  "image": tour.gallery?.map(img => img.url) || [],
                  "url": absoluteUrl(`/${category}/${tour.slug}`),
                  "touristType": "Adventure Travelers"
                },
                {
                  "@context": "https://schema.org",
                  "@type": "Product",
                  "name": tour.title,
                  "description": tour.meta_description,
                  "image": tour.gallery?.[0]?.url || "",
                  "brand": {
                    "@type": "Brand",
                    "name": BRAND.name
                  },
                  "offers": {
                    "@type": "Offer",
                    "price": originalPrice.toFixed(2),
                    "priceCurrency": "USD",
                    "availability": "https://schema.org/InStock",
                    "url": absoluteUrl(`/${category}/${tour.slug}`),
                    "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
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
                  "@type": "BreadcrumbList",
                  "itemListElement": [
                    {
                      "@type": "ListItem",
                      "position": 1,
                      "name": "Home",
                      "item": absoluteUrl('/')
                    },
                    {
                      "@type": "ListItem",
                      "position": 2,
                      "name": category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                      "item": absoluteUrl(`/${category}`)
                    },
                    {
                      "@type": "ListItem",
                      "position": 3,
                      "name": tour.title,
                      "item": absoluteUrl(`/${category}/${tour.slug}`)
                    }
                  ]
                }
              ]
            )
          }}
        />
      </Head>
      <NextSeo
        title={`${tour.meta_title}`}
        description={`${tour.meta_description}`}
        canonical={absoluteUrl(`/${category}/${tour?.slug}`)}
        openGraph={{
          url: absoluteUrl(`/${category}/${tour?.slug}`),
          title: `${tour?.meta_title}`,
          description: tour?.meta_description,
          images: tour?.gallery?.[0] ? [
            {
              url: `${tour.gallery[0].url}`,
              width: 1600,
              height: 620,
              type: `image/${tour.gallery[0].url.split('.').pop().split('?')[0]}`,
            }
          ] : []
        }}
      />
      {/* Hero Section - Diseño Moderno igual que Category */}
      <section className="category-hero-section">
        {/* Imagen de fondo */}
        <div
          className="category-hero-bg"
          style={{
            backgroundImage: tour?.gallery?.[0] ? `url('${tour.gallery[0].url}')` : 'none',
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
              <Link href={`/${category}`} className="breadcrumb-link">
                {category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Link>
              <svg className="w-4 h-4 breadcrumb-separator" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="breadcrumb-current">{tour?.title}</span>
            </nav>

            {/* Badge de servicio */}
            <div className="category-badge">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {tour?.quickstats?.[0]?.content || (locale === 'en' ? 'Tour' : 'Tour')}
            </div>

            {/* Título principal */}
            <h1 className="category-hero-title">
              {tour?.title}
            </h1>

            {/* Descripción corta (subtítulo) */}
            {tour?.sub_title && (
              <p className="category-hero-description">
                {tour.sub_title}
              </p>
            )}

            {/* Stats compactos - precio y detalles */}
            <div className="category-hero-stats">
              <div className="category-stat">
                <span className="category-stat-number">${originalPrice.toFixed(0)}</span>
                <span className="category-stat-label">{locale === 'en' ? 'Per Person' : 'Por Persona'}</span>
              </div>
              <div className="category-stat-divider"></div>
              {tour?.quickstats?.[1] && (
                <>
                  <div className="category-stat">
                    <LazyLoadImage src="/assets/icon/time.png" alt="Time" className="w-5 h-5" />
                    <span className="category-stat-label">{tour.quickstats[1].content}</span>
                  </div>
                  <div className="category-stat-divider"></div>
                </>
              )}
              {tour?.quickstats?.[3] && (
                <div className="category-stat">
                  <LazyLoadImage src="/assets/icon/dificult.png" alt="Difficulty" className="w-5 h-5" />
                  <span className="category-stat-label">{tour.quickstats[3].content}</span>
                </div>
              )}
            </div>

            {/* Botón CTA */}
            <div className="category-hero-cta">
              <button onClick={handleOpen} className="category-cta-btn">
                {dataget?.data?.length > 0 ? t.availability : t.booking}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats flotante con información del tour */}
        <div className="category-quick-stats-container">
          <div className="category-quick-stats">
            {tour?.quickstats?.slice(0, 6).map((qsk, index) => (
              <div key={index} className="quick-stat-item">
                {icons[index]?.icon}
                <div className="quick-stat-text">
                  <span className="quick-stat-label">{qsk.title}</span>
                  <span className="quick-stat-value">{qsk.content}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="2xl:container mx-auto">
        <div className="lg:mx-24 mx-3">
          <div className="grid grid-cols-12 lg:gap-8 gap-0">

            <section className="col-span-12">
              <div>
                <h2 className="text-3xl text-stone-900 text-center md:mx-5">{tour.sub_title}</h2>
                <p className="italic my-3 text-center md:mx-5"><strong>{tour.highlight}</strong></p>
                <Breadcrumbs title={tour.title} category={tour.category} />

                <img
                  src={tour.gallery[tour.gallery.length - 1].url}
                  alt={tour.gallery[tour.gallery.length - 1].alt}
                  title={tour.gallery[tour.gallery.length - 1].alt}
                  className="float-none md:float-right md:ml-4 mb-2 w-full md:w-1/2 h-auto rounded cursor-zoom-in"
                  onClick={() => setIsZoomed(true)}
                />
                <div>{parser(tour.description)}</div>
                {isZoomed && (
                  <div
                    className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4"
                    onClick={() => setIsZoomed(false)} // cerrar al hacer clic fuera
                  >
                    <div className="relative max-w-full max-h-full">
                      {/* Botón ✕ para cerrar */}
                      <button
                        onClick={() => setIsZoomed(false)}
                        className="absolute top-2 right-2 text-primary bg-secondary rounded-full p-0 m-0 hover:text-secondary hover:bg-primary text-3xl w-9"
                      >
                        &times;
                      </button>

                      {/* Imagen ampliada */}
                      <img
                        src={tour.gallery[tour.gallery.length - 1].url}
                        alt={tour.gallery[tour.gallery.length - 1].alt}
                        title={tour.gallery[tour.gallery.length - 1].alt}
                        className="max-w-full max-h-screen object-contain rounded shadow-lg"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="col-md-6">
                <img
                  src={tour.gallery[tab].url}
                  alt={tour.gallery[tab].alt}
                  title={tour.gallery[tab].alt}
                  className="rounded mt-4 w-full lg:h-[35rem] h-56 object-cover"
                />
                <div className="flex py-2 pr-8 md:pr-0" style={{ cursor: 'pointer', gap: '8px' }}>
                  {((tour.gallery.length > 5 ? // si hay más de 5, quita el último
                    tour.gallery.slice(0, -1) : tour.gallery)                // si no, muéstralos todos
                  ).map((img, index) => (
                    <img
                      key={index}
                      src={img.url}
                      alt={img.alt}
                      title={img.alt}
                      className={`${isActive(index)} rounded object-cover justify-center`}
                      style={{ height: '90px', width: '20%' }}
                      onClick={() => setTab(index)}
                    />
                  ))}
                </div>
              </div>

              <TitleLabel label={t.trip_details} />

              <Tabs key={tour.idTour} tabsQuery={tour.information} />

              <div className="grid lg:grid-cols-3  grid-col-1 gap-2 text-white bg-primary py-4 px-8 text-center items-center rounded-t">
                <h3 className="text-lg font-bold">{t.have_questions}</h3>
                <div>
                  <h4>{t.call}</h4>
                  <Link
                    href="https://api.whatsapp.com/send/?phone=51970811976"
                    className='no-underline hover:underline text-secondary text-base font-bold'>
                    +51 970811976
                  </Link>
                </div>
                <div>
                  <h4>{t.email}</h4>
                  <Link
                    href={`mailto:${BRAND.contactEmail}`}
                    className='no-underline hover:underline text-secondary text-base font-bold'>
                    {BRAND.contactEmail}
                  </Link>
                </div>
              </div>

              <button
                onClick={handleOpen}
                className="
                  fixed -bottom-4 left-1/2 transform -translate-x-1/2 text-xl shadow-xl font-extrabold inline-flex z-50"
              >
                <span className="animate-bounce px-4 pt-2 pb-4 text-primary bg-secondary  hover:bg-primary hover:text-secondary rounded-t-2xl drop-shadow-[0_0_10px_rgba(251,184,0,1)] transition-all duration-300">{dataget?.data?.length > 0 ? t.availability : t.booking}</span>
              </button>
              <div>
                {/* Modal */}
                {isOpen && (
                  <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                    onClick={handleBackdropClick}
                  >
                    <div
                      ref={modalRef}
                      className="relative bg-white rounded-lg shadow-lg w-full max-w-4xl m-4"
                    >
                      <button
                        onClick={handleClose}
                        className="absolute top-2 right-2 text-primary bg-secondary rounded-full p-0 m-0 hover:text-secondary hover:bg-primary text-3xl w-9"
                      >
                        &times;
                      </button>
                      <Calendar
                        data={dataget.data}
                        updatedAt={dataget.updatedAt}
                        title={tour.title}
                        messages={t.messages}
                        tourDays={tourDays}
                        idTour={tour.wetravel}
                        language={locale}
                      />
                    </div>
                  </div>
                )}
              </div>

            </section>
          </div>

          <section className="my-8">
            <TitleLabel label={t.similar_tours} />
            {sujerencias.length > 0 && (
              <TourSlider tours={sujerencias.slice(0, 8)} t={t} />
            )}
          </section>
        </div>
      </div>

      {/* Componentes reutilizados de Home para consistencia visual */}
      {/* Sección de Estadísticas/Achievements - Mismo estilo que Home */}
      <Section9 />

      {/* Sección "Por qué elegirnos" - Mismo estilo que Home */}
      <Section1 />

      {/* Sección de Testimonios - Mismo estilo que Home */}
      <Section6 />

      {/* Sección de FAQs específicos de la categoría */}
      <div className="2xl:container mx-auto">
        <div className="lg:mx-24 mx-3">
          <CategoryFAQs category={category} />
        </div>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  // Generar páginas bajo demanda en lugar de en build time
  // Esto es más eficiente para sitios con muchos tours
  return {
    paths: [], // No pre-generar ningún path en build time
    fallback: 'blocking' // Generar páginas bajo demanda y cachearlas
  };
}

export async function getStaticProps({ locale, params }) {
  const { category, slug } = params;

  try {
    // Buscar el tour por slug
    let res = await fetch(`${API_URL}/api/trip/${slug}?locale=${locale}`)
    let tour = await res.json()

    if (!tour || tour.error) {
      return {
        notFound: true,
        revalidate: 3600 // Reintentar cada hora
      }
    }

    // Verificar que el tour pertenece a la categoría correcta
    if (tour.category !== category) {
      return {
        notFound: true,
        revalidate: 3600
      }
    }

    // Obtener tours similares de la misma categoría
    let resSugerencias = await fetch(`${API_URL}/api/trip/?category=${category}&locale=${locale}&fields=title,slug,gallery,price,from,discount,category`)
    let sujerencias = await resSugerencias.json()

    // Filtrar el tour actual de las sugerencias
    sujerencias = sujerencias.filter(item => item.slug !== slug)

    return {
      props: {
        tour,
        sujerencias: sujerencias || [],
        category
      },
      revalidate: 3600 // Regenerar cada hora (ISR)
    }
  } catch (error) {
    console.error('Error fetching tour:', error);
    return {
      props: {
        error: { statusCode: 500, statusText: 'Internal Server Error' },
        tour: null,
        sujerencias: [],
        category
      },
      revalidate: 3600
    }
  }
}