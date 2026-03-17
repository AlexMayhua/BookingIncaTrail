import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import parser from 'html-react-parser';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {
  getTripBySlug,
  getCategoriesWithTours,
} from '@/modules/trips/service/trip.service';
import {
  getCategoryTitle,
  getCategoryDescription,
  getCategoryImagePath,
} from '@/utils/categoryHelpers';
import { BRAND, absoluteUrl, getLogoUrlAbsolute } from '@/lib/brandConfig';
import { API_URL } from '@/lib/constants';
import en from '@/lang/en/slug';
import es from '@/lang/es/slug';
import Tabs from '@/components/general/Tabs';
import TravelSectionTitle from '@/components/travel/TravelSectionTitle';
import TravelToursList from '@/components/travel/TravelToursList';
import Calendar from '@/components/Availability';
import TourSlider from '@/components/Slider';

const Section6 = dynamic(() => import('@/components/home/Section6'), {
  loading: () => <div className='min-h-[400px]' />,
  ssr: true,
});
const Section9 = dynamic(() => import('@/components/home/Section9'), {
  loading: () => <div className='min-h-[300px]' />,
  ssr: true,
});
const Section1 = dynamic(() => import('@/components/home/Section1'), {
  loading: () => <div className='min-h-[400px]' />,
  ssr: true,
});
const CategoryFAQs = dynamic(
  () => import('@/components/category/CategoryFAQs'),
  {
    loading: () => <div className='min-h-[300px]' />,
    ssr: true,
  },
);

/* ─── Quick‑stat icon mapping ─── */
const STAT_ICONS = [
  '/assets/icon/type-tour.png',
  '/assets/icon/time.png',
  '/assets/icon/group-zise.png',
  '/assets/icon/dificult.png',
  '/assets/icon/accommodation.png',
  '/assets/icon/languages.png',
];

