import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  FILTER_CATEGORIES,
  getCategoryCopy,
  getFeaturedTours,
  getTourAlt,
  getTourImage,
  getTourPrice,
  getTourTag,
  getToursByCategory,
} from './tourCategories';

export function IncaTrailIcon({ className = 'w-6 h-6' }) {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.8'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
      aria-hidden='true'>
      <path d='M4 19h16' />
      <path d='M6 19c2.5-4.5 5-6.5 8-6.5 2 0 3.2.6 4 1.2' />
      <path d='M8 14l1.5-4L12 12l1.8-5L17 12' />
      <path d='M7 8h.01' />
      <path d='M15.5 6.5h.01' />
    </svg>
  );
}

export function MountainsIcon({ className = 'w-6 h-6' }) {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.8'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
      aria-hidden='true'>
      <path d='M3 19h18' />
      <path d='M5 19 10 9l3 4 2-3 4 9' />
      <path d='M9 11l1-2 1 2' />
      <path d='M14.5 11l.8-1.4.8 1.4' />
    </svg>
  );
}

export function DayToursIcon({ className = 'w-6 h-6' }) {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.8'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
      aria-hidden='true'>
      <circle cx='12' cy='12' r='7' />
      <path d='M12 9v3l2 2' />
      <path d='M12 3v2' />
      <path d='M21 12h-2' />
      <path d='M5 12H3' />
      <path d='m18.4 5.6-1.4 1.4' />
      <path d='m7 17-1.4 1.4' />
    </svg>
  );
}

export function OtherIcon({ className = 'w-6 h-6' }) {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.8'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
      aria-hidden='true'>
      <circle cx='6' cy='12' r='1.6' fill='currentColor' stroke='none' />
      <circle cx='12' cy='12' r='1.6' fill='currentColor' stroke='none' />
      <circle cx='18' cy='12' r='1.6' fill='currentColor' stroke='none' />
    </svg>
  );
}

export function SalkantayIcon({ className = 'w-6 h-6' }) {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.8'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
      aria-hidden='true'>
      <path d='M3 19h18' />
      <path d='M6 19 11 8l3 5 2.5-3 3.5 9' />
      <path d='M14 6h.01' />
      <path d='M16.2 8.2h.01' />
    </svg>
  );
}

function CategoryIcon({ categoryKey, className = 'h-6 w-6' }) {
  if (categoryKey === 'inca-trail') {
    return <IncaTrailIcon className={className} />;
  }

  if (categoryKey === 'mountain-treks') {
    return <SalkantayIcon className={className} />;
  }

  if (categoryKey === 'peru-packages') {
    return <MountainsIcon className={className} />;
  }

  if (categoryKey === 'others') {
    return <OtherIcon className={className} />;
  }

  return <DayToursIcon className={className} />;
}

