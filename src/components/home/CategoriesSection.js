import { useState } from 'react';
import { useRouter } from 'next/router';
import { useKeenSlider } from 'keen-slider/react';
import Link from 'next/link';
import { getCategoryTitle } from '../../utils/categoryHelpers';
import { getCategoryImage } from '../../utils/imageUtils';
import en from '../../lang/en/home';
import es from '../../lang/es/home';

// Definición de las categorías disponibles (13 categorías 2026)
const categories = [
  'inca-trail',
  'salkantay',
  'machupicchu',
  'day-tours',
  'peru-packages',
  'rainbow-mountain',
  'ausangate',
  'inca-jungle',
  'choquequirao',
  'sacred-lakes',
  'luxury-glamping',
  'family-tours',
  'sustainable-tours',
];

export default function CategoriesSection() {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'en' ? en : es;
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
      mode: 'snap',
      rtl: false,
      slides: {
        perView: 1,
        spacing: 16,
      },
      breakpoints: {
        '(min-width: 640px)': {
          slides: { perView: 2, spacing: 20 },
        },
        '(min-width: 1024px)': {
          slides: { perView: 3, spacing: 30 },
        },
        '(min-width: 1400px)': {
          slides: { perView: 4, spacing: 40 },
        },
      },
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
    },
    [
      (slider) => {
        let timeout;
        let mouseOver = false;
        function clearNextTimeout() {
          clearTimeout(timeout);
        }
        function nextTimeout() {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => {
            slider.next();
          }, 4000); // Cambia cada 4 segundos
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
      },
    ],
  );

  return (
    <section className='categories-section'>
      <div className='categories-container'>
        {/* Header */}
        <div className='categories-header'>
          <span className='section-label'>{t.the_collection}</span>
          <h2 className='section-title'>{t.curated_adventures}</h2>
          <p className='section-subtitle'>{t.curated_adventures_subtitle}</p>
        </div>

        {/* Slider */}
        <div className='categories-carousel-wrapper'>
          <div ref={sliderRef} className='keen-slider categories-carousel'>
            {categories.map((categorySlug, idx) => {
              const title = getCategoryTitle(categorySlug, locale);
              const image = getCategoryImage(categorySlug, 'hero');
              const indexStr = (idx + 1).toString().padStart(2, '0');
              const isCenter = currentSlide === idx;

              return (
                <div
                  className={`keen-slider__slide ${isCenter ? 'center-slide' : ''}`}
                  key={categorySlug}>
                  <Link href={`/${categorySlug}`} className='category-card'>
                    <div className='category-card-image'>
                      <img src={image} alt={title} loading='lazy' />
                    </div>
                    <div className='category-card-overlay'></div>

                    {/* Decorative Number */}
                    <div className='category-card-index'>{indexStr}</div>

                    <div className='category-card-content'>
                      <h3 className='category-card-title'>{title}</h3>
                      <span className='category-card-cta'>
                        {t.discover}
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth={2}
                          stroke='currentColor'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3'
                          />
                        </svg>
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation - Centered below carousel */}
        <div className='categories-carousel-nav'>
          <button
            onClick={() => instanceRef.current?.prev()}
            className='nav-arrow'
            aria-label='Previous slide'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'>
              <path
                fillRule='evenodd'
                d='M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z'
                clipRule='evenodd'
              />
            </svg>
          </button>

          <div className='nav-dots'>
            {categories.slice(0, 8).map((_, idx) => (
              <button
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                className={`nav-dot ${currentSlide === idx ? 'active' : ''}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => instanceRef.current?.next()}
            className='nav-arrow'
            aria-label='Next slide'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'>
              <path
                fillRule='evenodd'
                d='M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z'
                clipRule='evenodd'
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
