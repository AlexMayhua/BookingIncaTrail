import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Tour1Card from './Tour1Card';

function hashText(value = '') {
  return Array.from(String(value)).reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0,
  );
}

export default function Tour1Slider({ tours, locale, sectionKey = '' }) {
  const keyHash = useMemo(() => hashText(sectionKey), [sectionKey]);
  const autoplayDelay = 4200 + (keyHash % 4) * 650;
  const autoplayStartOffset = 350 + (keyHash % 5) * 320;
  const transitionDuration = 24 + (keyHash % 6);

  const autoplay = useRef(
    Autoplay({
      delay: autoplayDelay,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      playOnInit: false,
    }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      slidesToScroll: 1,
      duration: transitionDuration,
    },
    [autoplay.current],
  );

  const canSlide = tours.length > 1;

  const [activeIndex, setActiveIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) {
      return;
    }

    setActiveIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) {
      return undefined;
    }

    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) {
      return undefined;
    }

    const getAutoplayPlugin = () => emblaApi.plugins()?.autoplay;
    const autoplayPlugin = getAutoplayPlugin();

    if (!autoplayPlugin) {
      return undefined;
    }

    if (!canSlide) {
      autoplayPlugin.stop();
      return undefined;
    }

    const timer = setTimeout(() => {
      const latestAutoplayPlugin = getAutoplayPlugin();

      if (!latestAutoplayPlugin || emblaApi.slideNodes().length <= 1) {
        return;
      }

      try {
        latestAutoplayPlugin.play();
      } catch {
        // Ignore transient autoplay start errors during carousel re-initialization.
      }
    }, autoplayStartOffset);

    return () => {
      clearTimeout(timer);

      const latestAutoplayPlugin = getAutoplayPlugin();

      if (latestAutoplayPlugin) {
        latestAutoplayPlugin.stop();
      }
    };
  }, [autoplayStartOffset, canSlide, emblaApi, sectionKey]);

  const goPrev = () => {
    if (!emblaApi || !canSlide) {
      return;
    }

    emblaApi.scrollPrev();
  };

  const goNext = () => {
    if (!emblaApi || !canSlide) {
      return;
    }

    emblaApi.scrollNext();
  };

  const goTo = (targetIndex) => {
    if (!emblaApi) {
      return;
    }

    emblaApi.scrollTo(targetIndex);
  };

  return (
    <div>
      <div className='overflow-hidden' ref={emblaRef}>
        <div className='flex'>
          {tours.map((tour) => (
            <div
              key={tour._id || tour.slug}
              className='min-w-0 flex-[0_0_100%] px-1 sm:px-2 lg:flex-[0_0_33.3333%] lg:px-3 my-2'>
              <Tour1Card tour={tour} locale={locale} />
            </div>
          ))}
        </div>
      </div>

      <div className='flex flex-nowrap justify-center py-2'>
        <button
          type='button'
          onClick={goPrev}
          disabled={!canSlide}
          aria-label={locale === 'en' ? 'Previous slide' : 'Slide anterior'}
          className='inline-flex h-9 w-9 items-center justify-center rounded-full bg-yellow text-black transition hover:border-black/35 hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40'>
          <svg viewBox='0 0 24 24' className='h-4 w-4' aria-hidden='true'>
            <path
              d='M15 6 9 12l6 6'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>

        <div className='flex flex-wrap items-center justify-center gap-2'>
          {tours.map((tour, pinIndex) => {
            const isActive = activeIndex === pinIndex;

            return (
              <button
                key={tour._id || tour.slug}
                type='button'
                onClick={() => goTo(pinIndex)}
                className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] transition ${
                  isActive
                    ? 'border-[#B8860B] bg-[#E6C20026] text-[#8A6500]'
                    : 'border-black/10 text-black/70 hover:border-black/35'
                }`}
                aria-current={isActive ? 'true' : undefined}
                aria-label={`${locale === 'en' ? 'Go to' : 'Ir a'} ${tour.title}`}>
                {pinIndex + 1}
              </button>
            );
          })}
        </div>

        <button
          type='button'
          onClick={goNext}
          disabled={!canSlide}
          aria-label={locale === 'en' ? 'Next slide' : 'Siguiente slide'}
          className='inline-flex h-9 w-9 items-center justify-center rounded-full bg-yellow text-black transition hover:border-black/35 hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40'>
          <svg viewBox='0 0 24 24' className='h-4 w-4' aria-hidden='true'>
            <path
              d='m9 6 6 6-6 6'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
