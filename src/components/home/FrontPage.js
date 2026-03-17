import { useRouter } from 'next/router';
import en from '../../lang/en/home';
import es from '../../lang/es/home';
import Link from 'next/link';
import Image from 'next/image';

const cards = {
  left: [
    {
      img: '/img/hero/inca-trail.webp',
      href: '/inca-trail',
      alt: 'Inca Trail trek group',
      badge: 'Inca Trail',
      position:
        'top-[3%] left-[15%] 2xl:top-[5%] 2xl:left-[13%] 3xl:top-[5%] 3xl:left-[13%]',
      w: 'w-28 xl:w-44 2xl:w-52 3xl:w-72',
      sizes:
        '(min-width: 1920px) 216px, (min-width: 1536px) 216px, (min-width: 1280px) 194px, 130px',
    },
    {
      img: '/img/hero/salkantay.webp',
      href: '/salkantay',
      alt: 'salkantay trek',
      badge: 'Salkantay',
      position:
        'top-[31%] left-[20%] xl:top-[35%] 2xl:top-[32%] 2xl:left-[28%] 3xl:top-[35%] 3xl:left-[30%]',
      w: 'w-36 xl:w-36 2xl:w-36 3xl:w-44',
      sizes: '(min-width: 1536px) 260px, (min-width: 1280px) 128px, 116px',
    },
    {
      img: '/img/hero/ausangate.webp',
      href: '/ausangate',
      alt: 'Ausangate Trek',
      badge: 'Ausangate Trek',
      position:
        'bottom-[4%] left-[17%] xl:bottom-[10%] xl:left-[12%] 2xl:bottom-[9%] 2xl:left-[15%] 3xl:bottom-[10%] 3xl:left-[20%]',
      w: 'w-32 xl:w-40 2xl:w-52 3xl:w-60',
      sizes:
        '(min-width: 1920px) 320px, (min-width: 1536px) 208px, (min-width: 1280px) 144px, 112px',
    },
  ],
  right: [
    {
      img: '/img/hero/inca-jungle.webp',
      href: '/inca-jungle',
      alt: 'Inca Jungle adventure',
      badge: 'Inca Jungle',
      position:
        'top-[7%] right-[15%] 2xl:top-[3%] 2xl:right-[15%] 3xl:top-[5%] 3xl:right-[20%]',
      w: 'w-36 xl:w-40 2xl:w-44 3xl:w-56',
      sizes:
        '(min-width: 1920px) 300px, (min-width: 1536px) 202px, (min-width: 1280px) 144px, 112px',
    },
    {
      img: '/img/hero/cusco-tours.webp',
      href: '/day-tours',
      alt: 'Cusco Tours',
      badge: 'Day Tours',
      position:
        'top-[44%] right-[25%] xl:top-[38%] xl:right-[22%] 2xl:top-[38%] 2xl:right-[25%] 3xl:top-[38%] 3xl:right-[24%]',
      w: 'w-32 xl:w-48 2xl:w-40 3xl:w-64',
      sizes:
        '(min-width: 1920px) 240px, (min-width: 1536px) 192px, (min-width: 1280px) 144px, 112px',
    },
    {
      img: '/img/hero/montaña-colores.webp',
      href: '/rainbow-mountain',
      alt: 'Rainbow Mountain',
      badge: 'Rainbow Mountain',
      position:
        'bottom-[5%] right-[13%] xl:bottom-[14%] xl:right-[10%] 2xl:bottom-[10%] 2xl:right-[8%] 3xl:bottom-[15%] 3xl:right-[12%]',
      w: 'w-28 xl:w-32 2xl:w-56 3xl:w-48',
      sizes:
        '(min-width: 1920px) 280px, (min-width: 1536px) 292px, (min-width: 1280px) 144px, 112px',
    },
  ],
};

function FloatingCard({ img, href, alt, badge, position, w, sizes, hidden }) {
  return (
    <div
      className={`absolute z-20 ${position} ${w} aspect-[4/5] rounded-2xl ${hidden ?? ''} overflow-hidden`}>
      <Image
        fill
        src={img}
        alt={alt}
        loading='lazy'
        sizes={sizes}
        className='w-full h-full object-cover'
      />
      <span className='absolute bottom-2 left-2 bg-white text-black text-xs 2xl:text-sm font-bold px-2 py-0.5 rounded-full'>
        <Link href={href}>
          {badge}
        </Link>
      </span>
    </div>
  );
}

