import Image from 'next/image';

const STAT_ICONS = [
  '/assets/icon/type-tour_vectorized.svg',
  '/assets/icon/time_vectorized.svg',
  '/assets/icon/group-zise_vectorized.svg',
  '/assets/icon/dificult-meter_vectorized.svg',
  '/assets/icon/accommodation_vectorized.svg',
  '/assets/icon/languages_vectorized.svg',
];

export default function TourHero({
  category,
  categoryTitle,
  heroImage,
  locale,
  originalPrice,
  tour,
}) {
  return (
    <section className='relative w-full min-h-[80vh] flex items-center justify-center overflow-visible pb-16'>
      <div
        className='absolute inset-0 bg-cover bg-center bg-no-repeat bg-black/20 z-0 transition-transform duration-300 ease-out'
        style={{
          backgroundImage: heroImage ? `url('${heroImage}')` : 'none',
        }}
      />

      <div className='absolute inset-0 z-[1] bg-black/50' />

      <div className='relative z-10 w-full max-w-5xl mx-auto px-6 py-8'>
        <div className='flex flex-col items-center gap-5 text-center'>

          <div className='inline-flex items-center gap-2 px-4 py-2 bg-[rgba(230,194,0,0.15)] backdrop-blur-[10px] border border-[rgba(230,194,0,0.3)] rounded-full text-[#e6c200] text-[0.7rem] font-semibold uppercase tracking-[0.1em]'>
            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z'
                clipRule='evenodd'
              />
            </svg>
            {tour.quickstats?.[0]?.content ||
              (locale === 'en' ? 'Tour' : 'Tour')}
          </div>

          <h1
            className='text-[clamp(2.25rem,5vw,4rem)] font-bold text-white leading-[1.15] m-0'
            style={{
              fontFamily: "'Playfair Display', serif",
              textShadow: '0 2px 30px rgba(0,0,0,0.5)',
            }}>
            {tour.title}
          </h1>

          <div
            className='flex flex-col items-center gap-1'
            style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className='text-5xl font-bold text-[#e6c200] leading-none drop-shadow-[0_0_10px_rgba(251,184,0,0.75)]'>
              ${originalPrice.toFixed(0)}
            </span>
            <span className='text-xl font-medium text-white uppercase tracking-[0.05em] text-center'>
              {locale === 'en' ? 'Per Person' : 'Por Persona'}
            </span>
          </div>

          {tour.quickstats?.length > 0 && (
            <div className='w-full max-w-7xl px-2 py-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 lg:gap-10 backdrop-blur-[4px] bg-black/25 rounded-xl'>
              {tour.quickstats.slice(0, 6).map((qsk, index) => (
                <div
                  key={index}
                  className='flex flex-col items-center text-center lg:gap-2 px-3 py-2 lg:px-4 lg:py-3'>
                  <div className='flex h-10 w-10 items-center justify-center'>
                    <Image
                      src={STAT_ICONS[index] || STAT_ICONS[0]}
                      alt={qsk.title || (locale === 'en' ? 'Tour stat' : 'Dato del tour')}
                      width={40}
                      height={40}
                      className='h-10 w-10 object-contain'
                    />
                  </div>

                  <span className='text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white/65'>
                    {qsk.title}
                  </span>
                  <span className='text-[0.95rem] font-semibold text-white leading-snug'>
                    {qsk.content}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
