'use client';

import { useState, useRef } from 'react';
import parse from 'html-react-parser';
import DOMPurify from 'isomorphic-dompurify';

// Icono de 3 huellas de pie - más estrechas y alargadas para mejor visibilidad
const FootprintIcon = ({ isActive }) => (
  <svg
    viewBox='0 0 40 40'
    fill='currentColor'
    className={`w-9 h-9 transition-all duration-300 ${isActive ? 'text-primary' : 'text-stone-400'}`}>
    {/* Huella 3 - ABAJO DERECHA (primer paso) */}
    <g
      className={isActive ? 'animate-step-1' : ''}
      style={{ transformOrigin: '30px 32px' }}>
      {/* Planta del pie - óvalo vertical alargado y estrecho */}
      <ellipse cx='30' cy='34' rx='3' ry='5' opacity={isActive ? 1 : 0.5} />
      {/* 5 dedos del pie - más compactos */}
      <circle cx='27' cy='28.5' r='1.4' opacity={isActive ? 1 : 0.5} />
      <circle cx='29' cy='27.5' r='1.2' opacity={isActive ? 1 : 0.5} />
      <circle cx='31' cy='27' r='1.1' opacity={isActive ? 1 : 0.5} />
      <circle cx='33' cy='27.5' r='1' opacity={isActive ? 1 : 0.5} />
      <circle cx='34.5' cy='28.5' r='0.9' opacity={isActive ? 1 : 0.5} />
    </g>

    {/* Huella 2 - MEDIO IZQUIERDA (segundo paso) */}
    <g
      className={isActive ? 'animate-step-2' : ''}
      style={{ transformOrigin: '10px 20px' }}>
      <ellipse cx='10' cy='22' rx='3' ry='5' opacity={isActive ? 1 : 0.5} />
      <circle cx='7' cy='16.5' r='1.4' opacity={isActive ? 1 : 0.5} />
      <circle cx='9' cy='15.5' r='1.2' opacity={isActive ? 1 : 0.5} />
      <circle cx='11' cy='15' r='1.1' opacity={isActive ? 1 : 0.5} />
      <circle cx='13' cy='15.5' r='1' opacity={isActive ? 1 : 0.5} />
      <circle cx='14.5' cy='16.5' r='0.9' opacity={isActive ? 1 : 0.5} />
    </g>

    {/* Huella 1 - ARRIBA DERECHA (tercer paso - termina aquí subiendo) */}
    <g
      className={isActive ? 'animate-step-3' : ''}
      style={{ transformOrigin: '30px 8px' }}>
      <ellipse cx='30' cy='10' rx='3' ry='5' opacity={isActive ? 1 : 0.5} />
      <circle cx='27' cy='4.5' r='1.4' opacity={isActive ? 1 : 0.5} />
      <circle cx='29' cy='3.5' r='1.2' opacity={isActive ? 1 : 0.5} />
      <circle cx='31' cy='3' r='1.1' opacity={isActive ? 1 : 0.5} />
      <circle cx='33' cy='3.5' r='1' opacity={isActive ? 1 : 0.5} />
      <circle cx='34.5' cy='4.5' r='0.9' opacity={isActive ? 1 : 0.5} />
    </g>
  </svg>
);

