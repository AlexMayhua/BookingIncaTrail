import Image from 'next/image';
import Link from 'next/link';
import parser from 'html-react-parser';
import { useEffect, useState } from 'react';

const focusRing =
  'focus-visible:!outline focus-visible:!outline-2 focus-visible:!outline-offset-2 focus-visible:!outline-secondary';

export default function TourPanel({ items, title, onNavigate }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [title]);

  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  const safeActiveIndex = Math.min(activeIndex, items.length - 1);
  const active = items[safeActiveIndex];

  return (
    <div
      className='grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white rounded-xl p-6 max-w-7xl mx-auto'
      role='region'
      aria-label={title}>
      <div className='space-y-2 2xl:space-y-3'>
        <h2 className='text-sm 2xl:text-lg font-bold text-primary uppercase'>
          {title}
        </h2>
        <ul className='space-y-2 2xl:space-y-3'>
          {items.map((item, i) => {
            const isActive = i === safeActiveIndex;
            const href =
              item.category && item.slug
                ? `/${item.category}/${item.slug}`
                : null;
            const itemClassName = [
              'block w-full rounded-lg border-l-4 px-2 py-2 text-left text-sm transition-colors duration-200 2xl:text-base',
              focusRing,
              isActive
                ? 'border-l-yellow bg-yellow/10 font-bold text-primary'
                : 'border-l-transparent text-stone-600 hover:border-l-yellow/70 hover:bg-stone-50 hover:text-primary',
            ].join(' ');

            return (
              <li key={item.id}>
                {href ? (
                  <Link
                    href={href}
                    onMouseEnter={() => setActiveIndex(i)}
                    onFocus={() => setActiveIndex(i)}
                    onClick={onNavigate}
                    aria-current={isActive ? 'true' : undefined}
                    className={itemClassName}>
                    {item.title}
                  </Link>
                ) : (
                  <span
                    className={`${itemClassName} cursor-default`}
                    aria-disabled='true'>
                    {item.title}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className='rounded-xl border border-stone-200 p-4' aria-live='polite'>
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
      </div>
    </div>
  );
}
