import { useEffect, useState, useMemo, useCallback } from 'react';
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
  let mouseOver = false;

  const clearNextTimeout = () => clearTimeout(timeout);

  const nextTimeout = () => {
    clearTimeout(timeout);
    if (mouseOver) return;

    timeout = setTimeout(() => {
      if (slider?.track?.details) {
        slider.next();
      }
    }, 4000);
  };

  slider.on('created', () => {
    const onMouseOver = () => {
      mouseOver = true;
      clearNextTimeout();
    };

    const onMouseOut = () => {
      mouseOver = false;
      nextTimeout();
    };

    slider.container.addEventListener('mouseover', onMouseOver);
    slider.container.addEventListener('mouseout', onMouseOut);

    nextTimeout();

    slider.on('destroyed', () => {
      slider.container.removeEventListener('mouseover', onMouseOver);
      slider.container.removeEventListener('mouseout', onMouseOut);
      clearNextTimeout();
    });
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

  const sliderOptions = useMemo(
    () => ({
      loop: filteredTours.length > 1,
      slides: { perView: 1.12, spacing: 14, origin: 'center' },
      created(slider) {
        setCurrentSlide(slider.track.details?.rel ?? 0);
      },
      slideChanged(slider) {
        setCurrentSlide(slider.track.details?.rel ?? 0);
      },
    }),
    [filteredTours.length],
  );

  const [sliderRef, instanceRef] = useKeenSlider(sliderOptions, [
    AutoplayPlugin,
  ]);

  useEffect(() => {
    if (!instanceRef.current) return;

    const rafId = window.requestAnimationFrame(() => {
      instanceRef.current?.update();
      instanceRef.current?.moveToIdx(0, true);
      setCurrentSlide(0);
    });

    return () => window.cancelAnimationFrame(rafId);
  }, [locale, activeFilter, filteredTours.length, instanceRef]);

  const totalDots = filteredTours.length;
  const realIndex = totalDots > 0 ? currentSlide % totalDots : 0;

  return (
    <section
      id={sectionId}
      className='relative w-full overflow-hidden py-10'
      aria-roledescription='carousel'
      aria-label={
        locale === 'en' ? 'Featured Adventures' : 'Aventuras Destacadas'
      }>
      <div className='mx-auto px-4'>
        <div className='mb-4 flex flex-col items-center gap-2 text-center'>
          <span className='inline-flex items-center rounded-full bg-[#E6C20026] px-4 py-1 text-xs font-semibold uppercase tracking-widest text-[#0d1117]'>
            {locale === 'en' ? 'Explore Peru' : 'Explora Perú'}
          </span>

          <h2 className='m-0 text-2xl font-semibold tracking-tight text-neutral-900'>
            {locale === 'en'
              ? 'Unforgettable Experiences in Peru'
              : 'Experiencias Inolvidables en Perú'}
          </h2>

          <p className='text-sm text-neutral-600'>
            {locale === 'en'
              ? 'A selection of routes, culture and adventure that reveal the best of Peru. Hike among ancestral mountains, discover cities full of history and experience landscapes that seem painted by the Andes.'
              : 'Una selección de rutas, cultura y aventura que revelan lo mejor del Perú. Camina entre montañas ancestrales, descubre ciudades llenas de historia y vive paisajes que parecen pintados por la cordillera.'}
          </p>

          <span className='inline-flex items-center rounded-full bg-[#E6C20026] px-4 py-1 text-xs font-semibold uppercase tracking-widest text-[#0d1117]'>
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
                  type='button'
                  onClick={() => handleFilterChange(cat.key)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold ${
                    isActive
                      ? 'bg-[#E6C200] text-[#0d1117]'
                      : 'border border-neutral-300 bg-white text-neutral-600'
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
                ref={sliderRef}
                className='keen-slider section-all-tours-slider'
                style={{ cursor: 'grab' }}>
                {filteredTours.map((tour, idx) => {
                  const tourImage = getTourImage(tour);
                  const tourAlt = getTourAlt(tour);
                  const tourCategory = getTourTag(tour, locale);
                  const discountedPrice = getTourPrice(tour);
                  const href = `/${tour.category}/${tour.slug}`;

                  return (
                    <div
                      className='keen-slider__slide'
                      key={tour._id || tour.slug || idx}
                      style={{ minWidth: 0 }}
                      aria-label={`Tour ${idx + 1} ${locale === 'en' ? 'of' : 'de'} ${filteredTours.length}`}>
                      <article className='relative overflow-hidden rounded-2xl bg-black shadow-md'>
                        <div className='relative h-[360px] w-full'>
                          <Image
                            src={tourImage}
                            alt={tourAlt}
                            fill
                            className='object-cover'
                            sizes='(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 360px'
                            quality={70}
                            priority={idx === 0}
                          />
                        </div>

                        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent' />

                        {tour.discount > 0 && (
                          <Link
                            href={href}
                            locale={locale}
                            className='absolute left-4 top-4 z-20 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-neutral-900 transition-colors hover:bg-amber-300'
                            aria-label={`${locale === 'en' ? 'See trip with discount' : 'Ver viaje con descuento'}: ${tour.title}`}>
                            -{tour.discount}%
                          </Link>
                        )}

                        <Link
                          href={href}
                          locale={locale}
                          className='absolute right-4 top-4 z-20 inline-flex items-center rounded-full border border-white/60 bg-black/40 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm'
                          aria-label={`${locale === 'en' ? 'View trip' : 'Ver viaje'}: ${tour.title}`}>
                          {locale === 'en' ? 'View Trip' : 'Ver Viaje'}
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
                              {locale === 'en' ? 'From' : 'Desde'} $
                              {discountedPrice}
                            </span>
                          </div>
                        </div>
                      </article>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className='mx-2 rounded-[1.5rem] border border-neutral-200 bg-white p-6 text-center shadow-sm'>
              <h3 className='text-xl font-semibold text-neutral-900'>
                {locale === 'en'
                  ? 'No tours available in this category yet'
                  : 'Aún no hay tours disponibles en esta categoría'}
              </h3>
              <p className='mt-3 text-neutral-600'>
                {locale === 'en'
                  ? 'Choose another category to explore more experiences in Peru.'
                  : 'Selecciona otra categoría para explorar más experiencias en Perú.'}
              </p>
            </div>
          )}
        </div>

        {totalDots > 1 && (
          <div className='mt-4 flex justify-center gap-4'>
            {Array.from({ length: totalDots }).map((_, idx) => (
              <button
                key={idx}
                type='button'
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                className={`h-4 w-4 rounded-full ${
                  realIndex === idx ? 'bg-amber-400' : 'bg-neutral-300'
                }`}
                aria-label={`${locale === 'en' ? 'Go to slide' : 'Ir al slide'} ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
