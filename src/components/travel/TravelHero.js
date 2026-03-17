import Link from 'next/link';
import { LazyLoadImage } from 'react-lazy-load-image-component';

export default function TravelHero({
  t,
  categoryTitle,
  categoryDescription,
  categoryImagePath,
  tripsCount,
}) {
  return (
    <section className='relative w-full min-h-[80vh] flex items-center justify-center overflow-visible mb-48 pb-16 lg:mb-40 md:mb-56 sm:mb-64'>
      <div
        className='absolute inset-0 bg-cover bg-center bg-no-repeat z-0 transition-transform duration-300'
        style={{ backgroundImage: `url(${categoryImagePath})` }}
      />

      <div className='absolute inset-0 z-[1] bg-gradient-to-br from-[rgba(0,82,73,0.35)] via-[rgba(0,82,73,0.25)] to-[rgba(13,17,23,0.4)]' />

      <div className='relative z-10 w-full max-w-[1400px] mx-auto px-6 py-8'>
        <div className='flex flex-col items-start gap-5 max-w-[700px]'>
          <nav className='flex items-center gap-2 mb-2'>
            <Link
              href='/'
              className='flex items-center gap-1.5 text-white/80 no-underline text-xs font-medium transition-colors hover:text-secondary'>
              <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z' />
              </svg>
              {t.home}
            </Link>
            <svg
              className='w-4 h-4 text-white/40'
              fill='currentColor'
              viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                clipRule='evenodd'
              />
            </svg>
            <span className='text-white text-xs font-semibold'>
              {categoryTitle}
            </span>
          </nav>

          <div className='inline-flex items-center gap-2 px-4 py-2 bg-secondary/15 backdrop-blur-[10px] border border-secondary/30 rounded-full text-secondary font-semibold text-[0.7rem] uppercase tracking-widest'>
            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z'
                clipRule='evenodd'
              />
            </svg>
            {t.badge_category}
          </div>

          <h1
            className='text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight m-0'
            style={{
              fontFamily: "'Playfair Display', serif",
              textShadow: '0 2px 30px rgba(0,0,0,0.5)',
            }}>
            {categoryTitle}
          </h1>

          <p
            className='text-base lg:text-lg text-white/90 leading-relaxed m-0 max-w-[600px]'
            style={{
              fontFamily: "'Montserrat', sans-serif",
              textShadow: '0 1px 10px rgba(0,0,0,0.3)',
            }}>
            {categoryDescription}
          </p>

          <div className='flex flex-wrap items-center gap-5 mt-2 px-5 py-3 bg-black/25 backdrop-blur-[10px] rounded-full border border-white/10'>
            <div className='flex flex-col items-center gap-1'>
              <span
                className='text-3xl font-bold text-secondary leading-none'
                style={{ fontFamily: "'Playfair Display', serif" }}>
                {tripsCount}
              </span>
              <span className='text-[0.65rem] font-medium text-white/80 uppercase tracking-wider'>
                {tripsCount === 1 ? t.tour : t.tours}
              </span>
            </div>
            <div className='w-px h-[30px] bg-white/20 hidden sm:block' />
            <div className='flex flex-col items-center gap-1 drop-shadow-[0_0_7px_white]'>
              <LazyLoadImage
                src='/assets/icon/type-tour.png'
                alt='Type'
                className='w-5 h-5 drop-shadow-[0_0_6px_white]'
              />
              <span className='text-[0.65rem] font-medium text-white/80 uppercase tracking-wider'>
                {t.adventure}
              </span>
            </div>
            <div className='w-px h-[30px] bg-white/20 hidden sm:block' />
            <div className='flex flex-col items-center gap-1 drop-shadow-[0_0_7px_white]  '>
              <LazyLoadImage
                src='/assets/icon/languages.png'
                alt='Languages'
                className='w-5 h-5 drop-shadow-[0_0_6px_white]'
              />
              <span className='text-[0.65rem] font-medium text-white/80 uppercase tracking-wider'>
                ES / EN
              </span>
            </div>
          </div>

          <div className='mt-2'>
            <a
              href='#tours'
              className='inline-flex items-center gap-2 px-7 py-4 bg-gradient-to-br from-secondary to-yellow-dark text-dark font-bold text-sm uppercase tracking-wider no-underline rounded-full cursor-pointer shadow-[0_4px_20px_rgba(230,194,0,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(230,194,0,0.5)] hover:from-[#FFD700] hover:to-secondary'>
              {t.explore_tours}
              <svg
                className='w-4 h-4'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
                fill='currentColor'>
                <path
                  fillRule='evenodd'
                  d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                  clipRule='evenodd'
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className='absolute -bottom-10 lg:-bottom-2 left-0 right-0 z-[15] flex justify-center px-5 translate-y-1/2'>
        <div className='w-full max-w-7xl bg-white rounded-2xl py-4 px-6 md:py-8 md:px-10 shadow-[0_10px_60px_rgba(0,0,0,0.15)] grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-10 border border-secondary/20'>
          <div className='flex items-center gap-4'>
            <LazyLoadImage
              src='/assets/icon/dificult.png'
              alt='Difficulty'
              className='w-8 h-8 flex-shrink-0 opacity-90'
            />
            <div className='flex flex-col gap-0.5'>
              <span className=' font-semibold text-gray-500 uppercase tracking-wider'>
                {t.difficulty}
              </span>
              <span className='text-sm font-bold text-[#005249]'>
                {t.difficulty_value}
              </span>
            </div>
          </div>

          <div className='flex items-center gap-4'>
            <LazyLoadImage
              src='/assets/icon/type-tour.png'
              alt='Tours'
              className='w-8 h-8 flex-shrink-0 opacity-90'
            />
            <div className='flex flex-col gap-0.5'>
              <span className=' font-semibold text-gray-500 uppercase tracking-wider'>
                {t.available}
              </span>
              <span className='text-sm font-bold text-[#005249]'>
                {tripsCount} {tripsCount === 1 ? 'Tour' : 'Tours'}
              </span>
            </div>
          </div>
          <div className='flex items-center gap-4 col-span-2 md:col-span-1'>
            <LazyLoadImage
              src='/assets/icon/group-zise.png'
              alt='Group'
              className='w-8 h-8 flex-shrink-0 opacity-90'
            />
            <div className='flex flex-col gap-0.5'>
              <span className='font-semibold text-gray-500 uppercase tracking-wider'>
                {t.group_size}
              </span>
              <span className='text-sm font-bold text-[#005249]'>
                {t.group_size_value}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