function FloatingTourCard({
  tour,
  locale,
  className = '',
  compact = false,
  showCategory = true,
}) {
  const tourImage = getTourImage(tour);
  const tourAlt = getTourAlt(tour);
  const tourCategory = getTourTag(tour, locale);
  const tourPrice = getTourPrice(tour);

  return (
    <article
      className={`group relative overflow-hidden rounded-xl border border-black/10 shadow-[0_25px_70px_-35px_rgba(0,0,0,0.75)] ${className}`}>
      <img
        src={tourImage}
        alt={tourAlt}
        loading='lazy'
        className='absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105'
      />
      <div className='absolute inset-0 bg-gradient-to-r rounded-xl from-black/50 to-black/30' />
      <div className='relative flex h-full flex-col justify-between text-start p-4 text-white'>
        <div className='flex gap-3'>
          <div className='flex items-center gap-2'>
            {tour.discount > 0 && (
              <span className='rounded-full bg-[#f1cf63] px-2.5 py-1 text-[10px] font-bold text-[#111111]'>
                -{tour.discount}%
              </span>
            )}
          </div>
        </div>

        <div className={compact ? 'space-y-2' : 'space-y-3.5'}>
          <div className='flex flex-col'>
            <h3
              className={`font-semibold text-start uppercase m-0 ${
                compact ? 'text-[0.95rem] ' : 'text-[1.05rem]'
              }`}>
              {tour.title}
            </h3>
            <span
              className={`${compact ? 'text-[11px] text-left ite' : 'text-xs'} text-white/78`}>
              {tour.duration}
            </span>
            <span
              className={`${compact ? 'text-sm' : 'text-[0.95rem]'} font-bold text-secondary`}>
              {locale === 'en' ? 'From' : 'Desde'} ${tourPrice}
            </span>

            <Link
              href={`/${tour.category}/${tour.slug}`}
              locale={locale}
              className='inline-flex items-center rounded-full border border-white/20 bg-black/35 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-black/55'>
              {locale === 'en' ? 'View Trip' : 'Ver Viaje'}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function CategoryTab({ item, isActive, locale, onClick }) {
  return (
    <button
      type='button'
      onClick={onClick}
      className='flex flex-col items-center  justify-center text-center transition-transform duration-300 hover:-translate-y-1'>
      <span
        className={`flex items-center justify-center transition-all duration-300 ${
          isActive ? ' text-[#F4B400] ' : ' text-[#111111]'
        }`}>
        <CategoryIcon categoryKey={item.key} className='size-10' />
      </span>
      <span
        className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${
          isActive
            ? 'border-b-4 border-b-[#B8860B] text-[#B8860B] '
            : 'text-[#111111]'
        }`}>
        {locale === 'en' ? item.labelEn : item.labelEs}
      </span>
    </button>
  );
}

function EmptyState({ locale }) {
  return (
    <div className='flex aspect-[2/1] items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.03] px-10 text-center text-white/85'>
      <div className='max-w-lg space-y-4'>
        <h3 className='text-2xl font-semibold text-white'>
          {locale === 'en'
            ? 'This category does not have featured tours yet'
            : 'Esta categoria aun no tiene tours destacados'}
        </h3>
        <p className='text-base text-white/65'>
          {locale === 'en'
            ? 'Try another main category to keep exploring routes, day trips, and mountain adventures.'
            : 'Prueba otra categoria principal para seguir explorando rutas, salidas de un dia y aventuras de montana.'}
        </p>
      </div>
    </div>
  );
}

function MainComposition({ tours, locale }) {
  const leadTour = tours[0];
  const spotlightTour = tours[1];
  const lowerTours = tours.slice(2, 5);

  if (!leadTour) {
    return <EmptyState locale={locale} />;
  }

  return (
    <div className='relative mx-auto w-full max-w-4xl 2xl:max-w-7xl'>
      <div className='relative h-[440px] 2xl:h-[500px] w-11/12  rounded-xl '>
        <img
          src={getTourImage(leadTour)}
          alt={getTourAlt(leadTour)}
          loading='lazy'
          className='absolute inset-0 h-full w-full rounded-xl object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-r rounded-xl from-black/50 via-black/35 to-transparent' />

        <div className='relative flex  flex-col justify-between p-8'>
          <div className='flex items-start gap-6 '>
            <div className='max-w-[60%] space-y-4'>
              <h3 className='max-w-[78%] text-[2.2rem] font-semibold text-start uppercase leading-[1.05] text-white'>
                {leadTour.title}
              </h3>
              <p className='max-w-[70%] text-sm leading-7 text-white text-start'>
                {leadTour.duration} ·{' '}
                {locale === 'en'
                  ? 'Featured route with the strongest visual focus in this category.'
                  : 'Ruta destacada con el foco visual principal de esta categoria.'}
              </p>
              {leadTour.discount > 0 && (
                <span className='inline-flex rounded-full bg-[#f1cf63] px-3 py-1 text-[11px] font-bold text-white'>
                  -{leadTour.discount}%
                </span>
              )}
              <p className='text-2xl font-bold text-secondary'>
                {locale === 'en' ? 'From' : 'Desde'} ${getTourPrice(leadTour)}
              </p>
              <Link
                href={`/${leadTour.category}/${leadTour.slug}`}
                locale={locale}
                className='inline-flex items-center rounded-full border border-white/15 bg-black/30 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-black/55'>
                {locale === 'en' ? 'View Trip' : 'Ver Viaje'}
              </Link>
            </div>
          </div>
        </div>

        {spotlightTour && (
          <div className='absolute inset-y-0 right-0 flex translate-x-1/2 translate-y-1/4 h-60 w-44 '>
            <FloatingTourCard
              tour={spotlightTour}
              locale={locale}
              className='h-full w-full'
              compact
            />
          </div>
        )}

        <div className='absolute inset-x-0 bottom-0 flex translate-y-1/2 items-start justify-center gap-4 px-4 sm:gap-6 lg:gap-10'>
          {Array.from({ length: 3 }).map((_, index) => {
            const tour = lowerTours[index];

            if (!tour) {
              return (
                <div
                  key={`empty-${index}`}
                  className='h-60 w-44 rounded-xl border border-dashed border-white/10 bg-white/[0.03]'
                  aria-hidden='true'
                />
              );
            }

            return (
              <FloatingTourCard
                key={tour._id || tour.slug}
                tour={tour}
                locale={locale}
                className='h-60 w-44'
                compact
                showCategory={false}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function SimpleCategoryLayout({ tours = [] }) {
  const { locale } = useRouter();
  const [activeFilter, setActiveFilter] = useState('inca-trail');

  const filteredTours = useMemo(() => {
    return getToursByCategory(tours, activeFilter);
  }, [tours, activeFilter]);

  const featuredTours = useMemo(() => {
    return getFeaturedTours(filteredTours, 5);
  }, [filteredTours]);

  const activeCategoryCopy = getCategoryCopy(activeFilter, locale);

  return (
    <section className='overflow-hidden px-8 py-8 text-black xl:px-12 h-screen 3xl:h-[80vh]'>
      <div className='mx-auto flex w-full max-w-5xl flex-col gap-3'>
        <div className='flex flex-col justify-center items-center gap-2'>
          <span className='items-center rounded-full bg-[#E6C20026] text-[#0d1117] px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] ]'>
            {locale === 'en' ? 'Explore Peru' : 'Explora Peru'}
          </span>
          <h2 className='max-w-3xl text-2xl m-0 font-semibold leading-[1.02] tracking-[-0.04em] text-black'>
            {locale === 'en'
              ? 'Unforgettable Experiences in Peru'
              : 'Experiencias Inolvidables en Perú'}
          </h2>
          <p className=' max-w-2xl text-sm text-black/65'>
            {activeCategoryCopy.description}
          </p>
        </div>

        <div className='flex items-start justify-center gap-5'>
          {FILTER_CATEGORIES.map((item) => {
            const isActive = item.key === activeFilter;

            return (
              <CategoryTab
                key={item.key}
                item={item}
                isActive={isActive}
                locale={locale}
                onClick={() => setActiveFilter(item.key)}
              />
            );
          })}
        </div>

        <MainComposition tours={featuredTours} locale={locale} />
      </div>
    </section>
  );
}
