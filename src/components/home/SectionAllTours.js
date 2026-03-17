import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import Link from 'next/link';
import Image from 'next/image';

import {
  FILTER_CATEGORIES,
  getTourAlt,
  getTourImage,
  getTourPrice,
  getTourTag,
  getToursByCategory,
} from './tourCategories';

function AutoplayPlugin(slider) {
  let timeout;
  let isHovered = false;

  const clearAutoplay = () => {
    clearTimeout(timeout);
  };

  const startAutoplay = () => {
    clearAutoplay();

    if (isHovered || !slider?.track?.details) return;

    timeout = setTimeout(() => {
      slider.next();
    }, 4500);
  };

  const onMouseEnter = () => {
    isHovered = true;
    clearAutoplay();
  };

  const onMouseLeave = () => {
    isHovered = false;
    startAutoplay();
  };

  slider.on('created', () => {
    slider.container.addEventListener('mouseenter', onMouseEnter);
    slider.container.addEventListener('mouseleave', onMouseLeave);
    startAutoplay();
  });

  slider.on('dragStarted', clearAutoplay);
  slider.on('animationEnded', startAutoplay);
  slider.on('updated', startAutoplay);

  slider.on('destroyed', () => {
    clearAutoplay();
    slider.container.removeEventListener('mouseenter', onMouseEnter);
    slider.container.removeEventListener('mouseleave', onMouseLeave);
  });
}

