import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import {
  getTripBySlug,
  getCategoriesWithTours,
} from '@/modules/trips/service/trip.service';
import {
  getCategoryTitle,
  getCategoryImagePath,
} from '@/utils/categoryHelpers';
import { BRAND } from '@/lib/brandConfig';
import en from '@/lang/en/slug';
import es from '@/lang/es/slug';
import TravelSectionTitle from '@/components/travel/TravelSectionTitle';
import TourSlider from '@/components/Slider';
import TourSeo from '@/components/travel/tour-page/TourSeo';
import TourHero from '@/components/travel/tour-page/TourHero';
import TourMainContent from '@/components/travel/tour-page/TourMainContent';

const CategoryFAQs = dynamic(
  () => import('@/components/category/CategoryFAQs'),
  {
    loading: () => <div className='min-h-[300px]' />,
    ssr: true,
  },
);

export default function TourPage({ tour, category, similarTours }) {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'en' ? en : es;

  const originalPrice = tour?.price || 0;
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

  return (
    <>
      <TourSeo
        tour={tour}
        category={category}
        categoryTitle={categoryTitle}
        originalPrice={originalPrice}
      />
      <TourHero
        category={category}
        categoryTitle={categoryTitle}
        heroImage={heroImage}
        locale={locale}
        originalPrice={originalPrice}
        tour={tour}
      />
      <TourMainContent
        category={category}
        categoryTitle={categoryTitle}
        dataget={dataget}
        handleBackdropClick={handleBackdropClick}
        handleClose={handleClose}
        handleOpen={handleOpen}
        isOpen={isOpen}
        isZoomed={isZoomed}
        locale={locale}
        modalRef={modalRef}
        originalPrice={originalPrice}
        setIsZoomed={setIsZoomed}
        setTab={setTab}
        t={t}
        tab={tab}
        tour={tour}
        tourDays={tourDays}
        contactEmail={BRAND.contactEmail}
      />

      <div className='2xl:container mx-auto'>
        <div className='lg:mx-24 mx-3'>
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
