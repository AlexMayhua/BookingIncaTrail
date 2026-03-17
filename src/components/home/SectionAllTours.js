import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import Link from 'next/link';
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
  let mouseOver = false;

  function clearNextTimeout() {
    clearTimeout(timeout);
  }

  function nextTimeout() {
    clearTimeout(timeout);
    if (mouseOver) return;
    timeout = setTimeout(() => {
      if (slider && slider.track && slider.track.details) {
        slider.next();
      }
    }, 4000);
  }

  slider.on('created', () => {
    slider.container.addEventListener('mouseover', () => {
      mouseOver = true;
      clearNextTimeout();
    });
    slider.container.addEventListener('mouseout', () => {
      mouseOver = false;
      nextTimeout();
    });
    nextTimeout();
  });
  slider.on('dragStarted', clearNextTimeout);
  slider.on('animationEnded', nextTimeout);
  slider.on('updated', nextTimeout);
}

export default function SectionAllTours({
  tours = [],
  sectionId = 'alltours',
}) {
  const router = useRouter();
  const { locale } = router;

  const [activeFilter, setActiveFilter] = useState('inca-trail');
  const [currentSlide, setCurrentSlide] = useState(0);

  const filteredTours = useMemo(() => {
    return getToursByCategory(tours, activeFilter);
  }, [tours, activeFilter]);

  const handleFilterChange = useCallback((key) => {
    setActiveFilter(key);
    setCurrentSlide(0);
  }, []);

  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
      slides: { perView: 1.2, spacing: 24, origin: 'center' },
      breakpoints: {
        '(min-width: 640px)': {
          slides: { perView: 2, spacing: 24, origin: 'center' },
        },
        '(min-width: 1024px)': {
          slides: { perView: 3, spacing: 24, origin: 'center' },
        },
      },
      created(slider) {
        if (slider.track.details?.slides) {
          setCurrentSlide(slider.track.details.rel);
        }
      },
      slideChanged(slider) {
        if (slider.track.details) {
          setCurrentSlide(slider.track.details.rel);
        }
      },
    },
    [AutoplayPlugin],
  );

  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      if (instanceRef.current) {
        instanceRef.current.update();
        instanceRef.current.moveToIdx(0, true);
      }
      setCurrentSlide(0);
    });

    return () => window.cancelAnimationFrame(rafId);
  }, [locale, filteredTours.length, activeFilter, instanceRef]);

  useEffect(() => {
    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy();
      }
    };
  }, [instanceRef]);

  const totalDots = filteredTours.length;
  const realIndex =
    filteredTours.length > 0 ? currentSlide % filteredTours.length : 0;

  return (
    <section
      id={sectionId}
      className='relative w-full py-12 overflow-hidden'
      aria-roledescription='carousel'
      aria-label={
        locale === 'en' ? 'Featured Adventures' : 'Aventuras Destacadas'
      }>
      <div className='max-w-7xl mx-auto lg:px-8'>
        <div className='flex flex-col items-center text-center gap-2 mb-3'>
          <span className='inline-flex items-center rounded-full bg-[#E6C20026] text-[#0d1117] px-4 py-1 text-xs font-semibold tracking-widest uppercase'>
            {locale === 'en' ? 'Explore Peru' : 'Explora Perú'}
          </span>
          <h2 className='text-3xl lg:text-4xl font-semibold text-neutral-900 tracking-tight m-0'>
            {locale === 'en'
              ? 'Unforgettable Experiences in Peru'
              : 'Experiencias Inolvidables en Perú'}
          </h2>
          <p className=' max-w-2xl text-neutral-600 text-base'>
            {locale === 'en'
              ? 'A selection of routes, culture and adventure that reveal the best of Peru. Hike among ancestral mountains, discover cities full of history and experience landscapes that seem painted by the Andes.'
              : 'Una selección de rutas, cultura y aventura que revelan lo mejor del Perú. Camina entre montañas ancestrales, descubre ciudades llenas de historia y vive paisajes que parecen pintados por la cordillera.'}
          </p>
          <span className='inline-flex items-center rounded-full bg-[#E6C20026] text-[#0d1117] px-4 py-1 text-xs font-semibold tracking-widest uppercase'>
            {locale === 'en'
              ? 'Find Your Perfect Category'
              : 'Encuentra tu Categoría Ideal'}
          </span>

          <div className='flex flex-wrap justify-center gap-3'>
            {FILTER_CATEGORIES.map((cat) => {
              const isActive = activeFilter === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => handleFilterChange(cat.key)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-[#E6C200] text-[#0d1117] shadow-md scale-105'
                      : 'bg-white text-neutral-600 border border-neutral-300 hover:border-[#E6C200] hover:text-[#E6C200]'
                  }`}>
                  {locale === 'en' ? cat.labelEn : cat.labelEs}
                </button>
              );
            })}
          </div>
        </div>

        <div className='relative w-full'>
          {filteredTours.length > 0 ? (
            <div className='overflow-hidden'>
              <div
                key={`${locale || 'default'}-${activeFilter}-${filteredTours.length}`}
                ref={sliderRef}
                className='keen-slider section-all-tours-slider'
                style={{ cursor: 'grab' }}>
                {filteredTours.map((tour, idx) => {
                  const tourImage = getTourImage(tour);
                  const tourAlt = getTourAlt(tour);
                  const tourCategory = getTourTag(tour, locale);
                  const discountedPrice = getTourPrice(tour);

                  return (
                    <div
                      className='keen-slider__slide'
                      key={tour._id || tour.slug || idx}
                      style={{ minWidth: 0 }}
                      aria-label={`Tour ${idx + 1} ${locale === 'en' ? 'of' : 'de'} ${filteredTours.length}`}>
                      <div className='relative rounded-2xl overflow-hidden group shadow-md bg-black'>
                        <img
                          src={tourImage}
                          alt={tourAlt}
                          loading='lazy'
                          className='w-full h-[420px] object-cover transition-transform duration-700 group-hover:scale-105 group-hover:brightness-110'
                        />

                        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent' />

                        {tour.discount > 0 && (
                          <Link
                            href={`/${tour.category}/${tour.slug}`}
                            locale={locale}
                            className='absolute top-4 left-4 z-20 bg-amber-400 text-neutral-900 text-xs font-bold px-3 py-1 rounded-full hover:bg-amber-300 transition-colors'
                            aria-label={`${locale === 'en' ? 'See trip with discount' : 'Ver viaje con descuento'}: ${tour.title}`}>
                            -{tour.discount}%
                          </Link>
                        )}

                        <Link
                          href={`/${tour.category}/${tour.slug}`}
                          locale={locale}
                          className='absolute top-4 right-4 z-20 inline-flex items-center rounded-full border border-white/60 bg-black/40 backdrop-blur-sm text-white text-xs font-semibold px-4 py-2 hover:bg-black/60 transition-colors'
                          aria-label={`${locale === 'en' ? 'View trip' : 'Ver viaje'}: ${tour.title}`}>
                          {locale === 'en' ? 'View Trip' : 'Ver Viaje'}
                        </Link>

                        <div className='absolute bottom-0 p-6 w-full text-white'>
                          <span className='text-xs uppercase tracking-widest text-amber-400 font-semibold mb-2 block'>
                            {tourCategory}
                          </span>
                          <h3 className='text-xl font-semibold leading-snug mb-3 uppercase'>
                            {tour.title}
                          </h3>
                          <div className='flex items-center justify-between text-sm text-neutral-200'>
                            <span>{tour.duration}</span>
                            <span className='font-bold text-amber-400'>
                              {locale === 'en' ? 'From' : 'Desde'} $
                              {discountedPrice}
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
                {locale === 'en'
                  ? 'No tours available in this category yet'
                  : 'Aun no hay tours disponibles en esta categoria'}
              </h3>
              <p className='mt-3 text-neutral-600'>
                {locale === 'en'
                  ? 'Choose another category to explore more experiences in Peru.'
                  : 'Selecciona otra categoria para explorar mas experiencias en Peru.'}
              </p>
            </div>
          )}
        </div>

        {totalDots > 0 && (
          <div className='flex justify-center mt-10 gap-3'>
            {Array.from({ length: totalDots }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  realIndex === idx
                    ? 'bg-amber-400 scale-125'
                    : 'bg-neutral-300 hover:bg-neutral-400'
                }`}
                aria-label={`${locale === 'en' ? 'Go to slide' : 'Ir a slide'} ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