export default function TourPage({ tour, category, similarTours }) {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'en' ? en : es;

  /* ─── Pricing state ─── */
  const originalPrice = tour?.price || 0;
  const enableDiscount = tour?.enableDiscount || false;
  const ardiscounts = tour?.ardiscounts || [];

  const calculateDiscountedPrice = (numPassengers) => {
    if (!enableDiscount || ardiscounts.length === 0) return originalPrice;
    const applicableDiscount = ardiscounts
      .filter((d) => numPassengers >= d.persons)
      .reduce((max, curr) => (curr.pdiscount > max ? curr.pdiscount : max), 0);
    return originalPrice * (1 - applicableDiscount / 100);
  };

  const calculateInitialValues = () => {
    if (!enableDiscount || ardiscounts.length === 0) {
      return { initialPersons: 1, lowestPrice: originalPrice };
    }
    const sorted = [...ardiscounts].sort((a, b) => b.pdiscount - a.pdiscount);
    const best = sorted[0];
    return {
      initialPersons: best.persons,
      lowestPrice: originalPrice * (1 - best.pdiscount / 100),
    };
  };

  const [count, setCount] = useState(1);
  const [unitPrice, setUnitPrice] = useState(originalPrice);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const { initialPersons, lowestPrice } = calculateInitialValues();
    setCount(initialPersons);
    setUnitPrice(lowestPrice);
    setTotalPrice(lowestPrice * initialPersons);
  }, [tour, enableDiscount, ardiscounts, originalPrice]);

  useEffect(() => {
    const p = calculateDiscountedPrice(count);
    setUnitPrice(p);
    setTotalPrice(p * count);
  }, [count, enableDiscount, ardiscounts, originalPrice]);

  const increment = () => count < 10 && setCount(count + 1);
  const decrement = () => count > 1 && setCount(count - 1);

  /* ─── Availability / Financial ─── */
  const [dataget, setFinancials] = useState({ data: [] });
  const [tourDays, setTourDays] = useState('');

  const fetchFinancial = async () => {
    if (!tour?.slug) return;
    let url = '';
    let days = '';
    switch (tour.slug) {
      case 'classic-inca-trail':
        url = 'https://machupicchuavailability.com/api?idRuta=1&idLugar=2';
        days = 3;
        break;
      case 'short-inca-trail':
        url = 'https://machupicchuavailability.com/api?idRuta=5&idLugar=2';
        days = 1;
        break;
      case 'salkantay-trek-to-machu-picchu':
        url = 'https://machupicchuavailability.com/api?idRuta=3&idLugar=2';
        days = 3;
        break;
      default:
        return;
    }
    setTourDays(days);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(url, {
        signal: controller.signal,
        mode: 'cors',
      });
      clearTimeout(timeoutId);
      if (!response.ok) return;
      const data = await response.json();
      if (data.success) setFinancials(data.data);
    } catch (err) {
      if (err.name !== 'AbortError')
        console.warn('Financial API unavailable:', err.message);
    }
  };

  useEffect(() => {
    setFinancials({ data: [] });
    fetchFinancial();
  }, [tour?.slug]);

  /* ─── Gallery state ─── */
  const [tab, setTab] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  /* ─── Modal state ─── */
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    setIsOpen(false);
  }, [tour?.slug]);

  const handleOpen = () => {
    if (!dataget?.data || dataget.data.length === 0) {
      const url = tour?.wetravel
        ? `https://www.wetravel.com/checkout_embed?uuid=${tour.wetravel}`
        : `https://api.whatsapp.com/send/?phone=51970811976&text=${encodeURIComponent(tour?.title || '')}`;
      if (typeof window !== 'undefined') {
        const newWin = window.open(url, '_blank', 'noopener,noreferrer');
        if (newWin) newWin.focus();
      }
      return;
    }
    setIsOpen(true);
  };
  const handleClose = () => setIsOpen(false);
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) handleClose();
  };

  /* ─── Guards ─── */
  if (!tour) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto' />
          <p className='mt-4 text-gray-600'>
            {locale === 'en'
              ? 'Loading tour content...'
              : 'Cargando contenido del tour...'}
          </p>
        </div>
      </div>
    );
  }

  const categoryTitle = getCategoryTitle(category, locale);
  const heroImage = tour.gallery?.[0]?.url || getCategoryImagePath(category);

  const isActive = (index) => (tab === index ? ' active' : '');

  return (
    <>
      {/* ── SEO ── */}
      <Head>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: BRAND.name,
                url: absoluteUrl(`/${category}/${tour.slug}`),
                logo: getLogoUrlAbsolute(),
                sameAs: [
                  BRAND.social.facebook,
                  BRAND.social.instagram,
                  BRAND.social.tiktok,
                  BRAND.social.youtube,
                ].filter(Boolean),
              },
              {
                '@context': 'https://schema.org',
                '@type': 'TouristAttraction',
                name: tour.title,
                description: tour.meta_description,
                image: tour.gallery?.map((img) => img.url) || [],
                url: absoluteUrl(`/${category}/${tour.slug}`),
                touristType: 'Adventure Travelers',
              },
              {
                '@context': 'https://schema.org',
                '@type': 'Product',
                name: tour.title,
                description: tour.meta_description,
                image: tour.gallery?.[0]?.url || '',
                brand: { '@type': 'Brand', name: BRAND.name },
                offers: {
                  '@type': 'Offer',
                  price: originalPrice.toFixed(2),
                  priceCurrency: 'USD',
                  availability: 'https://schema.org/InStock',
                  url: absoluteUrl(`/${category}/${tour.slug}`),
                  priceValidUntil: new Date(
                    new Date().setFullYear(new Date().getFullYear() + 1),
                  )
                    .toISOString()
                    .split('T')[0],
                },
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: '4.9',
                  reviewCount: '8900',
                  bestRating: '5',
                  worstRating: '1',
                },
              },
              {
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: absoluteUrl('/'),
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: categoryTitle,
                    item: absoluteUrl(`/${category}`),
                  },
                  {
                    '@type': 'ListItem',
                    position: 3,
                    name: tour.title,
                    item: absoluteUrl(`/${category}/${tour.slug}`),
                  },
                ],
              },
            ]),
          }}
        />
      </Head>
      <NextSeo
        title={tour.meta_title || tour.title}
        description={tour.meta_description || tour.sub_title}
        canonical={absoluteUrl(`/${category}/${tour.slug}`)}
        openGraph={{
          url: absoluteUrl(`/${category}/${tour.slug}`),
          title: tour.meta_title || tour.title,
          description: tour.meta_description || tour.sub_title,
          images: tour.gallery?.[0]
            ? [
                {
                  url: tour.gallery[0].url,
                  width: 1600,
                  height: 620,
                  type: `image/${tour.gallery[0].url.split('.').pop().split('?')[0]}`,
                },
              ]
            : [],
        }}
      />
      <section className='relative w-full min-h-[80vh] flex items-center justify-center overflow-visible mb-48 md:mb-36 pb-16'>
        <div
          className='absolute inset-0 bg-cover bg-center bg-no-repeat bg-black/20 z-0 transition-transform duration-300 ease-out'
          style={{
            backgroundImage: heroImage ? `url('${heroImage}')` : 'none',
          }}
        />

        <div className='absolute inset-0 z-[1] bg-black/40' />

        <div className='relative z-10 w-full max-w-[1400px] mx-auto px-6 py-8'>
          <div className='flex flex-col items-start gap-5 max-w-[700px]'>
            <nav className='flex items-center gap-2 mb-2'>
              <Link
                href='/'
                className='flex items-center gap-1.5 text-white/80 no-underline text-[0.8rem] font-medium transition-colors duration-300 hover:text-[#e6c200]'>
                <svg
                  className='w-4 h-4'
                  fill='currentColor'
                  viewBox='0 0 20 20'>
                  <path d='M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z' />
                </svg>
                {locale === 'en' ? 'Home' : 'Inicio'}
              </Link>
              <svg
                className='w-4 h-4 text-white/40'
                fill='currentColor'
                viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                  clipRule='evenodd'
                />
              </svg>
              <Link
                href={`/${category}`}
                className='flex items-center gap-1.5 text-white/80 no-underline text-[0.8rem] font-medium transition-colors duration-300 hover:text-[#e6c200]'>
                {categoryTitle}
              </Link>
              <svg
                className='w-4 h-4 text-white/40'
                fill='currentColor'
                viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                  clipRule='evenodd'
                />
              </svg>
              <span className='text-white text-[0.8rem] font-semibold'>
                {tour.title}
              </span>
            </nav>

            <div className='inline-flex items-center gap-2 px-4 py-2 bg-[rgba(230,194,0,0.15)] backdrop-blur-[10px] border border-[rgba(230,194,0,0.3)] rounded-full text-[#e6c200] text-[0.7rem] font-semibold uppercase tracking-[0.1em]'>
              <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z'
                  clipRule='evenodd'
                />
              </svg>
              {tour.quickstats?.[0]?.content ||
                (locale === 'en' ? 'Tour' : 'Tour')}
            </div>

            <h1
              className='text-[clamp(2.25rem,5vw,4rem)] font-bold text-white leading-[1.15] m-0'
              style={{
                fontFamily: "'Playfair Display', serif",
                textShadow: '0 2px 30px rgba(0,0,0,0.5)',
              }}>
              {tour.title}
            </h1>

            {tour.sub_title && (
              <p
                className='text-[clamp(0.95rem,2vw,1.15rem)] font-normal text-white/90 leading-[1.7] m-0 max-w-[600px]'
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  textShadow: '0 1px 10px rgba(0,0,0,0.3)',
                }}>
                {tour.sub_title}
              </p>
            )}

            <div className='flex items-center gap-5 mt-2 px-5 py-3 bg-black/25 backdrop-blur-[10px] rounded-full border border-white/10 max-[480px]:flex-wrap max-[480px]:justify-center'>
              <div className='flex flex-col items-center gap-1'>
                <span
                  className='text-[1.75rem] font-bold text-[#e6c200] leading-none'
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                  ${originalPrice.toFixed(0)}
                </span>
                <span className='text-[0.65rem] font-medium text-white/80 uppercase tracking-[0.05em] text-center'>
                  {locale === 'en' ? 'Per Person' : 'Por Persona'}
                </span>
              </div>
              <div className='w-px h-[30px] bg-white/20 max-[480px]:hidden' />
              {tour.quickstats?.[1] && (
                <>
                  <div className='flex flex-col items-center gap-1 drop-shadow-[0_0_7px_white]'>
                    <LazyLoadImage
                      src='/assets/icon/time.png'
                      alt='Time'
                      className='w-5 h-5 drop-shadow-[0_0_6px_white]'
                    />
                    <span className='text-[0.65rem] font-medium text-white/80 uppercase tracking-[0.05em] text-center'>
                      {tour.quickstats[1].content}
                    </span>
                  </div>
                  <div className='w-px h-[30px] bg-white/20 max-[480px]:hidden' />
                </>
              )}
              {tour.quickstats?.[3] && (
                <div className='flex flex-col items-center gap-1 drop-shadow-[0_0_7px_white]'>
                  <LazyLoadImage
                    src='/assets/icon/dificult.png'
                    alt='Difficulty'
                    className='w-5 h-5 drop-shadow-[0_0_6px_white]'
                  />
                  <span className='text-[0.65rem] font-medium text-white/80 uppercase tracking-[0.05em] text-center'>
                    {tour.quickstats[3].content}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {tour.quickstats?.length > 0 && (
          <div className='absolute -bottom-10 left-0 right-0 z-[15] flex justify-center px-6 translate-y-1/2'>
            <div className='w-full max-w-7xl bg-white rounded-[1.25rem] px-2 py-2 lg:px-10 lg:py-8 shadow-[0_10px_60px_rgba(0,0,0,0.15)] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 lg:gap-10 border border-[rgba(230,194,0,0.2)]'>
              {tour.quickstats.slice(0, 6).map((qsk, index) => (
                <div
                  key={index}
                  className='flex flex-col items-center text-center lg:gap-2'>
                  <LazyLoadImage
                    src={STAT_ICONS[index] || STAT_ICONS[0]}
                    alt={qsk.title || ''}
                    className='w-8 h-8 lg:w-10 lg:h-10 object-contain opacity-90'
                  />
                  <span className='text-[0.7rem] font-semibold text-gray-500 uppercase tracking-[0.05em] max-[480px]:text-[0.65rem]'>
                    {qsk.title}
                  </span>
                  <span className='text-[0.95rem] font-bold text-[#CC9900] max-[480px]:text-[0.85rem]'>
                    {qsk.content}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
      <div className='2xl:container mx-auto'>
        <div className='lg:mx-24 mx-3'>
          <div className='grid grid-cols-12 lg:gap-8 gap-0'>
            <section className='col-span-12'>
              {tour.url_brochure && (
                <div className='my-2 text-center'>
                  <a
                    href={tour.url_brochure}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-br from-secondary to-yellow-dark text-primary font-bold text-sm uppercase tracking-wider no-underline rounded-full shadow-[0_4px_20px_rgba(230,194,0,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(230,194,0,0.5)]'>
                    <svg
                      className='w-5 h-5'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                      />
                    </svg>
                    {locale === 'en'
                      ? 'Download Brochure'
                      : 'Descargar Folleto'}
                  </a>
                </div>
              )}

              {tour.sub_title && (
                <h2 className='text-center text-3xl font-semibold text-[#B8860B] my-4 px-20'>
                  {tour.sub_title}
                </h2>
              )}

              {tour.highlight && (
                <p className='italic my-3 text-center md:mx-5'>
                  <strong>{tour.highlight}</strong>
                </p>
              )}
              {tour.description && (
                <div>
                  {tour.gallery?.length > 0 && (
                    <img
                      src={tour.gallery[tour.gallery.length - 1].url}
                      alt={tour.gallery[tour.gallery.length - 1].alt}
                      title={tour.gallery[tour.gallery.length - 1].alt}
                      className='float-none md:float-right md:ml-4 mb-2 w-full md:w-1/2 h-auto rounded cursor-zoom-in'
                      onClick={() => setIsZoomed(true)}
                    />
                  )}
                  <div>{parser(tour.description)}</div>
                  {isZoomed && tour.gallery?.length > 0 && (
                    <div
                      className='fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4'
                      onClick={() => setIsZoomed(false)}>
                      <div className='relative max-w-full max-h-full'>
                        <button
                          onClick={() => setIsZoomed(false)}
                          className='absolute top-2 right-2 text-primary bg-secondary rounded-full p-0 m-0 hover:text-secondary hover:bg-primary text-3xl w-9'>
                          &times;
                        </button>
                        <img
                          src={tour.gallery[tour.gallery.length - 1].url}
                          alt={tour.gallery[tour.gallery.length - 1].alt}
                          title={tour.gallery[tour.gallery.length - 1].alt}
                          className='max-w-full max-h-screen object-contain rounded shadow-lg'
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {tour.gallery?.length > 1 && (
                <div className='col-md-6'>
                  <img
                    src={tour.gallery[tab].url}
                    alt={tour.gallery[tab].alt}
                    title={tour.gallery[tab].alt}
                    className='rounded mt-4 w-full lg:h-[35rem] h-56 object-cover'
                  />
                  <div
                    className='flex py-2 pr-8 md:pr-0'
                    style={{ cursor: 'pointer', gap: '8px' }}>
                    {(tour.gallery.length > 5
                      ? tour.gallery.slice(0, -1)
                      : tour.gallery
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
              )}

              {tour.information?.length > 0 && (
                <>
                  <TravelSectionTitle title={t.trip_details} />
                  <Tabs
                    key={tour.slug || tour._id}
                    tabsQuery={tour.information}
                  />
                </>
              )}

              {tour.ardiscounts?.length > 0 && (
                <div className='my-8'>
                  <TravelSectionTitle
                    title={
                      locale === 'en'
                        ? 'Group Discounts'
                        : 'Descuentos por Grupo'
                    }
                  />
                  <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
                    {tour.ardiscounts.map((d, i) => (
                      <div
                        key={i}
                        className='bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center hover:shadow-md transition-shadow'>
                        {d.persons && (
                          <div className='text-sm font-semibold mb-1'>
                            {d.persons}{' '}
                            {locale === 'en' ? 'persons' : 'personas'}
                          </div>
                        )}
                        {d.pdiscount != null && (
                          <div className='text-2xl font-bold text-secondary'>
                            -{d.pdiscount}%
                          </div>
                        )}
                        {d.pdiscount != null && originalPrice > 0 && (
                          <div className='text-lg font-bold text-primary mt-1'>
                            $
                            {(originalPrice * (1 - d.pdiscount / 100)).toFixed(
                              0,
                            )}{' '}
                            USD
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className='grid lg:grid-cols-3 grid-cols-1 gap-2 text-white bg-primary py-4 px-8 text-center items-center rounded-t'>
                <h3 className='text-lg font-bold'>{t.have_questions}</h3>
                <div>
                  <h4>{t.call}</h4>
                  <Link
                    href='https://api.whatsapp.com/send/?phone=51970811976'
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
                className='fixed -bottom-4 left-1/2 -translate-x-1/2 text-xl shadow-xl font-extrabold inline-flex z-50'>
                <span className='animate-bounce px-4 pt-2 pb-4 text-primary bg-secondary hover:bg-primary hover:text-secondary rounded-t-2xl drop-shadow-[0_0_10px_rgba(251,184,0,1)] transition-all duration-300'>
                  {dataget?.data?.length > 0 ? t.availability : t.booking}
                </span>
              </button>

              {isOpen && (
                <div
                  className='fixed inset-0 flex items-center justify-center bg-black/50 z-50'
                  onClick={handleBackdropClick}>
                  <div
                    ref={modalRef}
                    className='relative bg-white rounded-lg shadow-lg w-full max-w-4xl m-4'>
                    <button
                      onClick={handleClose}
                      className='absolute top-2 right-2 text-primary bg-secondary rounded-full p-0 m-0 hover:text-secondary hover:bg-primary text-3xl w-9'>
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
            </section>
          </div>

          <section className='my-8'>
            <TravelSectionTitle
              title={
                locale === 'en'
                  ? `More ${categoryTitle} Tours`
                  : `Más Tours de ${categoryTitle}`
              }
            />
            {similarTours?.length > 0 && (
              <TourSlider tours={similarTours.slice(0, 8)} t={t} />
            )}
          </section>
        </div>
      </div>

      <div className='2xl:container mx-auto'>
        <div className='lg:mx-24 mx-3'>
          <CategoryFAQs category={category} />
        </div>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const data = await getCategoriesWithTours('all');
  const paths = [];
  for (const { category, tours } of data) {
    for (const tour of tours) {
      paths.push({
        params: { travel: category, slug: tour.slug },
        locale: 'en',
      });
      paths.push({
        params: { travel: category, slug: tour.slug },
        locale: 'es',
      });
    }
  }
  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params, locale }) {
  const { travel, slug } = params;
  const lang = locale || 'es';

  const tour = await getTripBySlug(slug, lang);
  if (!tour || tour.category !== travel) {
    return { notFound: true };
  }

  const allCategories = await getCategoriesWithTours(lang);
  const currentCategory = allCategories.find((c) => c.category === travel);
  const similarTours = currentCategory
    ? currentCategory.tours.filter((t) => t.slug !== slug)
    : [];

  return {
    props: {
      tour: JSON.parse(JSON.stringify(tour)),
      category: travel,
      similarTours: JSON.parse(JSON.stringify(similarTours)),
    },
    revalidate: 3600,
  };
}
