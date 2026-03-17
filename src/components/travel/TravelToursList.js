import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import Image from 'next/image';

const AUTOPLAY_DELAY = 4500;
const FALLBACK_IMAGE = '/img/hero/machu-picchur-min.jpeg';

function AutoplayPlugin(slider) {
  let timeout;
  let isHovered = false;

  const clearNextTimeout = () => {
    clearTimeout(timeout);
  };

  const nextTimeout = () => {
    clearNextTimeout();
    if (isHovered || !slider?.track?.details) return;

    timeout = setTimeout(() => {
      slider.next();
    }, AUTOPLAY_DELAY);
  };

  const onMouseEnter = () => {
    isHovered = true;
    clearNextTimeout();
  };

  const onMouseLeave = () => {
    isHovered = false;
    nextTimeout();
  };

  slider.on('created', () => {
    slider.container.addEventListener('mouseenter', onMouseEnter);
    slider.container.addEventListener('mouseleave', onMouseLeave);
    nextTimeout();
  });

  slider.on('dragStarted', clearNextTimeout);
  slider.on('animationEnded', nextTimeout);
  slider.on('updated', nextTimeout);
  slider.on('destroyed', () => {
    slider.container.removeEventListener('mouseenter', onMouseEnter);
    slider.container.removeEventListener('mouseleave', onMouseLeave);
    clearNextTimeout();
  });
}

function formatPrice(value) {
  if (!Number.isFinite(value)) return '0';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(Math.max(0, value));
}

function getTourPricing(tour) {
  const basePrice = Number(tour?.price) || 0;
  const discount = Number(tour?.discount) || 0;
  const hasDiscount = discount > 0;
  const finalPrice = hasDiscount
    ? basePrice - (basePrice * discount) / 100
    : basePrice;

  return { basePrice, finalPrice, hasDiscount, discount };
}

