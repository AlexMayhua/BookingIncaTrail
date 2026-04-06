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
  const tourHref = `/${tour.category}/${tour.slug}`;
  const isBestSeller = Number(tour?.discount || 0) > 0;

  return (
    <article className='mx-auto flex h-full min-h-[30rem] w-full max-w-sm select-none flex-col overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_10px_26px_rgba(0,0,0,0.18)]'>
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
        <div className='absolute left-3 top-3 z-20 flex flex-wrap gap-2'>
          {isBestSeller && (
            <span className='inline-flex items-center rounded-full bg-[#e6c200] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#0d1117]'>
              ⭐ {locale === 'en' ? 'Best Seller' : 'Mas vendido'}
            </span>
          )}
          <span className='inline-flex items-center rounded-full bg-[#2a9d8f] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-white'>
            🔥 {locale === 'en' ? 'Limited Spots' : 'Cupos limitados'}
          </span>
        </div>
        <div
          className='absolute inset-x-0 z-10 px-2 text-center'
          style={{ bottom: '3.5rem' }}>
          <h3 className='line-clamp-2 text-lg font-bold uppercase tracking-wide text-[#f8f3d6]'>
            {tour.title}
          </h3>
          <p className='text-sm text-white/90'>{tour.duration}</p>
        </div>
      </div>

      <div className=' z-20 -mt-6 flex items-center justify-between px-6'>
        <p className='flex items-center text-sm font-semibold text-[#2a9d8f]'>
          <span className='mr-2 inline-block h-3 w-3 rounded-full bg-[#2a9d8f]' />
          {locale === 'en' ? 'Available' : 'Disponible'}
        </p>
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

      <div className='mt-auto flex justify-around px-5 pb-3 text-center uppercase tracking-wide'>
        <div>
          <p className='text-xs text-[#4E5665]'>
            {locale === 'en' ? 'Discount' : 'Descuento'}
          </p>
          <p className='text-xl font-bold text-[#2a9d8f]'>
            {Number(tour.discount || 0) > 0 ? `${tour.discount}%` : '--'}
          </p>
        </div>
        <div>
          <p className='text-xs text-[#4E5665]'>
            {locale === 'en' ? 'Price' : 'Precio'}
          </p>
          <p className='text-2xl font-extrabold text-[#e6c200]'>${tourPrice}</p>
        </div>
      </div>

      <div className='grid gap-2 px-5 pb-5'>
        <Link
          href={tourHref}
          locale={locale}
          className='inline-flex items-center justify-center rounded-md bg-[#e6c200] px-4 py-2 text-sm font-bold uppercase tracking-[0.08em] text-[#0d1117] transition hover:bg-[#0d1117] hover:text-[#e6c200]'>
          {locale === 'en' ? 'Book Now' : 'Reservar ahora'}
        </Link>

      </div>
    </article>
  );
}
