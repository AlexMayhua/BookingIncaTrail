import { useState, useEffect, useRef } from 'react';
import useMediaQuery from '../useMediaQuery';
import en from '../../lang/en/navbar';
import es from '../../lang/es/navbar';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import parser from 'html-react-parser';
import { trackCustomEvent } from '../../lib/facebookPixel';
import { BRAND } from '../../lib/brandConfig';
import useNavbarData from '../../hooks/useNavbarData';
import CachedImage from '../general/CachedImage';
import { getImageUrl } from '../../utils/cacheHelpers';
import { USFlag, ESFlag } from '../general/FlagSVG';

export default function Navbar() {
  const [gender, setGender] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width: 1024px)');

  // Estado para controlar el hover dinámico de descripción e imagen
  const [hoveredService, setHoveredService] = useState(null);

  // Estado para controlar qué categoría del mega menú está abierta
  const [openCategory, setOpenCategory] = useState(null);
  const closeTimeoutRef = useRef(null);

  // Hook para obtener datos dinámicos de tours desde la base de datos
  const {
    toursData,
    loading,
    getToursByCategory,
    getTourImage,
    getTourDescription,
  } = useNavbarData();

  const router = useRouter();
  const { locale } = router;
  const t = locale === 'en' ? en : es;
  // Evitar href nulo en Link: usar fallback '/blog' si BRAND.blogUrl no está definido
  const blogUrl = BRAND.blogUrl
    ? locale === 'en'
      ? BRAND.blogUrl
      : `${BRAND.blogUrl}/es`
    : '/blog';

  const changeLanguage = (language) => {
    if (language !== locale) {
      router.push(router.pathname, router.asPath, { locale: language });
      // Idioma cambiado correctamente
    }
  };

  const [navChange, setNavchange] = useState(false);

  // Usar datos dinámicos de la base de datos en lugar de datos hardcodeados
  const incaTrail = loading ? [] : getToursByCategory('inca-trail');
  const salkantay = loading ? [] : getToursByCategory('salkantay');
  const ausangate = loading ? [] : getToursByCategory('ausangate');
  const perupackages = loading ? [] : getToursByCategory('peru-packages');
  const cuscoTours = loading ? [] : getToursByCategory('day-tours');
  const raimbow = loading ? [] : getToursByCategory('rainbow-mountain');
  const incaJungle = loading ? [] : getToursByCategory('inca-jungle');

  // Configuración dinámica de todas las categorías para el navbar
  // ⚠️ Solo mostrar categorías con tours en DB y con rutas válidas
  const navbarCategories = [
    {
      slug: 'inca-trail',
      data: incaTrail,
      label: t.inca_trail,
      subtitle: t.subtitle_inca_trail,
    },
    {
      slug: 'salkantay',
      data: salkantay,
      label: t.salkantay,
      subtitle: t.subtitle_salkantay,
    },
    {
      slug: 'ausangate',
      data: ausangate,
      label: t.ausangate,
      subtitle: t.subtitle_ausangate,
    },
    {
      slug: 'rainbow-mountain',
      data: raimbow,
      label: t.rainbowmountain,
      subtitle: t.subtitle_rainbowmountain,
    },
    {
      slug: 'inca-jungle',
      data: incaJungle,
      label: t.incajungle,
      subtitle: t.incajungle,
    },
    {
      slug: 'day-tours',
      data: cuscoTours,
      label: t.cusco,
      subtitle: t.subtitle_cusco,
    },
    {
      slug: 'peru-packages',
      data: perupackages,
      label: t.peru,
      subtitle: t.subtitle_peru,
    },
  ];

  // Ref para el contenedor del navbar con auto-scroll
  const navbarScrollRef = useRef(null);

  // Auto-scroll del navbar - muestra 7 categorías, luego anima para mostrar las siguientes
  useEffect(() => {
    if (isSmallScreen) return; // Solo en desktop

    const scrollContainer = navbarScrollRef.current;
    if (!scrollContainer) return;

    let scrollInterval;
    let isPaused = false;

    // Pausar animación cuando el mouse está sobre el navbar
    const handleMouseEnter = () => {
      isPaused = true;
    };
    const handleMouseLeave = () => {
      isPaused = false;
    };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    // Animación: scroll suave cada 4 segundos
    scrollInterval = setInterval(() => {
      if (!isPaused && scrollContainer) {
        const maxScroll =
          scrollContainer.scrollWidth - scrollContainer.clientWidth;
        const currentScroll = scrollContainer.scrollLeft;

        // Si llegó al final, volver al inicio
        if (currentScroll >= maxScroll - 10) {
          scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Scroll suave hacia la derecha (mostrar siguiente categoría)
          scrollContainer.scrollBy({ left: 180, behavior: 'smooth' });
        }
      }
    }, 4000); // Cada 4 segundos

    return () => {
      clearInterval(scrollInterval);
      if (scrollContainer) {
        scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
        scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [isSmallScreen]);

  // Funciones para manejar el hover dinámico (selección persistente)
  const handleServiceHover = (serviceSlug) => {
    setHoveredService(serviceSlug);
  };

  // Funciones para manejar la apertura/cierre del mega menú
  const handleCategoryMouseEnter = (categorySlug) => {
    // Cancelar cualquier timeout de cierre pendiente
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    // Abrir inmediatamente
    setOpenCategory(categorySlug);
    // Auto-seleccionar el primer tour de la categoría
    const cat = navbarCategories.find((c) => c.slug === categorySlug);
    if (cat && cat.data.length > 0) {
      setHoveredService(cat.data[0].slug);
    } else {
      setHoveredService(null);
    }
  };

  const handleCategoryMouseLeave = () => {
    // Delay antes de cerrar para dar tiempo al usuario de mover el mouse al menú
    closeTimeoutRef.current = setTimeout(() => {
      setOpenCategory(null);
      setHoveredService(null);
    }, 300); // 300ms de delay
  };

  const handleMegaMenuMouseEnter = () => {
    // Cancelar el cierre cuando el mouse entra al mega menú
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleMegaMenuMouseLeave = () => {
    // Cerrar el menú cuando el mouse sale del mega menú
    setOpenCategory(null);
    setHoveredService(null);
  };

  // Cleanup del timeout cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Función para obtener la descripción específica del servicio
  const getServiceDescription = (category, serviceSlug) => {
    // SIEMPRE usar descripción desde la base de datos
    if (serviceSlug) {
      const descriptionFromDB = getTourDescription(serviceSlug);
      if (descriptionFromDB && descriptionFromDB.trim() !== '') {
        return descriptionFromDB;
      }
    }

    // Fallback solo si no hay datos en BD - mensaje de carga
    return t.loading;
  };

  // Función helper para obtener la categoría real de un tour desde la base de datos
  const getTourCategory = (serviceSlug) => {
    const tour = toursData.find((t) => t.slug === serviceSlug);
    return tour?.category || null;
  };

  // Función para obtener la imagen específica del servicio con datos de la base de datos
  const getServiceImage = (category, serviceSlug) => {
    // Si tenemos un slug, obtener su categoría real de la BD
    const realCategory = serviceSlug ? getTourCategory(serviceSlug) : category;

    // Primero intentar obtener la imagen desde la base de datos
    const imageFromDB = getTourImage(serviceSlug);

    // Las imágenes de Cloudinary no necesitan cache busting
    if (imageFromDB) {
      return imageFromDB;
    }

    // Fallback: mapeo dinámico de slugs específicos a imágenes locales (solo si no hay imagen en BD)
    const serviceImageMap = {
      // Inca Trail
      'classic-inca-trail': '/img/navbar/inca-trail-post.jpg',
      'short-inca-trail': '/img/navbar/inca-trail-2023.webp',
      'Salkantay-and-Inca-Trail-7-days-family-friendly-trek':
        '/img/navbar/salkantay-trek.jpg',
      'Inca-Trail-and-the-Inca-Quarries-of-Cachiccata-4-Days-3-Nights':
        '/img/navbar/inka-trail.jpg',

      // Salkantay
      'salkantay-trek': '/img/navbar/salkantay-trek.jpg',
      'salkantay-trek-to-machu-picchu': '/img/navbar/salkantay.jpg',

      // Machu Picchu
      'machu-picchu-trips': '/img/navbar/Machu-Picchu-post.jpg',
      'by-car-machu-picchu': '/img/navbar/machu-picchu.jpeg',
      'machu-picchu-and-sacred-valley': '/img/navbar/machupicchu.jpeg',

      // Ausangate Tours
      'ausangate-and-rainbow-mountain-trek-3-days':
        '/img/navbar/ausangate-trek.jpeg',
      'Beyond-the-ordinary-trekking-ausangate-rainbow-mountain-and-red-valley-2-days-1-night':
        '/img/navbar/rainbow-montain-&-red-valley.jpg',
      "Eco-friendly-treks-in-Peru's-Andes-Mountains":
        '/img/navbar/ausangate-trek.jpeg',

      // Alternative Tours
      'choquequirao-trek-4-days': '/img/navbar/ausangate-trek.jpeg',
      'inca-quarry-trail-to-machu-picchu': '/img/navbar/inca-trail-post.jpg',
      'humantay-lake': '/img/navbar/salkantay-trek.jpg',
      'Waqrapukara-trek': '/img/navbar/ausangate-trek.jpeg',

      // Peru Packages
      'classic-cusco-4-days': '/img/navbar/cusco.jpeg',
      'cusco-culture-nature-tour-5-days': '/img/navbar/cusco-tours.jpg',
      'package-exploring-the-treasures-cusco': '/img/navbar/cusco.jpeg',

      // Day Tours (Cusco Tours)
      'cusco-city-tour': '/img/navbar/cusco.jpeg',
      'atv-tour-cusco': '/img/navbar/cusco-tours.jpg',
      'tour-inti-raymi-full-day': '/img/navbar/cusco.jpeg',
      'quelccaya-glacier': '/img/navbar/ausangate-trek.jpeg',
      'tres-cruces-de-oro': '/img/navbar/ausangate-trek.jpeg',

      // Rainbow Mountain
      'rainbow-mountain-peru-and-red-valley':
        '/img/navbar/rainbow-montain-&-red-valley.jpg',
      'pallay-punchu-day-hike': '/img/navbar/raimbow-mountain.jpg',
      'rainbow-mountain': '/img/navbar/rainbow-montain-&-red-valley.jpg',

      // Inca Jungle
      'inca-jungle-trek-to-machu-picchu': '/img/navbar/inca-jungle.jpg',
      'inca-jungle-adventure': '/img/navbar/inca-jungle.jpg',
    };

    // Si existe una imagen específica para el slug, la devolvemos (con cache busting)
    if (serviceSlug && serviceImageMap[serviceSlug]) {
      return getImageUrl(serviceImageMap[serviceSlug]);
    }

    // Usar la categoría real (de BD) si está disponible, sino usar la categoría pasada como parámetro
    const categoryToUse = realCategory || category;

    // Imagen por defecto de la categoría usando imágenes disponibles (con cache busting)
    switch (categoryToUse) {
      case 'inca-trail':
        return getImageUrl('/img/navbar/inca-trail-post.jpg');
      case 'salkantay':
        return getImageUrl('/img/navbar/salkantay-trek.jpg');
      case 'machupicchu':
        return getImageUrl('/img/navbar/machu-picchu.jpeg');
      case 'ausangate':
        return getImageUrl('/img/navbar/ausangate-trek.jpeg');
      case 'peru-packages':
        return getImageUrl('/img/navbar/cusco-tours.jpg');
      case 'day-tours':
        return getImageUrl('/img/navbar/cusco.jpeg');
      case 'rainbow-mountain':
        return getImageUrl('/img/navbar/rainbow-montain-&-red-valley.jpg');
      case 'inca-jungle':
        return getImageUrl('/img/navbar/inca-jungle.jpg');
      case 'choquequirao':
        return getImageUrl('/img/navbar/ausangate-trek.jpeg'); // Temporal hasta tener imagen específica
      case 'sacred-lakes':
        return getImageUrl('/img/navbar/salkantay-trek.jpg'); // Imagen de lago/montaña
      case 'luxury-glamping':
        return getImageUrl('/img/navbar/inca-trail-post.jpg'); // Temporal
      case 'family-tours':
        return getImageUrl('/img/navbar/machu-picchu.jpeg'); // Temporal
      case 'sustainable-tours':
        return getImageUrl('/img/navbar/cusco-tours.jpg'); // Temporal
      default:
        return getImageUrl('/img/navbar/inca-trail-post.jpg');
    }
  };

  // Estado para el progreso de scroll (0-100)
  const [scrollProgress, setScrollProgress] = useState(0);

  const changeNavbar = () => {
    // Cambio de navbar basado en scroll
    if (window.scrollY >= 100) {
      setNavchange(true);
    } else {
      setNavchange(false);
    }

    // Calcular progreso de scroll para la barra de progreso
    const windowHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    setScrollProgress(Math.min(scrolled, 100));
  };

  useEffect(() => {
    window.addEventListener('scroll', changeNavbar);
    // Ejecutar una vez al cargar
    changeNavbar();
    return () => {
      window.removeEventListener('scroll', changeNavbar);
    };
  }, []);

  const [isShowing, setIsShowing] = useState();
  const toggle = () => {
    setIsShowing(!isShowing);
  };
  const [isShowing1, setIsShowing1] = useState();
  const toggle1 = () => {
    setIsShowing1(!isShowing1);
  };
  const [isShowing2, setIsShowing2] = useState();
  const toggle2 = () => {
    setIsShowing2(!isShowing2);
  };
  const [isShowing3, setIsShowing3] = useState();
  const toggle3 = () => {
    setIsShowing3(!isShowing3);
  };
  const [isShowing4, setIsShowing4] = useState();
  const toggle4 = () => {
    setIsShowing4(!isShowing4);
  };
  const [isShowing5, setIsShowing5] = useState();
  const toggle5 = () => {
    setIsShowing5(!isShowing5);
  };
  const [isShowing6, setIsShowing6] = useState();
  const toggle6 = () => {
    setIsShowing6(!isShowing6);
  };
  const [isShowing7, setIsShowing7] = useState();
  const toggle7 = () => {
    setIsShowing7(!isShowing7);
  };

  const capitalizeWords = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <nav className='fixed w-full z-50'>
      {/* Navbar para móvil */}
      {isSmallScreen && (
        <div
          id='navbarMobile'
          className='flex items-center justify-between bg-primary py-3 px-3'>
          <Link href='/' onClick={() => setGender(false)}>
            <CachedImage
              src='/assets/logo-Booking.svg'
              alt={BRAND.logo.alt}
              className='h-10 w-auto transform origin-center scale-[1.15]'
            />
          </Link>
          <ul className='flex gap-2 xs:gap-4'>
            <li className='flex m-0 p-0 items-center justify-center'>
              <button
                onClick={() => changeLanguage('en')}
                className='p-0 bg-transparent border-none cursor-pointer'
                aria-label='English'
                aria-pressed={router.locale === 'en'}>
                <USFlag
                  className={`language-flag ${router.locale === 'en' ? 'active' : ''}`}
                />
              </button>
            </li>

            <li className='flex m-0 p-0 items-center justify-center'>
              <button
                onClick={() => changeLanguage('es')}
                className='p-0 bg-transparent border-none cursor-pointer'
                aria-label='Español'
                aria-pressed={router.locale === 'es'}>
                <ESFlag
                  className={`language-flag ${router.locale === 'es' ? 'active' : ''}`}
                />
              </button>
            </li>

            <li className='flex m-0 p-0 items-center justify-center'>
              <button
                id='btn'
                onClick={() => setGender(!gender)}
                aria-label='Toggle Menu'
                className='relative p-2 rounded-lg transition-all duration-300 hover:bg-secondary/20 active:scale-95 group'>
                <svg
                  width='28px'
                  height='20px'
                  viewBox='0 0 53 49'
                  className='transition-transform duration-300 group-hover:scale-110'>
                  <g
                    id='Page-1'
                    stroke='none'
                    strokeWidth='1'
                    fill='none'
                    fillRule='evenodd'
                    strokeLinecap='round'>
                    <g
                      id='Group'
                      transform='translate(1.000000, 1.000000)'
                      stroke='#e6c200'
                      strokeWidth='3'
                      className='transition-all duration-300'>
                      <line
                        x1='0.5'
                        y1='0.5'
                        x2='50.5'
                        y2='0.5'
                        id='Line'
                        className='group-hover:stroke-[4]'></line>
                      <line
                        x1='0.5'
                        y1='23.5'
                        x2='44.5'
                        y2='23.5'
                        id='Line'
                        className='group-hover:stroke-[4]'></line>
                      <line
                        x1='0.5'
                        y1='46.5'
                        x2='50.5'
                        y2='46.5'
                        id='Line'
                        className='group-hover:stroke-[4]'></line>
                    </g>
                  </g>
                </svg>
              </button>
            </li>
          </ul>
        </div>
      )}
      {/* Navbar para desktop */}
      {!isSmallScreen && (
        <div
          className={
            navChange
              ? 'bg-primary/98 backdrop-blur-md w-full print:hidden lg:block hidden navbar-scrolled'
              : 'bg-primary w-full print:hidden lg:block hidden'
          }>
          {/* Barra de progreso de scroll - Solo visible al hacer scroll */}
          {navChange && (
            <div className='scroll-progress-container'>
              <div
                className='scroll-progress-bar'
                style={{ width: `${scrollProgress}%` }}
              />
            </div>
          )}

          {/* Header compacto cuando hay scroll - Muestra logo, acciones rápidas y CTA */}
          {navChange && (
            <div className='navbar-compact-header'>
              <div className='compact-header-content'>
                {/* Logo compacto */}
                <Link href='/' className='compact-logo'>
                  <CachedImage
                    src='/assets/logo-Booking.svg'
                    alt={BRAND.logo.alt}
                    className='h-9 w-auto'
                  />
                </Link>

                {/* Acciones rápidas de contacto */}
                <div className='compact-quick-actions'>
                  {BRAND.contactPhone && (
                    <Link
                      href={`tel:${BRAND.contactPhone}`}
                      className='compact-action-btn phone'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        fill='currentColor'>
                        <path
                          fillRule='evenodd'
                          d='M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </Link>
                  )}
                  {BRAND.whatsapp && (
                    <Link
                      href={`https://wa.me/${BRAND.whatsapp?.replace(/\D/g, '')}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='compact-action-btn whatsapp'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        fill='currentColor'>
                        <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z' />
                      </svg>
                    </Link>
                  )}
                  <Link
                    href={`mailto:${BRAND.contactEmail}`}
                    className='compact-action-btn email'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='currentColor'>
                      <path d='M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z' />
                      <path d='M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z' />
                    </svg>
                  </Link>
                </div>

                {/* Selector de idioma compacto */}
                <div className='compact-language-selector'>
                  <button
                    onClick={() => changeLanguage('en')}
                    className={`compact-lang-btn ${router.locale === 'en' ? 'active' : ''}`}
                    aria-label='English'>
                    <USFlag className='language-flag-mini' />
                  </button>
                  <button
                    onClick={() => changeLanguage('es')}
                    className={`compact-lang-btn ${router.locale === 'es' ? 'active' : ''}`}
                    aria-label='Español'>
                    <ESFlag className='language-flag-mini' />
                  </button>
                </div>

                {/* CTA compacto */}
                <Link href='/contact' className='compact-cta-btn'>
                  {t.enquire}
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                    className='compact-cta-arrow'>
                    <path
                      fillRule='evenodd'
                      d='M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z'
                      clipRule='evenodd'
                    />
                  </svg>
                </Link>
              </div>
            </div>
          )}

          <div
            className={
              navChange
                ? 'lg:hidden hidden'
                : '2xl:container 2xl:mx-auto xl:mx-12 mx-3 nav-topbar'
            }>
            {/* Top Bar - Una sola fila con distribución optimizada */}
            <div className='header-topbar-row'>
              {/* Columna Izquierda: Logo con slogan */}
              <div className='header-logo-section py-2'>
                <Link
                  href='/'
                  aria-label='Inicio'
                  className='flex flex-col items-start'>
                  <CachedImage
                    src='/assets/logo-Booking.svg'
                    alt={BRAND.logo.alt}
                    className='h-8 xl:h-10 3xl:h-12  w-auto transform origin-center'
                  />
                  <span className='brand-slogan'>
                    {t.slogan || 'Your adventure starts here'}
                  </span>
                </Link>
              </div>

              {/* Columna Centro: Información de contacto */}
              <div className='header-contact-section'>
                {BRAND.contactPhone ? (
                  <Link
                    href={`tel:${BRAND.contactPhone}`}
                    className='contact-info-item'>
                    <span className='contact-icon-wrapper'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        fill='currentColor'>
                        <path
                          fillRule='evenodd'
                          d='M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </span>
                    <span className='contact-text'>{BRAND.contactPhone}</span>
                  </Link>
                ) : null}

                <div className='contact-divider'></div>

                {BRAND.contactEmail ? (
                  <Link
                    href={`mailto:${BRAND.contactEmail}`}
                    className='contact-info-item'>
                    <span className='contact-icon-wrapper'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        fill='currentColor'>
                        <path d='M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z' />
                        <path d='M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z' />
                      </svg>
                    </span>
                    <span className='contact-text'>{BRAND.contactEmail}</span>
                  </Link>
                ) : null}
              </div>

              {/* Columna Derecha: Idiomas + Links + Redes + CTAs */}
              <div className='header-actions-section'>
                {/* Selector de idioma */}
                <div className='language-selector'>
                  <button
                    onClick={() => changeLanguage('en')}
                    className='lang-btn'
                    aria-label='English'
                    aria-pressed={router.locale === 'en'}>
                    <USFlag
                      className={`language-flag ${router.locale === 'en' ? 'active' : ''}`}
                    />
                    <span className='lang-label'>EN</span>
                  </button>
                  <button
                    onClick={() => changeLanguage('es')}
                    className='lang-btn'
                    aria-label='Español'
                    aria-pressed={router.locale === 'es'}>
                    <ESFlag
                      className={`language-flag ${router.locale === 'es' ? 'active' : ''}`}
                    />
                    <span className='lang-label'>ES</span>
                  </button>
                </div>

                <div className='header-divider'></div>

                {/* Links secundarios */}
                <div className='secondary-nav-links'>
                  <Link
                    href={blogUrl}
                    target='_blank'
                    className='nav-link-item'>
                    Blog
                  </Link>
                  <Link href='/about-us' className='nav-link-item'>
                    {t.about}
                  </Link>
                  <Link
                    href='https://www.tripadvisor.com.pe/Attraction_Review-g294314-d12614123-Reviews-Life_Expeditions-Cusco_Cusco_Region.html'
                    target='_blank'
                    className='nav-link-item'>
                    {t.review}
                  </Link>
                </div>

                <div className='header-divider'></div>

                {/* Bloque CTA con redes sociales arriba */}
                <div className='cta-social-stack'>
                  {/* Redes sociales horizontal arriba */}
                  <div className='social-icons-top '>
                    {BRAND.social?.facebook && (
                      <Link
                        href={BRAND.social.facebook}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='social-icon-mini'
                        aria-label='Facebook'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 24 24'
                          fill='currentColor'>
                          <path d='M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z' />
                        </svg>
                      </Link>
                    )}
                    {BRAND.social?.instagram && (
                      <Link
                        href={BRAND.social.instagram}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='social-icon-mini'
                        aria-label='Instagram'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 24 24'
                          fill='currentColor'>
                          <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' />
                        </svg>
                      </Link>
                    )}
                    {BRAND.social?.tiktok && (
                      <Link
                        href={BRAND.social.tiktok}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='social-icon-mini'
                        aria-label='TikTok'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 24 24'
                          fill='currentColor'>
                          <path d='M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z' />
                        </svg>
                      </Link>
                    )}
                    {BRAND.social?.youtube && (
                      <Link
                        href={BRAND.social.youtube}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='social-icon-mini'
                        aria-label='YouTube'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 24 24'
                          fill='currentColor'>
                          <path d='M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' />
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>
                <div className='header-divider'></div>
                {/* Botones CTA abajo */}
                <div className='cta-buttons-group'>
                  <Link href='/contact' className='cta-btn-primary'>
                    {t.enquire}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {!isSmallScreen && (
            <div
              id='navbarDesktop'
              className=' border-t border-stone-700/30 relative'>
              <div className='px-12 w-full'>
                {/* Navbar dinámico con scroll - muestra 7 categorías, scroll para ver las demás */}

                <div className='w-full flex items-center justify-around py-2'>
                  {/* Generación dinámica de todas las categorías */}
                  {navbarCategories.map((category) => (
                    <li key={category.slug} className='shrink-0'>
                      <div
                        className={`groups group px-3 xl:px-4 py-2 custom-hover-wrapper-activator ${openCategory === category.slug ? 'is-open' : ''}`}
                        onMouseEnter={() =>
                          handleCategoryMouseEnter(category.slug)
                        }
                        onMouseLeave={handleCategoryMouseLeave}>
                        <Link
                          href={`/${category.slug}`}
                          className='flex items-center custom-hover-wrapper cursor-pointer nav-item-with-dropdown'>
                          <span className='text-white text-xs xl:text-sm 2xl:text-base hover:text-stone-200 transition-colors duration-300 whitespace-nowrap'>
                            {category.label}
                          </span>
                          <svg
                            className='dropdown-indicator ml-1 text-stone-300 group-hover:text-primary transition-colors duration-300'
                            fill='currentColor'
                            viewBox='0 0 20 20'>
                            <path
                              fillRule='evenodd'
                              d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                              clipRule='evenodd'
                            />
                          </svg>
                          <span className='custom-hover-underline'></span>
                        </Link>

                        <div
                          className='absolute mega-menu-container'
                          onMouseEnter={handleMegaMenuMouseEnter}
                          onMouseLeave={handleMegaMenuMouseLeave}>
                          <div className='mega-menu-grid'>
                            {/* Services List - Left Column */}
                            <div className='mega-menu-services'>
                              <div className='mega-menu-services-header'>
                                <h3 className='mega-menu-category-title'>
                                  {category.subtitle}
                                </h3>
                                <div className='mega-menu-divider'></div>
                              </div>
                              <ul className='mega-menu-services-list'>
                                {category.data.map((item, i) => (
                                  <li
                                    key={i}
                                    className={`mega-menu-service-item ${hoveredService === item.slug ? 'active' : ''}`}
                                    onMouseEnter={() =>
                                      handleServiceHover(item.slug)
                                    }>
                                    <Link
                                      href={`/${item.category}/${item.slug}`}
                                      className='mega-menu-service-link'>
                                      <span className='mega-menu-service-bullet'></span>
                                      <span className='mega-menu-service-title'>
                                        {capitalizeWords(item.title)}
                                      </span>
                                      <svg
                                        className='mega-menu-service-arrow'
                                        viewBox='0 0 24 24'
                                        fill='none'
                                        stroke='currentColor'
                                        strokeWidth='2'>
                                        <path d='M5 12h14M12 5l7 7-7 7' />
                                      </svg>
                                    </Link>
                                  </li>
                                ))}
                                {category.data.length === 0 && (
                                  <li className='mega-menu-empty'>
                                    {locale === 'en'
                                      ? 'Coming soon...'
                                      : 'Próximamente...'}
                                  </li>
                                )}
                              </ul>
                            </div>

                            {/* Description - Center Column */}
                            <div className='mega-menu-description'>
                              <div className='mega-menu-description-content'>
                                <div className='mega-menu-description-label'>
                                  Descripción
                                </div>
                                <div className='mega-menu-description-text'>
                                  {parser(
                                    getServiceDescription(
                                      category.slug,
                                      hoveredService,
                                    ),
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Image - Right Column */}
                            <div className='mega-menu-image'>
                              <div className='mega-menu-image-wrapper'>
                                <div className='mega-menu-image-overlay'></div>
                                <LazyLoadImage
                                  src={getServiceImage(
                                    category.slug,
                                    hoveredService,
                                  )}
                                  alt={`${category.label} tours`}
                                  className='mega-menu-image-element'
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <div
        className={
          gender
            ? 'bottom-0 fixed lg:w-96 w-full sm:w-80 z-50 top-0 left-0 shadow-2xl overflow-y-auto'
            : 'z-50 bottom-0 fixed top-0 -left-[150%] shadow-2xl overflow-y-auto'
        }
        style={{
          background:
            'linear-gradient(180deg, #0d1117 0%, #1a1f2e 50%, #0d1117 100%)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
        {/* Header del panel con gradiente azul */}
        <ul
          className='flex justify-between items-center px-4 py-5 border-b-2'
          style={{
            background:
              'linear-gradient(135deg, rgba(72, 114, 148, 0.25) 0%, rgba(72, 114, 148, 0.15) 100%)',
            borderColor: '#487294',
            backdropFilter: 'blur(10px)',
          }}>
          {isSmallScreen ? (
            <li>
              <Link
                href='/'
                onClick={() => setGender(false)}
                aria-label='Inicio'>
                <CachedImage
                  src='/assets/logo-Booking.svg'
                  alt={BRAND.logo.alt}
                  className='h-14 w-auto'
                />
              </Link>
            </li>
          ) : null}
          <li className='flex items-center justify-center gap-2'>
            <Link
              href={`tel:${BRAND.contactPhone}`}
              aria-label='Phone number'
              className='p-2 rounded-lg hover:bg-secondary/20 transition-all duration-300 group relative'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'
                className='size-6 text-secondary group-hover:scale-110 transition-transform duration-300'>
                <path
                  fillRule='evenodd'
                  d='M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z'
                  clipRule='evenodd'
                />
              </svg>
            </Link>

            <Link
              href={`https://api.whatsapp.com/send?phone=${BRAND.contactPhone}&text=information%tours`}
              aria-label='Whatsapp'
              className='p-1 rounded-lg relative group'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='40'
                height='40'
                viewBox='0 0 93 92'
                fill='none'
                className='text-transparent size-10'>
                <rect
                  x='15.10067'
                  y='14.0867'
                  rx='50'
                  fill='currentColor'
                  className='group-hover:fill-[#ffd700] transition-colors duration-300'
                />
                <path
                  d='M23.5068 66.8405L26.7915 54.6381C24.1425 49.8847 23.3009 44.3378 24.4211 39.0154C25.5413 33.693 28.5482 28.952 32.89 25.6624C37.2319 22.3729 42.6173 20.7554 48.0583 21.1068C53.4992 21.4582 58.6306 23.755 62.5108 27.5756C66.3911 31.3962 68.7599 36.4844 69.1826 41.9065C69.6053 47.3286 68.0535 52.7208 64.812 57.0938C61.5705 61.4668 56.8568 64.5271 51.5357 65.7133C46.2146 66.8994 40.6432 66.1318 35.8438 63.5513L23.5068 66.8405ZM36.4386 58.985L37.2016 59.4365C40.6779 61.4918 44.7382 62.3423 48.7498 61.8555C52.7613 61.3687 56.4987 59.5719 59.3796 56.7452C62.2605 53.9185 64.123 50.2206 64.6769 46.2279C65.2308 42.2351 64.445 38.1717 62.4419 34.6709C60.4388 31.1701 57.331 28.4285 53.6027 26.8734C49.8745 25.3184 45.7352 25.0372 41.8299 26.0736C37.9247 27.11 34.4729 29.4059 32.0124 32.6035C29.5519 35.801 28.2209 39.7206 28.2269 43.7514C28.2237 47.0937 29.1503 50.3712 30.9038 53.2192L31.3823 54.0061L29.546 60.8167L36.4386 58.985Z'
                  fill='#ffd700'
                />
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M54.9566 46.8847C54.5093 46.5249 53.9856 46.2716 53.4254 46.1442C52.8651 46.0168 52.2831 46.0186 51.7236 46.1495C50.8831 46.4977 50.3399 47.8134 49.7968 48.4713C49.6823 48.629 49.514 48.7396 49.3235 48.7823C49.133 48.8251 48.9335 48.797 48.7623 48.7034C45.6849 47.5012 43.1055 45.2965 41.4429 42.4475C41.3011 42.2697 41.2339 42.044 41.2557 41.8178C41.2774 41.5916 41.3862 41.3827 41.5593 41.235C42.165 40.6368 42.6098 39.8959 42.8524 39.0809C42.9063 38.1818 42.6998 37.2863 42.2576 36.5011C41.9157 35.4002 41.265 34.42 40.3825 33.6762C39.9273 33.472 39.4225 33.4036 38.9292 33.4791C38.4359 33.5546 37.975 33.7709 37.6021 34.1019C36.9548 34.6589 36.4411 35.3537 36.0987 36.135C35.7562 36.9163 35.5939 37.7643 35.6236 38.6165C35.6256 39.0951 35.6864 39.5716 35.8046 40.0354C36.1049 41.1497 36.5667 42.2144 37.1754 43.1956C37.6145 43.9473 38.0937 44.6749 38.6108 45.3755C40.2914 47.6767 42.4038 49.6305 44.831 51.1284C46.049 51.8897 47.3507 52.5086 48.7105 52.973C50.1231 53.6117 51.6827 53.8568 53.2237 53.6824C54.1018 53.5499 54.9337 53.2041 55.6462 52.6755C56.3588 52.1469 56.9302 51.4518 57.3102 50.6512C57.5334 50.1675 57.6012 49.6269 57.5042 49.1033C57.2714 48.0327 55.836 47.4007 54.9566 46.8847Z'
                  fill='#ffd700'
                />
              </svg>
            </Link>
          </li>
          <li className='flex items-center justify-center'>
            <button
              id='btn2'
              onClick={() => setGender(!gender)}
              aria-label='Close menu'
              className='relative p-2 rounded-full bg-secondary/90 border-2 border-secondary transition-all duration-300 hover:bg-secondary hover:shadow-lg hover:shadow-secondary/50 active:scale-90 group'>
              <svg
                width='22px'
                height='22px'
                viewBox='0 0 22 22'
                version='1.1'
                className='transition-transform duration-300 group-hover:rotate-90'>
                <g
                  id='Page-1'
                  stroke='none'
                  strokeWidth='1'
                  fill='none'
                  fillRule='evenodd'
                  strokeLinecap='round'>
                  <g
                    id='Group-2'
                    transform='translate(1.000000, 1.000000)'
                    stroke='#0d1117'
                    strokeWidth='2.5'
                    className='transition-all duration-300'>
                    <line
                      x1='0.5'
                      y1='19.5'
                      x2='19.5'
                      y2='0.5'
                      id='Line-2'></line>
                    <line
                      x1='19.5'
                      y1='19.5'
                      x2='0.5'
                      y2='0.5'
                      id='Line-3'></line>
                  </g>
                </g>
              </svg>
            </button>
          </li>
        </ul>

        {/* Separador decorativo con título */}
        <div className='px-4 pt-6 pb-2'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='flex-1 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent'></div>
            <div
              className='flex items-center gap-2 px-3 py-1.5 rounded-lg'
              style={{
                background:
                  'linear-gradient(135deg, rgba(230, 194, 0, 0.15) 0%, rgba(230, 194, 0, 0.05) 100%)',
                border: '1px solid rgba(230, 194, 0, 0.3)',
              }}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='2'
                stroke='currentColor'
                className='w-4 h-4 text-secondary'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z'
                />
              </svg>
              <span className='text-xs font-bold text-secondary uppercase tracking-wider'>
                Tours
              </span>
            </div>
            <div className='flex-1 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent'></div>
          </div>
        </div>

        {/* Contenido del menú con mejor espaciado */}
        <ul className='px-4 pb-6 space-y-1 text-base font-medium'>
          <li className='accordion mb-2'>
            <Link
              href='#'
              onClick={toggle}
              className={
                isShowing
                  ? 'py-3 px-4 flex text-white rounded-xl shadow-lg justify-between items-center transition-all duration-300 border-2 border-secondary'
                  : 'py-3 px-4 flex justify-between items-center rounded-xl transition-all duration-300 hover:bg-white/5 border-2 border-transparent hover:border-secondary/30 text-white/90 hover:text-white'
              }
              style={
                isShowing
                  ? {
                      background:
                        'linear-gradient(135deg, rgba(230, 194, 0, 0.2) 0%, rgba(230, 194, 0, 0.1) 100%)',
                    }
                  : {}
              }>
              <span className='font-bold text-sm uppercase tracking-wide'>
                {t.inca_trail}
              </span>
              {isShowing ? (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='2.5'
                  stroke='currentColor'
                  className='h-5 w-5 transition-transform duration-300 text-secondary'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='m4.5 15.75 7.5-7.5 7.5 7.5'
                  />
                </svg>
              ) : (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='2.5'
                  stroke='currentColor'
                  className='h-5 w-5 transition-transform duration-300 text-white/60'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='m19.5 8.25-7.5 7.5-7.5-7.5'
                  />
                </svg>
              )}
            </Link>
            <ul className={isShowing ? 'block mt-2 space-y-1' : 'hidden'}>
              {incaTrail.map((item, i) => (
                <li className='flex' key={i}>
                  <Link
                    href={`/${item.category}/${item.slug}`}
                    onClick={() => setGender(!gender)}
                    className='py-2.5 pr-4 text-sm text-white/70 w-full rounded-md flex items-center group'>
                    <span className='w-2 h-2 rounded-full bg-secondary mx-2'></span>
                    {capitalizeWords(item.title)}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li className='accordion mb-2'>
            <Link
              href='#'
              onClick={toggle1}
              className={
                isShowing1
                  ? 'py-3 px-4 flex text-white rounded-xl shadow-lg justify-between items-center transition-all duration-300 border-2 border-secondary'
                  : 'py-3 px-4 flex justify-between items-center rounded-xl transition-all duration-300 hover:bg-white/5 border-2 border-transparent hover:border-secondary/30 text-white/90 hover:text-white'
              }
              style={
                isShowing1
                  ? {
                      background:
                        'linear-gradient(135deg, rgba(230, 194, 0, 0.2) 0%, rgba(230, 194, 0, 0.1) 100%)',
                    }
                  : {}
              }>
              <span className='font-semibold'>{t.salkantay}</span>
              {isShowing1 ? (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='2'
                  stroke='currentColor'
                  className='h-5 w-5 transition-transform duration-300 text-secondary'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='m4.5 15.75 7.5-7.5 7.5 7.5'
                  />
                </svg>
              ) : (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='2'
                  stroke='currentColor'
                  className='h-5 w-5 transition-transform duration-300 text-white/60'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='m19.5 8.25-7.5 7.5-7.5-7.5'
                  />
                </svg>
              )}
            </Link>
            <ul className={isShowing1 ? 'block mt-2 space-y-1' : 'hidden'}>
              {salkantay.map((item, i) => (
                <li className='flex' key={i}>
                  <Link
                    href={`/${item.category}/${item.slug}`}
                    onClick={() => setGender(!gender)}
                    className='py-2.5 pr-4 text-sm text-white/70 w-full rounded-md flex items-center group'>
                    <span className='w-2 h-2 rounded-full bg-secondary mx-2'></span>
                    {capitalizeWords(item.title)}
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          <li className='accordion mb-2'>
            <Link
              href='#'
              onClick={toggle2}
              className={
                isShowing2
                  ? 'py-3 px-4 flex text-white rounded-xl shadow-lg justify-between items-center transition-all duration-300 border-2 border-secondary'
                  : 'py-3 px-4 flex justify-between items-center rounded-xl transition-all duration-300 hover:bg-white/5 border-2 border-transparent hover:border-secondary/30 text-white/90 hover:text-white'
              }
              style={
                isShowing2
                  ? {
                      background:
                        'linear-gradient(135deg, rgba(230, 194, 0, 0.2) 0%, rgba(230, 194, 0, 0.1) 100%)',
                    }
                  : {}
              }>
              <span className='font-semibold'>{t.ausangate}</span>
              {isShowing2 ? (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='2'
                  stroke='currentColor'
                  className='h-5 w-5 transition-transform duration-300 text-secondary'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='m4.5 15.75 7.5-7.5 7.5 7.5'
                  />
                </svg>
              ) : (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='2'
                  stroke='currentColor'
                  className='h-5 w-5 transition-transform duration-300 text-white/60'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='m19.5 8.25-7.5 7.5-7.5-7.5'
                  />
                </svg>
              )}
            </Link>
            <ul className={isShowing2 ? 'block mt-2 space-y-1' : 'hidden'}>
              {ausangate.map((item, i) => (
                <li className='flex' key={i}>
                  <Link
                    href={`/${item.category}/${item.slug}`}
                    onClick={() => setGender(!gender)}
                    className='py-2.5 pr-4 text-sm text-white/70 w-full rounded-md flex items-center group'>
                    <span className='w-2 h-2 rounded-full bg-secondary mx-2'></span>
                    {capitalizeWords(item.title)}
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          <li className='accordion mb-2'>
            <Link
              href='#'
              onClick={toggle4}
              className={
                isShowing4
                  ? 'py-3 px-4 flex text-white rounded-xl shadow-lg justify-between items-center transition-all duration-300 border-2 border-secondary'
                  : 'py-3 px-4 flex justify-between items-center rounded-xl transition-all duration-300 hover:bg-white/5 border-2 border-transparent hover:border-secondary/30 text-white/90 hover:text-white'
              }
              style={
                isShowing4
                  ? {
                      background:
                        'linear-gradient(135deg, rgba(230, 194, 0, 0.2) 0%, rgba(230, 194, 0, 0.1) 100%)',
                    }
                  : {}
              }>
              <span className='font-semibold'>{t.peru}</span>
              {isShowing4 ? (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='2'
                  stroke='currentColor'
                  className='h-5 w-5 transition-transform duration-300 text-secondary'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='m4.5 15.75 7.5-7.5 7.5 7.5'
                  />
                </svg>
              ) : (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='2'
                  stroke='currentColor'
                  className='h-5 w-5 transition-transform duration-300 text-white/60'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='m19.5 8.25-7.5 7.5-7.5-7.5'
                  />
                </svg>
              )}
            </Link>
            <ul className={isShowing4 ? 'block mt-2 space-y-1' : 'hidden'}>
              {perupackages.map((item, i) => (
                <li className='flex' key={i}>
                  <Link
                    href={`/${item.category}/${item.slug}`}
                    onClick={() => setGender(!gender)}
                    className='py-2.5 pr-4 text-sm text-white/70 w-full rounded-md flex items-center group'>
                    <span className='w-2 h-2 rounded-full bg-secondary mx-2'></span>
                    {capitalizeWords(item.title)}
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          <li className='accordion mb-2'>
            <Link
              href='#'
              onClick={toggle5}
              className={
                isShowing5
                  ? 'py-3 px-4 flex text-white rounded-xl shadow-lg justify-between items-center transition-all duration-300 border-2 border-secondary'
                  : 'py-3 px-4 flex justify-between items-center rounded-xl transition-all duration-300 hover:bg-white/5 border-2 border-transparent hover:border-secondary/30 text-white/90 hover:text-white'
              }
              style={
                isShowing5
                  ? {
                      background:
                        'linear-gradient(135deg, rgba(230, 194, 0, 0.2) 0%, rgba(230, 194, 0, 0.1) 100%)',
                    }
                  : {}
              }>
              <span className='font-semibold'>{t.cusco}</span>
              {isShowing5 ? (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='2'
                  stroke='currentColor'
                  className='h-5 w-5 transition-transform duration-300 text-secondary'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='m4.5 15.75 7.5-7.5 7.5 7.5'
                  />
                </svg>
              ) : (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='2'
                  stroke='currentColor'
                  className='h-5 w-5 transition-transform duration-300 text-white/60'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='m19.5 8.25-7.5 7.5-7.5-7.5'
                  />
                </svg>
              )}
            </Link>
            <ul className={isShowing5 ? 'block mt-2 space-y-1' : 'hidden'}>
              {cuscoTours.map((item, i) => (
                <li className='flex' key={i}>
                  <Link
                    href={`/${item.category}/${item.slug}`}
                    onClick={() => setGender(!gender)}
                    className='py-2.5 pr-4 text-sm text-white/70 w-full rounded-md flex items-center group'>
                    <span className='w-2 h-2 rounded-full bg-secondary mx-2'></span>
                    {capitalizeWords(item.title)}
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          <li className='accordion mb-2'>
            <Link
              href='#'
              onClick={toggle7}
              className={
                isShowing7
                  ? 'py-3 px-4 flex text-white rounded-xl shadow-lg justify-between items-center transition-all duration-300 border-2 border-secondary'
                  : 'py-3 px-4 flex justify-between items-center rounded-xl transition-all duration-300 hover:bg-white/5 border-2 border-transparent hover:border-secondary/30 text-white/90 hover:text-white'
              }
              style={
                isShowing7
                  ? {
                      background:
                        'linear-gradient(135deg, rgba(230, 194, 0, 0.2) 0%, rgba(230, 194, 0, 0.1) 100%)',
                    }
                  : {}
              }>
              <span className='font-semibold'>{t.rainbowmountain}</span>
              {isShowing7 ? (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='2'
                  stroke='currentColor'
                  className='h-5 w-5 transition-transform duration-300 text-secondary'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='m4.5 15.75 7.5-7.5 7.5 7.5'
                  />
                </svg>
              ) : (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='2'
                  stroke='currentColor'
                  className='h-5 w-5 transition-transform duration-300 text-white/60'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='m19.5 8.25-7.5 7.5-7.5-7.5'
                  />
                </svg>
              )}
            </Link>
            <ul className={isShowing7 ? 'block mt-2 space-y-1' : 'hidden'}>
              {raimbow.map((item, i) => (
                <li className='flex' key={i}>
                  <Link
                    href={`/${item.category}/${item.slug}`}
                    onClick={() => setGender(!gender)}
                    className='py-2.5 pr-4 text-sm text-white/70 w-full rounded-md flex items-center group'>
                    <span className='w-2 h-2 rounded-full bg-secondary mx-2'></span>
                    {capitalizeWords(item.title)}
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          <li className='accordion mb-2'>
            <Link
              href='#'
              onClick={toggle6}
              className={
                isShowing6
                  ? 'py-3 px-4 flex text-white rounded-xl shadow-lg justify-between items-center transition-all duration-300 border-2 border-secondary'
                  : 'py-3 px-4 flex justify-between items-center rounded-xl transition-all duration-300 hover:bg-white/5 border-2 border-transparent hover:border-secondary/30 text-white/90 hover:text-white'
              }
              style={
                isShowing6
                  ? {
                      background:
                        'linear-gradient(135deg, rgba(230, 194, 0, 0.2) 0%, rgba(230, 194, 0, 0.1) 100%)',
                    }
                  : {}
              }>
              <span className='font-semibold'>{t.incajungle}</span>
              {isShowing6 ? (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='2'
                  stroke='currentColor'
                  className='h-5 w-5 transition-transform duration-300 text-secondary'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='m4.5 15.75 7.5-7.5 7.5 7.5'
                  />
                </svg>
              ) : (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='2'
                  stroke='currentColor'
                  className='h-5 w-5 transition-transform duration-300 text-white/60'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='m19.5 8.25-7.5 7.5-7.5-7.5'
                  />
                </svg>
              )}
            </Link>

            <div className={isShowing6 ? 'block mt-2 space-y-3' : 'hidden'}>
              <ul className='space-y-1'>
                {incaJungle.map((item, i) => (
                  <li className='flex' key={i}>
                    <Link
                      href={`/${item.category}/${item.slug}`}
                      onClick={() => setGender(!gender)}
                      className='py-2.5 pr-4 text-sm text-white/70 w-full rounded-md flex items-center group'>
                      <span className='w-2 h-2 rounded-full bg-secondary mx-2'></span>
                      {capitalizeWords(item.title)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>

          {/* Separador decorativo antes de links */}
          <li className='my-6'>
            <div className='flex items-center gap-3'>
              <div className='flex-1 h-px bg-gradient-to-r from-transparent via-blue/30 to-transparent'></div>
              <div className='w-2 h-2 rounded-full bg-secondary animate-pulse'></div>
              <div className='flex-1 h-px bg-gradient-to-r from-transparent via-blue/30 to-transparent'></div>
            </div>
          </li>

          <li className='mb-2'>
            <Link
              href='/travel-deals'
              onClick={() => setGender(!gender)}
              className='py-3 px-4 flex items-center rounded-xl transition-all duration-300 hover:bg-white/10 border-2 border-transparent hover:border-primary/50 text-white/90 hover:text-white font-semibold uppercase text-sm group'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='2'
                stroke='currentColor'
                className='w-5 h-5 mr-3 text-white/60 group-hover:text-primary transition-colors duration-200'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M6 6h.008v.008H6V6z'
                />
              </svg>
              {t.deals}
            </Link>
          </li>
          <li className='mb-2'>
            <Link
              href={blogUrl}
              onClick={() => setGender(!gender)}
              className='py-3 px-4 flex items-center rounded-xl transition-all duration-300 hover:bg-white/10 border-2 border-transparent hover:border-primary/50 text-white/90 hover:text-white font-semibold uppercase text-sm group'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='2'
                stroke='currentColor'
                className='w-5 h-5 mr-3 text-white/60 group-hover:text-primary transition-colors duration-200'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z'
                />
              </svg>
              Blog
            </Link>
          </li>
          <li className='mb-2'>
            <Link
              href='/about-us'
              onClick={() => setGender(!gender)}
              className='py-3 px-4 flex items-center rounded-xl transition-all duration-300 hover:bg-white/10 border-2 border-transparent hover:border-primary/50 text-white/90 hover:text-white font-semibold uppercase text-sm group'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='2'
                stroke='currentColor'
                className='w-5 h-5 mr-3 text-white/60 group-hover:text-primary transition-colors duration-200'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z'
                />
              </svg>
              {t.about}
            </Link>
          </li>
          <li className='mb-2'>
            <Link
              href='/contact'
              onClick={() => setGender(!gender)}
              className='py-3 px-4 flex items-center rounded-xl transition-all duration-300 hover:bg-white/10 border-2 border-transparent hover:border-primary/50 text-white/90 hover:text-white font-semibold uppercase text-sm group'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='2'
                stroke='currentColor'
                className='w-5 h-5 mr-3 text-white/60 group-hover:text-primary transition-colors duration-200'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75'
                />
              </svg>
              {t.contact}
            </Link>
          </li>
          <li className='mb-4 mt-6'>
            <div
              className='mx-4 px-5 py-4 rounded-xl border-2'
              style={{
                background:
                  'linear-gradient(135deg, rgba(230, 194, 0, 0.08) 0%, rgba(230, 194, 0, 0.03) 100%)',
                borderColor: 'rgba(230, 194, 0, 0.3)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              }}>
              <p className='text-secondary font-bold text-sm mb-4 uppercase tracking-wider text-center flex items-center justify-center gap-2'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='2'
                  stroke='currentColor'
                  className='w-5 h-5'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802'
                  />
                </svg>
                {t.languages}
              </p>
              <div className='flex gap-4 justify-center items-center'>
                <button
                  onClick={() => changeLanguage('en')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 ${router.locale === 'en' ? 'bg-secondary shadow-lg shadow-secondary/50 scale-105' : 'bg-white/10 hover:bg-white/20 hover:shadow-md'} `}
                  aria-pressed={router.locale === 'en'}
                  aria-label='Switch to English'>
                  <USFlag
                    className={`language-flag ${router.locale === 'en' ? 'active' : ''}`}
                  />
                  <span
                    className={`text-xs font-semibold ${router.locale === 'en' ? 'text-primary' : 'text-white'}`}>
                    EN
                  </span>
                </button>

                <button
                  onClick={() => changeLanguage('es')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 ${router.locale === 'es' ? 'bg-secondary shadow-lg shadow-secondary/50 scale-105' : 'bg-white/10 hover:bg-white/20 hover:shadow-md'}`}
                  aria-pressed={router.locale === 'es'}
                  aria-label='Cambiar a Español'>
                  <ESFlag
                    className={`language-flag ${router.locale === 'es' ? 'active' : ''}`}
                  />
                  <span
                    className={`text-xs font-semibold ${router.locale === 'es' ? 'text-primary' : 'text-white'}`}>
                    ES
                  </span>
                </button>
              </div>
            </div>
          </li>
          <li className='h-8' />
        </ul>
        <div
          className='flex justify-center items-center p-4 mt-2 border-t border-secondary/30'
          style={{
            background:
              'linear-gradient(180deg, rgba(250, 246, 233, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
          }}>
          <LazyLoadImage
            src='/img/navbar/trip-best-2024-bga.svg'
            className='h-28 max-h-36 w-auto opacity-80 hover:opacity-100 transition-opacity duration-300'
            alt='Trip Advisor Best 2024'
          />
        </div>
      </div>
    </nav>
  );
}