function ArrowButton({ direction, onClick, ariaLabel }) {
  const isPrev = direction === 'prev';

  return (
    <button
      type='button'
      onClick={onClick}
      aria-label={ariaLabel}
      className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/70 focus-visible:ring-offset-2'>
      <svg
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        className='h-5 w-5'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d={isPrev ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'}
        />
      </svg>
    </button>
  );
}

function TourSlideCard({ tour, t }) {
  const image = tour?.gallery?.[0]?.url || FALLBACK_IMAGE;
  const imageAlt = tour?.gallery?.[0]?.alt || tour?.title || 'Tour image';
  const href =
    tour?.category && tour?.slug ? `/${tour.category}/${tour.slug}` : '#';
  const categoryLabel = tour?.quickstats?.[0]?.content || t?.adventure;
  const { basePrice, finalPrice, hasDiscount, discount } = getTourPricing(tour);

  return (
    <div className='group relative block h-80 overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-900 shadow-[0_12px_32px_rgba(2,6,23,0.22)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(2,6,23,0.28)] sm:h-[360px]'>
      <Image
        src={image}
        alt={imageAlt}
        title={imageAlt}
        fill
        sizes='(max-width: 479px) 95vw, (max-width: 639px) 83vw, (max-width: 899px) 68vw, (max-width: 1199px) 48vw, (max-width: 1449px) 35vw, 30vw'
        loading='lazy'
        className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
      />

      <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10' />

      {hasDiscount && (
        <div className='absolute right-3 top-3 z-20 rounded-full bg-red-500 px-3 py-1 text-xs font-bold tracking-wide text-white shadow-md'>
          -{discount}%
        </div>
      )}

      <div className='absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5'>
        <div className='mb-4'>
          <p className='text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary/95'>
            {categoryLabel}
          </p>
          <h3 className='mt-2 text-lg font-bold leading-tight text-white sm:text-xl'>
            {tour?.title || '-'}
          </h3>
        </div>

        <div className='flex justify-between items-stretch border-t border-white/20 pt-3'>
          <div className='flex flex-col items-center gap-1.5 text-xs font-medium text-white/90 sm:text-sm'>
            <div className='flex items-center'>
              <svg
                viewBox='0 0 24 24'
                fill='currentColor'
                className='h-4 w-4 text-secondary'>
                <path
                  fillRule='evenodd'
                  d='M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z'
                  clipRule='evenodd'
                />
              </svg>
              <span>{tour?.duration || '-'}</span>
            </div>
            <div className='flex items-center gap-2 rounded-full border border-white/35 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white transition-colors duration-300 group-hover:border-secondary group-hover:bg-secondary group-hover:text-primary'>
              <Link href={href} passHref>
                <span>{t?.btn_viewtrip || 'VIEW TRIP'}</span>
              </Link>
              <svg
                viewBox='0 0 20 20'
                fill='currentColor'
                className='h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5'>
                <path
                  fillRule='evenodd'
                  d='M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
          </div>
          <div className='flex flex-col items-center gap-1.5 text-xs font-medium text-white/90 sm:text-sm'>
            <div className='flex items-center'>
              <span>{t?.from || 'FROM'}</span>
            </div>
            <div className='flex items-center gap-2 text-xl font-semibold uppercase tracking-wide'>
              {hasDiscount && (
                <div
                  itemscope
                  itemtype='https://schema.org/Offer'
                  className='text-white/70'>
                  <span itemprop='priceCurrency' content='USD' className='line-through'>
                    $
                  </span>
                  <span itemprop='price' content={basePrice} className='text-xl line-through'>
                    {formatPrice(basePrice)}
                  </span>
                </div>
              )}
              <div
                itemscope
                itemtype='https://schema.org/Offer'
                className='text-secondary'>
                <span itemprop='priceCurrency' content='USD'>
                  $
                </span>
                <span itemprop='price' content={finalPrice} className='leading-none'>
                  {formatPrice(finalPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TravelToursSlider({ tours, t }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const hasMultipleTours = tours.length > 1;

  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: hasMultipleTours,
      drag: hasMultipleTours,
      rubberband: false,
      renderMode: 'performance',
      slides: { perView: 1.05, spacing: 12 },
      breakpoints: {
        '(min-width: 480px)': {
          slides: { perView: 1.2, spacing: 14 },
        },
        '(min-width: 640px)': {
          slides: { perView: 1.45, spacing: 16 },
        },
        '(min-width: 900px)': {
          slides: { perView: 2.1, spacing: 20 },
        },
        '(min-width: 1200px)': {
          slides: { perView: 2.8, spacing: 24 },
        },
        '(min-width: 1450px)': {
          slides: { perView: 3.3, spacing: 24 },
        },
      },
      created(slider) {
        setIsReady(true);
        setCurrentSlide(slider.track.details?.rel || 0);
      },
      slideChanged(slider) {
        setCurrentSlide(slider.track.details?.rel || 0);
      },
    },
    hasMultipleTours ? [AutoplayPlugin] : [],
  );

  return (
    <div className='w-full'>
      <div ref={sliderRef} className='keen-slider !overflow-visible py-1'>
        {tours.map((tour, index) => (
          <div
            className='keen-slider__slide'
            key={
              tour?.slug || tour?._id || `${tour?.title || 'tour'}-${index}`
            }>
            <TourSlideCard tour={tour} t={t} />
          </div>
        ))}
      </div>

      {hasMultipleTours && isReady && (
        <div className='mt-5 flex items-center justify-center gap-3 sm:gap-4'>
          <ArrowButton
            direction='prev'
            onClick={() => instanceRef.current?.prev()}
            ariaLabel='Previous slide'
          />

          <div className='flex max-w-[65vw] items-center gap-2 overflow-x-auto px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
            {tours.map((tour, index) => {
              const isActive = currentSlide === index;

              return (
                <button
                  key={`dot-${tour?.slug || index}`}
                  type='button'
                  onClick={() => instanceRef.current?.moveToIdx(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/70 focus-visible:ring-offset-2 ${
                    isActive
                      ? 'w-8 bg-secondary'
                      : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              );
            })}
          </div>

          <ArrowButton
            direction='next'
            onClick={() => instanceRef.current?.next()}
            ariaLabel='Next slide'
          />
        </div>
      )}
    </div>
  );
}

export default function TravelToursList({ t, trips }) {
  const safeTours = useMemo(
    () => (Array.isArray(trips) ? trips.filter(Boolean) : []),
    [trips],
  );

  if (safeTours.length === 0) {
    return (
      <div className='rounded-2xl bg-gray-50 py-16 text-center'>
        <div className='text-xl text-gray-500'>{t?.no_tours}</div>
      </div>
    );
  }

  return <TravelToursSlider tours={safeTours} t={t} />;
}