export default function AccordionFromHtml({ htmlContent }) {
  const blocks = htmlContent
    .split(/<h3>/i)
    .filter(Boolean)
    .map((part) => `<h3>${part.trim()}`);

  const [activeIndex, setActiveIndex] = useState(null);
  const itemRefs = useRef([]);

  const getFixedOffset = () => {
    const isMobile = window.matchMedia('(max-width: 1024px)').matches;
    let offset = 0;
    if (isMobile) {
      const nav = document.getElementById('navbarMobile');
      offset = nav?.offsetHeight || 0;
    } else {
      const desktopNav = document.getElementById('navbarDesktop');
      const fullNav = desktopNav?.closest('nav');
      offset = (fullNav?.offsetHeight || desktopNav?.offsetHeight || 0) + 15;
    }
    // Add sticky tab bar height
    const stickyTabBar = document
      .querySelector('[role="tablist"]')
      ?.closest('.sticky');
    if (stickyTabBar) {
      offset += stickyTabBar.offsetHeight;
    }
    return offset;
  };

  const toggleAccordion = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
      requestAnimationFrame(() => {
        const el = itemRefs.current[index];
        if (el) {
          const top =
            el.getBoundingClientRect().top +
            window.scrollY -
            getFixedOffset() -
            10;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    }
  };

  return (
    <>
      <style jsx global>{`
        /* Huella de abajo (primer paso) */
        @keyframes step1 {
          0%,
          8% {
            opacity: 1;
            transform: scale(1.3);
            filter: drop-shadow(0 2px 6px rgba(30, 86, 49, 0.7));
          }
          25%,
          100% {
            opacity: 0.4;
            transform: scale(1);
            filter: none;
          }
        }

        /* Huella del medio (segundo paso) */
        @keyframes step2 {
          0%,
          30% {
            opacity: 0.4;
            transform: scale(1);
            filter: none;
          }
          35%,
          45% {
            opacity: 1;
            transform: scale(1.3);
            filter: drop-shadow(0 2px 6px rgba(30, 86, 49, 0.7));
          }
          60%,
          100% {
            opacity: 0.4;
            transform: scale(1);
            filter: none;
          }
        }

        /* Huella de arriba (tercer paso) */
        @keyframes step3 {
          0%,
          65% {
            opacity: 0.4;
            transform: scale(1);
            filter: none;
          }
          70%,
          80% {
            opacity: 1;
            transform: scale(1.3);
            filter: drop-shadow(0 2px 6px rgba(30, 86, 49, 0.7));
          }
          95%,
          100% {
            opacity: 0.4;
            transform: scale(1);
            filter: none;
          }
        }

        @keyframes glowPulse {
          0%,
          100% {
            box-shadow:
              0 0 10px rgba(251, 184, 0, 0.6),
              0 0 25px rgba(251, 184, 0, 0.3);
          }
          50% {
            box-shadow:
              0 0 20px rgba(251, 184, 0, 0.8),
              0 0 40px rgba(251, 184, 0, 0.5);
          }
        }

        .animate-step-1 {
          animation: step1 2.4s ease-in-out infinite;
        }

        .animate-step-2 {
          animation: step2 2.4s ease-in-out infinite;
        }

        .animate-step-3 {
          animation: step3 2.4s ease-in-out infinite;
        }

        .icon-container-active {
          animation: glowPulse 2s ease-in-out infinite;
        }

        .accordion-item-modern {
          transition: all 0.3s ease;
        }

        .accordion-item-modern:hover .accordion-header-modern {
          background: linear-gradient(
            135deg,
            rgba(251, 184, 0, 0.12) 0%,
            rgba(251, 184, 0, 0.06) 100%
          );
          transform: translateX(4px);
        }

        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(-15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .content-animated {
          animation: fadeSlideIn 0.4s ease-out;
        }
      `}</style>

      <div className='relative py-4'>
        {/* Línea vertical del timeline */}
        <div
          className='absolute left-7 top-10 bottom-10 w-1 rounded-full'
          style={{
            zIndex: 0,
            background:
              'linear-gradient(180deg, #fbb800 0%, #1e5631 50%, #fbb800 100%)',
            opacity: 0.5,
          }}
        />

        {blocks.map((block, index) => {
          const match = block.match(/<h3>(.*?)<\/h3>/i);
          let title = `Sección ${index + 1}`;
          let contentHtml = block;

          if (match) {
            title = match[1];
            contentHtml = block.replace(match[0], '');
          }

          const isActive = activeIndex === index;

          return (
            <div
              key={index}
              ref={(el) => (itemRefs.current[index] = el)}
              className='accordion-item-modern relative pl-16 pb-5 last:pb-0'>
              <div
                className={`absolute left-0 top-3 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isActive
                    ? 'bg-gradient-to-br from-secondary to-yellow-400 border-3 border-primary icon-container-active'
                    : 'bg-white border-2 border-stone-200 hover:border-secondary hover:bg-secondary/10 hover:scale-105'
                }`}
                style={{
                  zIndex: 1,
                  borderWidth: isActive ? '3px' : '2px',
                }}>
                <FootprintIcon isActive={isActive} />
              </div>
              <div
                onClick={() => toggleAccordion(index)}
                className={`accordion-header-modern cursor-pointer rounded-xl p-2 transition-all duration-300 border-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-secondary/25 to-secondary/10 border-primary shadow-lg shadow-primary/15'
                    : 'bg-stone-50/80 border-transparent hover:border-secondary/50'
                }`}>
                <div className='flex items-center justify-between '>
                  <h3
                    className={`text-lg font-bold transition-colors duration-300 leading-tight ${
                      isActive ? 'text-primary' : 'text-stone-700'
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(title),
                    }}
                  />

                  <div
                    className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-400 ${
                      isActive
                        ? 'bg-primary rotate-180 '
                        : 'bg-stone-200 hover:bg-stone-300'
                    }`}>
                    <svg
                      className={`w-5 h-5 transition-all duration-300 ${
                        isActive ? 'text-secondary' : 'text-stone-500'
                      }`}
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      strokeWidth={2.5}>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M19 9l-7 7-7-7'
                      />
                    </svg>
                  </div>
                </div>
              </div>
              {isActive && (
                <div className='content-animated mt-3 p-5 rounded-xl bg-white border border-stone-100 shadow-md'>
                  <div className='text-stone-600 leading-relaxed prose prose-sm max-w-none'>
                    {parse(contentHtml)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
