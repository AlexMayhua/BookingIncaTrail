import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import en from '../../lang/en/home';
import es from '../../lang/es/home';
import {
  FiAward,
  FiCompass,
  FiGlobe,
  FiMap,
  FiMapPin,
  FiSliders,
} from 'react-icons/fi';
import Image from 'next/image';

const FEATURE_ITEMS = {
  en: [
    {
      title: 'DIRECT AND FAIR RATES',
      description: 'Transparent prices with no middlemen and no hidden fees.',
      Icon: FiGlobe,
    },
    {
      title: 'FIELD EXPERIENCE',
      description: 'Years guiding real routes with on-the-ground local expertise.',
      Icon: FiMapPin,
    },
    {
      title: 'LOCAL AND DIRECT OPERATOR',
      description: 'You book directly with our local team in Cusco.',
      Icon: FiCompass,
    },
    {
      title: 'SUSTAINABLE AND RESPONSIBLE TRAVEL',
      description: 'Responsible operations that support communities and nature.',
      Icon: FiMap,
    },
    {
      title: 'SMALL AND PERSONALIZED GROUPS',
      description: 'Small groups for better pacing, care, and personalized support.',
      Icon: FiSliders,
    },
    {
      title: 'EXCLUSIVE TRIPS AND ITINERARIES',
      description: 'Handcrafted itineraries designed around your travel goals.',
      Icon: FiAward,
    },
  ],
  es: [
    {
      title: 'TARIFAS DIRECTAS Y JUSTAS',
      description: 'Precios transparentes, sin intermediarios ni cargos ocultos.',
      Icon: FiGlobe,
    },
    {
      title: 'EXPERIENCIA EN EL CAMPO',
      description: 'Anos guiando rutas reales con conocimiento local en terreno.',
      Icon: FiMapPin,
    },
    {
      title: 'OPERADOR LOCAL Y DIRECTO',
      description: 'Reservas directamente con nuestro equipo local en Cusco.',
      Icon: FiCompass,
    },
    {
      title: 'VIAJES SOSTENIBLES Y RESPONSABLES',
      description: 'Operamos de forma responsable con las comunidades y el entorno.',
      Icon: FiMap,
    },
    {
      title: 'GRUPOS PEQUENOS Y PERSONALIZADOS',
      description: 'Grupos reducidos para una mejor experiencia y atencion cercana.',
      Icon: FiSliders,
    },
    {
      title: 'VIAJES E ITINERARIOS EXCLUSIVOS',
      description: 'Itinerarios disenados a medida segun tu estilo de viaje.',
      Icon: FiAward,
    },
  ],
};

export default function Section1() {
  const { locale } = useRouter();
  const isEnglish = locale === 'en';
  const t = isEnglish ? en : es;
  const features = useMemo(
    () => (isEnglish ? FEATURE_ITEMS.en : FEATURE_ITEMS.es),
    [isEnglish],
  );
  const [activeFeature, setActiveFeature] = useState(0);
  const [expandedFeature, setExpandedFeature] = useState(0);
  const currentFeature = features[activeFeature] || features[0];

  const handleMobileToggle = (index) => {
    setActiveFeature(index);
    setExpandedFeature((prev) => (prev === index ? prev : index));
  };

  return (
    <section className='relative overflow-hidden '>
      <div className='relative mx-auto max-w-7xl px-5 lg:px-8'>
        <div className='mx-auto max-w-2xl text-center '>
          <span className='inline-flex rounded-full bg-[#E6C20026] px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#0d1117]'>
            {isEnglish ? 'Your Trusted Partner' : 'Tu Socio de Confianza'}
          </span>
          <h2 className='mt-4 text-3xl font-semibold tracking-tight text-black md:text-4xl'>
            {t.h2_title_why}
          </h2>
          <p className='mt-3 text-sm leading-relaxed text-gray-400 md:text-base'>
            {t.h3_subtitle}
          </p>
        </div>

        <div className='lg:hidden'>
          <div className='flex flex-col gap-3 md:hidden'>
            {features.map(({ title, description, Icon }, index) => {
              const isExpanded = expandedFeature === index;

              return (
                <article
                  key={title}
                  className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'>
                  <button
                    type='button'
                    onClick={() => handleMobileToggle(index)}
                    className='flex w-full items-center gap-3 px-4 py-3 text-left transition hover:border-amber-300 hover:shadow-md'
                    aria-expanded={isExpanded}>
                    <span className='inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[#e6c200]'>
                      <Icon size={20} />
                    </span>
                    <span className='text-sm font-semibold text-slate-800'>
                      {title}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className='px-4 pb-4 text-sm leading-relaxed text-slate-600'>
                      {description}
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          <div className='mt-2 hidden grid-cols-2 gap-4 md:grid'>
            {features.map(({ title, description, Icon }, index) => {
              const isExpanded = expandedFeature === index;

              return (
                <article key={title} className='overflow-hidden'>
                  <button
                    type='button'
                    onClick={() => handleMobileToggle(index)}
                    className='w-full p-5 text-center transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md'
                    aria-expanded={isExpanded}>
                    <span className='mx-auto inline-flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-[#e6c200]'>
                      <Icon size={22} />
                    </span>
                    <p className='mt-3 text-sm font-semibold text-slate-800'>
                      {title}
                    </p>
                  </button>

                  {isExpanded && (
                    <div className='px-4 pb-4 text-center text-sm leading-relaxed text-slate-600'>
                      {description}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>

        <div className='relative mx-auto hidden h-[640px] w-[640px] lg:block'>
          <div className='absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200/90' />

          {features.map(({ title, Icon }, index) => {
            const angle = (360 / features.length) * index - 90;
            const radians = (angle * Math.PI) / 180;
            const radius = 240;
            const x = Math.cos(radians) * radius;
            const y = Math.sin(radians) * radius;
            const isActive = activeFeature === index;

            return (
              <button
                key={title}
                type='button'
                onMouseEnter={() => setActiveFeature(index)}
                onFocus={() => setActiveFeature(index)}
                onClick={() => setActiveFeature(index)}
                className='group absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center'
                style={{
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                }}>
                <span
                  className={`mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full border transition ${
                    isActive
                      ? 'border-amber-300 bg-amber-100 text-[#e6c200] shadow-lg shadow-amber-200/70'
                      : 'border-slate-200 bg-white text-slate-600 shadow-md group-hover:border-amber-300 group-hover:text-[#e6c200]'
                  }`}>
                  <Icon size={28} />
                </span>
                <span
                  className={`mt-2 block w-40 text-sm font-semibold leading-tight transition ${
                    isActive
                      ? 'text-slate-900'
                      : 'text-slate-700 group-hover:text-slate-900'
                  }`}>
                  {title}
                </span>
              </button>
            );
          })}

          <div className='absolute left-1/2 top-1/2 w-[300px] -translate-x-1/2 -translate-y-1/2 p-6 text-center'>
            <div className='relative mx-auto h-12 w-36 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]'>
              <Image
                src='/assets/logo-Booking.svg'
                alt='Logo BookingIncaTrail'
                fill
                sizes='48px'
                className='object-contain'
                priority
              />
            </div>

            <p className='mt-4 text-sm font-semibold uppercase text-[#F4B400]'>
              {currentFeature?.title}
            </p>
            <p className='mt-2 text-base leading-relaxed text-slate-600'>
              {currentFeature?.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