export default function FrontPage() {
  const { locale } = useRouter();
  const t = locale === 'en' ? en : es;

  return (
    <section className='relative w-full h-[90vh] overflow-hidden flex flex-col'>
      <div className='absolute inset-0 md:hidden'>
        <Image
          src='/img/hero/img-hero-desktop.webp'
          alt='Machu Picchu background'
          fill
          priority
          fetchPriority='high'
          quality={65}
          sizes='100vw'
          className='object-cover object-center'
        />
      </div>

      <div className='absolute inset-0 hidden md:block'>
        <Image
          src='/img/hero/machu-imge.webp'
          alt='Machu Picchu background'
          fill
          priority
          quality={70}
          sizes='100vw'
          className='object-cover object-center'
        />
      </div>
      <div className='absolute inset-0 bg-black/50 z-[1]' />

      {cards.left.map((c, i) => (
        <FloatingCard key={`l${i}`} {...c} hidden='hidden lg:block' />
      ))}
      {cards.right.map((c, i) => (
        <FloatingCard key={`r${i}`} {...c} hidden='hidden lg:block' />
      ))}

      <div className='relative z-10 flex-1 flex flex-col items-center justify-center text-center px-5 max-w-2xl md:max-w-3xl mx-auto gap-3 md:gap-5 lg:gap-4 xl:gap-6'>
        <h1 className='text-white font-extrabold text-3xl md:text-3xl lg:text-4xl xl:text-6xl leading-[0.95] tracking-tight'>
          {locale === 'en' ? (
            <>
              Trek the Inca Trail
              <br />
              powered by
              <br />
              <span className='text-secondary'>local experts</span>
            </>
          ) : (
            <>
              Camino Inca
              <br />
              impulsado por
              <br />
              <span className='text-secondary'>expertos locales</span>
            </>
          )}
        </h1>

        <Link
          href='/contact'
          className='inline-flex items-center bg-secondary text-primary font-bold text-xs md:text-sm uppercase tracking-wide px-6 py-2 xl:py-3 rounded-full'>
          {locale === 'en' ? 'Check Availability' : 'Ver Disponibilidad'}
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
            className='w-4 h-4'>
            <path
              fillRule='evenodd'
              d='M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>
        </Link>

        <div className='flex flex-col items-center gap-1 md:gap-2'>
          <p className='text-white text-sm'>
            {locale === 'en'
              ? 'Official government permits · Small groups only'
              : 'Permisos oficiales del gobierno · Solo grupos pequeños'}
          </p>
          <Link
            href='#alltours'
            className='text-secondary text-sm md:text-sm font-semibold underline underline-offset-2'>
            {locale === 'en'
              ? 'Explore all tours →'
              : 'Explorar todos los tours →'}
          </Link>
          <div className='flex items-center gap-1.5'>
            <span className='text-white text-[11px] md:text-xs font-medium'>
              4.9 · 8,900+ {locale === 'en' ? 'travelers' : 'viajeros'}
            </span>
          </div>
        </div>

        <div className='relative w-full max-w-[140px] md:max-w-[200px] lg:max-w-[160px] 2xl:max-w-[200px] 3xl:max-w-[280px]'>
          <div className='relative aspect-[4/5] rounded-2xl overflow-hidden'>
            <Image
              fill
              src='/img/hero/salineras-maras.webp'
              alt='Salineras de Maras panoramic view'
              fetchPriority='high'
              sizes='(min-width: 1920px) 440px, (min-width: 1536px) 360px, (min-width: 1024px) 160px, (min-width: 768px) 200px, 140px'
              className='w-full h-full object-cover'
            />
          </div>

          <div className='absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white rounded-full px-3 py-1 lg:py-2 flex items-center gap-1.5  shadow-lg'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-4 h-4 lg:w-5 lg:h-5 text-secondary'>
              <path
                fillRule='evenodd'
                d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z'
                clipRule='evenodd'
              />
            </svg>
            <span className='text-primary font-bold text-xs lg:text-sm text-nowrap'>
              {locale === 'en' ? 'Since 2014' : 'Desde 2014'}
            </span>
          </div>
        </div>

        <div className='flex gap-2 mt-4 lg:hidden w-full justify-center'>
          {[cards.left[0], cards.right[2], cards.left[2]].map((c, i) => (
            <div
              key={i}
              className='w-24 h-28 md:w-32 md:h-40 rounded-xl overflow-hidden shrink-0 relative'>
              <Image
                fill
                src={c.img}
                alt={c.alt}
                loading='lazy'
                fetchPriority='low'
                sizes='(min-width: 96px) 96px, 96px'
                className='w-full h-full object-cover'
              />
              <span className='absolute bottom-1 left-1 bg-white/90 text-primary text-[8px] md:text-[9px] font-bold px-1.5 py-0.5 rounded-full'>
                {c.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
