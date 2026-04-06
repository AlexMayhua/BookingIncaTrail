import Image from 'next/image';
import Link from 'next/link';
import parser from 'html-react-parser';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function TourPanel({ items, title }) {
  const { locale } = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  const active = items[activeIndex];

  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white rounded-xl p-6 max-w-7xl mx-auto'>
      <div className='space-y-2 2xl:space-y-3'>
        <div>
          <p className='text-sm 2xl:text-lg font-bold text-primary uppercase'>{title}</p>
        </div>
        {items.map((item, i) => (
          <button
            key={item.id}
            onMouseEnter={() => setActiveIndex(i)}
            onClick={() => setActiveIndex(i)}
            className={[
              'block w-full rounded-lg text-left transition-all duration-200',
            ].join(' ')}>
            <p
              className={`border-l-4 p-1 2xl:p-2 transition ${
                i === activeIndex
                  ? 'text-primary font-bold border-l-yellow '
                  : 'text-stone-600 group-hover:text-primary'
              }`}>
              {item.title}
            </p>
          </button>
        ))}
      </div>

      <div className='rounded-xl border border-stone-200 p-4'>
        <p
          className='text-primary font-semibold uppercase text-base mb-3 overflow-hidden text-ellipsis'
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}>
          {active.subtitle}
        </p>
        <div
          className='text-stone-600 text-sm overflow-hidden text-ellipsis'
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 7,
            WebkitBoxOrient: 'vertical',
          }}>
          {parser(active.description || '')}
        </div>
      </div>

      <div className='relative'>
        <Image
          src={active.image || '/assets/logo-Booking.svg'}
          alt={active.title}
          width={800}
          height={450}
          className='rounded-xl w-full h-64 object-cover'
        />

        {active.category && active.slug && (
          <Link
            href={`/${active.category}/${active.slug}`}
            className='absolute right-3 bottom-3 rounded-full bg-[#e6c200] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.08em] text-[#0d1117] shadow-[0_8px_20px_rgba(230,194,0,0.5)] transition hover:scale-105 hover:bg-[#0d1117] hover:text-[#e6c200] animate-bounce [animation-duration:1.15s]'>
            {locale === 'en' ? 'View details' : 'Ver detalles'}
          </Link>
        )}
      </div>
    </div>
  );
}
