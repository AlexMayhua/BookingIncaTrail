import { useMemo } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { getFeaturedTours } from './tourCategories';
import { TOUR_SECTIONS } from './tour1/constants';
import { renderHighlightedText } from './tour1/renderHighlightedText';
import Tour1Section from './tour1/Tour1Section';
import { getUniqueTours, matchesTerms } from './tour1/utils';

export default function Tour1({ tours = [] }) {
  const { locale } = useRouter();

  const heroTitle =
    locale === 'en'
      ? 'Your trusted local operator for the Inca Trail'
      : 'Tu operador local de confianza para el Camino Inca';

  const heroDescription =
    locale === 'en'
      ? 'At **Booking Inca Trail**, we specialize in the **Inca Trail** and iconic routes such as the **Salkantay Trek** and the **Ausangate Trek**. We combine **local expertise**, **certified guides**, and **24/7 personalized support** to accompany you at every stage of your journey to **Machu Picchu**, with **small groups** and a carefully organized service.'
      : 'En **Booking Inca Trail** somos especialistas en el **Camino Inca** y en rutas iconicas como **Salkantay Trek** y **Ausangate Trek**. Combinamos **experiencia local**, **guias certificados** y **atencion personalizada 24/7** para acompanarte en cada etapa de tu viaje hacia **Machu Picchu**, con **grupos pequenos** y un servicio cuidadosamente organizado.';

  const toursBySection = useMemo(() => {
    return TOUR_SECTIONS.map((section) => {
      const sectionTours = getUniqueTours(
        tours.filter((tour) => matchesTerms(tour, section.terms)),
      );

      return {
        ...section,
        tours: getFeaturedTours(sectionTours, 12),
      };
    });
  }, [tours]);

  return (
    <section className='w-full px-5 py-12 lg:px-12'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-12'>
        <div className='space-y-3 text-center'>
          <span className='inline-flex rounded-full bg-[#E6C20026] px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[#0d1117]'>
            {locale === 'en' ? 'Explore Peru' : 'Explora Peru'}
          </span>
          <h2 className='m-0 text-2xl font-semibold text-black md:text-3xl'>
            {heroTitle}
          </h2>
          <p className='mx-auto max-w-2xl text-sm text-black/65'>
            {renderHighlightedText(heroDescription)}
          </p>
        </div>

        <div className='mx-auto grid w-full max-w-2xl grid-cols-3 items-center gap-2 sm:gap-4'>
          <div className='flex justify-center'>
            <Image
              src='/assets/icon/Google-Booking-Inca-Trail.webp'
              alt='Google reviews'
              width={140}
              height={48}
              sizes='(min-width: 1024px) 140px, (min-width: 640px) 110px, 80px'
              className='h-auto w-[80px] sm:w-[110px] lg:w-[140px]'
            />
          </div>
          <div className='flex justify-center'>
            <Image
              src='/assets/icon/Tripadvisor-Booking-Inca-Trail.webp'
              alt='Tripadvisor reviews'
              width={140}
              height={48}
              sizes='(min-width: 1024px) 140px, (min-width: 640px) 110px, 80px'
              className='h-auto w-[80px] sm:w-[110px] lg:w-[140px]'
            />
          </div>
          <div className='flex justify-center'>
            <Image
              src='/assets/icon/Trustpilot-Booking-Inca-Trail.webp'
              alt='Trustpilot reviews'
              width={140}
              height={48}
              sizes='(min-width: 1024px) 140px, (min-width: 640px) 110px, 80px'
              className='h-auto w-[80px] sm:w-[110px] lg:w-[140px]'
            />
          </div>
        </div>

        {toursBySection.map((section) => (
          <Tour1Section key={section.key} section={section} locale={locale} />
        ))}
      </div>
    </section>
  );
}
