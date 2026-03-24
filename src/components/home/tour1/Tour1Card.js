import Link from 'next/link';
import Image from 'next/image';
import {
  getTourAlt,
  getTourDesc,
  getTourImage,
  getTourPrice,
} from '../tourCategories';

export default function Tour1Card({ tour, locale }) {
  const tourImage = getTourImage(tour);
  const tourAlt = getTourAlt(tour);
  const tourPrice = getTourPrice(tour);
  const tourDesc = getTourDesc(tour, locale);

  return (
    <article className='mx-auto flex h-full min-h-[28rem] w-full max-w-sm select-none flex-col overflow-hidden rounded-lg bg-white shadow-md'>
      <div
        className='relative z-10'
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 3.6vw))',
        }}>
        <Image
          className='h-64 w-full object-cover'
          src={tourImage}
          alt={tourAlt}
          width={900}
          height={700}
          loading='lazy'
        />
        <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 from-30% via-black/35 to-transparent' />
        <div
          className='absolute inset-x-0 z-10 px-2 text-center'
          style={{ bottom: '3.5rem' }}>
          <h3 className='line-clamp-2 text-lg font-bold uppercase tracking-wide text-secondary'>
            {tour.title}
          </h3>
          <p className='text-sm text-white'>{tour.duration}</p>
        </div>
      </div>

      <div className='relative z-20 -mt-10 flex items-center justify-between px-6'>
        <p className='flex items-center text-sm text-green-500'>
          <span className='mr-2 inline-block h-3 w-3 rounded-full bg-green-500' />
          {locale === 'en' ? 'Available' : 'Disponible'}
        </p>

        <Link
          href={`/${tour.category}/${tour.slug}`}
          locale={locale}
          className='rounded-full bg-red-600 p-2 xl:p-4 text-white transition duration-200 hover:bg-red-500 focus:bg-red-700 focus:outline-none'
          aria-label={
            locale === 'en' ? 'View tour details' : 'Ver detalles del tour'
          }>
          <svg viewBox='0 0 20 20' className='h-6 w-6' aria-hidden='true'>
            <path
              fill='currentColor'
              d='M16 10c0 .553-.048 1-.601 1H11v4.399C11 15.951 10.553 16 10 16c-.553 0-1-.049-1-.601V11H4.601C4.049 11 4 10.553 4 10c0-.553.049-1 .601-1H9V4.601C9 4.048 9.447 4 10 4c.553 0 1 .048 1 .601V9h4.399c.553 0 .601.447.601 1z'
            />
          </svg>
        </Link>
      </div>

      <div className='h-[7.5rem] px-2 pb-6 pt-4 text-center text-gray-700'>
        <p
          className='px-6 text-base font-semibold'
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
          {tourDesc}
        </p>
      </div>

      <div className='mt-auto flex justify-around px-5 pb-8 text-center uppercase tracking-wide'>
        <div>
          <p className='text-xs text-[#4E5665]'>Discount</p>
          <p className='text-lg font-semibold text-[#685300]'>
            {Number(tour.discount || 0) > 0 ? `${tour.discount}%` : '--'}
          </p>
        </div>
        <div>
          <p className='text-xs text-[#4E5665]'>Price</p>
          <p className='text-lg font-semibold text-[#685300]'>${tourPrice}</p>
        </div>
      </div>
    </article>
  );
}