export default function SectionAllTours({
  tours = [],
  sectionId = 'alltours',
}) {
  const { locale } = useRouter();
  const isEn = locale === 'en';

  const [activeFilter, setActiveFilter] = useState('inca-trail');
  const [currentSlide, setCurrentSlide] = useState(0);

  const filteredTours = useMemo(() => {
    return getToursByCategory(tours, activeFilter);
  }, [tours, activeFilter]);

  const hasSlides = filteredTours.length > 0;
  const canSlide = filteredTours.length > 1;

  const sliderKey = `${locale || 'default'}-${activeFilter}-${filteredTours.length}`;

  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: canSlide,
      mode: 'snap',
      renderMode: 'performance',
      drag: canSlide,
      defaultAnimation: {
        duration: 850,
        easing: (t) => 1 - Math.pow(1 - t, 3),
      },
      slides: {
        perView: 1.15,
        spacing: 20,
        origin: 'center',
      },
      breakpoints: {
        '(min-width: 640px)': {
          slides: {
            perView: 2,
            spacing: 24,
            origin: 'center',
          },
        },
        '(min-width: 1024px)': {
          slides: {
            perView: 3,
            spacing: 24,
            origin: 'center',
          },
        },
      },
      created(slider) {
        setCurrentSlide(slider.track.details?.rel ?? 0);
      },
      slideChanged(slider) {
        setCurrentSlide(slider.track.details?.rel ?? 0);
      },
    },
    canSlide ? [AutoplayPlugin] : [],
  );

  const realIndex = hasSlides ? currentSlide % filteredTours.length : 0;

  return (
    <section
      id={sectionId}
      className='relative w-full overflow-hidden py-12'
      aria-roledescription='carousel'
      aria-label={isEn ? 'Featured Adventures' : 'Aventuras Destacadas'}>
      <div className='mx-auto max-w-7xl lg:px-8'>
        <div className='mb-3 flex flex-col items-center gap-2 text-center'>
          <span className='inline-flex items-center rounded-full bg-[#E6C20026] px-4 py-1 text-xs font-semibold uppercase tracking-widest text-[#0d1117]'>
            {isEn ? 'Explore Peru' : 'Explora Perú'}
          </span>

          <h2 className='m-0 text-3xl font-semibold tracking-tight text-neutral-900 lg:text-4xl'>
            {isEn
              ? 'Unforgettable Experiences in Peru'
              : 'Experiencias Inolvidables en Perú'}
          </h2>

          <p className='max-w-2xl text-base text-neutral-600'>
            {isEn
              ? 'A selection of routes, culture and adventure that reveal the best of Peru. Hike among ancestral mountains, discover cities full of history and experience landscapes that seem painted by the Andes.'
              : 'Una selección de rutas, cultura y aventura que revelan lo mejor del Perú. Camina entre montañas ancestrales, descubre ciudades llenas de historia y vive paisajes que parecen pintados por la cordillera.'}
          </p>

          <span className='inline-flex items-center rounded-full bg-[#E6C20026] px-4 py-1 text-xs font-semibold uppercase tracking-widest text-[#0d1117]'>
            {isEn
              ? 'Find Your Perfect Category'
              : 'Encuentra tu Categoría Ideal'}
          </span>

          <div className='flex flex-wrap justify-center gap-3'>
            {FILTER_CATEGORIES.map((cat) => {
              const isActive = activeFilter === cat.key;

              return (
                <button
                  key={cat.key}
                  type='button'
                  onClick={() => {
                    setActiveFilter(cat.key);
                    setCurrentSlide(0);
                  }}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? 'scale-105 bg-[#E6C200] text-[#0d1117] shadow-md'
                      : 'border border-neutral-300 bg-white text-neutral-600 hover:border-[#E6C200] hover:text-[#E6C200]'
                  }`}>
                  {isEn ? cat.labelEn : cat.labelEs}
                </button>
              );
            })}
          </div>
        </div>

        <div className='relative w-full'>
          {hasSlides ? (
            <div className='overflow-hidden'>
              <div
                key={sliderKey}
                ref={sliderRef}
                className='keen-slider section-all-tours-slider cursor-grab active:cursor-grabbing'>
                {filteredTours.map((tour, idx) => {
                  const tourImage = getTourImage(tour);
                  const tourAlt = getTourAlt(tour);
                  const tourCategory = getTourTag(tour, locale);
                  const discountedPrice = getTourPrice(tour);

                  return (
                    <div
                      key={tour._id || tour.slug || idx}
                      className='keen-slider__slide'
                      style={{ minWidth: 0 }}
                      aria-label={`Tour ${idx + 1} ${isEn ? 'of' : 'de'} ${filteredTours.length}`}>
                      <div className='group relative overflow-hidden rounded-2xl bg-black shadow-md'>
                        <Image
                          src={tourImage}
                          alt={tourAlt}
                          width={400}
                          height={380}
                          loading='lazy'
                          sizes='(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 85vw'
                          className='h-[380px] w-full object-cover transition-transform duration-700 group-hover:scale-105'
                        />

                        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent' />

                        {tour.discount > 0 && (
                          <Link
                            href={`/${tour.category}/${tour.slug}`}
                            locale={locale}
                            className='absolute left-4 top-4 z-20 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-neutral-900 transition-colors hover:bg-amber-300'
                            aria-label={`${isEn ? 'See trip with discount' : 'Ver viaje con descuento'}: ${tour.title}`}>
                            -{tour.discount}%
                          </Link>
                        )}

                        <Link
                          href={`/${tour.category}/${tour.slug}`}
                          locale={locale}
                          className='absolute right-4 top-4 z-20 inline-flex items-center rounded-full border border-white/60 bg-black/40 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:bg-black/60'
                          aria-label={`${isEn ? 'View trip' : 'Ver viaje'}: ${tour.title}`}>
                          {isEn ? 'View Trip' : 'Ver Viaje'}
                        </Link>

                        <div className='absolute bottom-0 w-full p-6 text-white'>
                          <span className='mb-2 block text-xs font-semibold uppercase tracking-widest text-amber-400'>
                            {tourCategory}
                          </span>

                          <h3 className='mb-3 text-xl font-semibold uppercase leading-snug'>
                            {tour.title}
                          </h3>

                          <div className='flex items-center justify-between text-sm text-neutral-200'>
                            <span>{tour.duration}</span>
                            <span className='font-bold text-amber-400'>
                              {isEn ? 'From' : 'Desde'} ${discountedPrice}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className='mx-6 rounded-[2rem] border border-neutral-200 bg-white p-8 text-center shadow-sm'>
              <h3 className='text-xl font-semibold text-neutral-900'>
                {isEn
                  ? 'No tours available in this category yet'
                  : 'Aún no hay tours disponibles en esta categoría'}
              </h3>

              <p className='mt-3 text-neutral-600'>
                {isEn
                  ? 'Choose another category to explore more experiences in Peru.'
                  : 'Selecciona otra categoría para explorar más experiencias en Perú.'}
              </p>
            </div>
          )}
        </div>

        {canSlide && (
          <div className='mt-10 flex justify-center gap-3'>
            {filteredTours.map((_, idx) => (
              <button
                key={idx}
                type='button'
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                  realIndex === idx
                    ? 'scale-125 bg-amber-400'
                    : 'bg-neutral-300 hover:bg-neutral-400'
                }`}
                aria-label={`${isEn ? 'Go to slide' : 'Ir al slide'} ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
