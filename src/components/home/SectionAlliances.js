import Image from 'next/image';
import { useRouter } from 'next/router';

const ALLIANCES = [
  {
    src: '/img/alliances/dircetur.webp',
    alt: 'DIRCETUR Cusco',
    nameEn: 'DIRCETUR Cusco',
    nameEs: 'DIRCETUR Cusco',
  },
  {
    src: '/img/alliances/mincetur.webp',
    alt: 'MINCETUR',
    nameEn: 'MINCETUR',
    nameEs: 'MINCETUR',
  },
  {
    src: '/img/alliances/esnna.webp',
    alt: 'ESNNA',
    nameEn: 'ESNNA',
    nameEs: 'ESNNA',
  },
  {
    src: '/img/alliances/peru.webp',
    alt: 'Marca Perú',
    nameEn: 'Peru Brand',
    nameEs: 'Marca Perú',
  },
];

export default function SectionAlliances() {
  const { locale } = useRouter();
  const isEnglish = locale === 'en';

  return (
    <section className='relative overflow-hidden py-20'>
      <div className='relative mx-auto max-w-7xl px-5 lg:px-8'>
        <div className='mx-auto max-w-2xl text-center'>
          <span className='inline-flex rounded-full bg-[#E6C20026] px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#0d1117]'>
            {isEnglish ? 'Certifications' : 'Certificaciones'}
          </span>
          <h2 className='mt-4 text-3xl font-semibold tracking-tight text-black md:text-4xl'>
            {isEnglish ? 'Our Alliances' : 'Nuestras Alianzas'}
          </h2>
          <p className='mt-3 text-sm leading-relaxed text-gray-500 md:text-base'>
            {isEnglish
              ? 'We are proud to be backed by the leading tourism and government institutions in Peru, ensuring quality and trust in every experience.'
              : 'Estamos orgullosos de contar con el respaldo de las principales instituciones turísticas y gubernamentales del Perú, garantizando calidad y confianza en cada experiencia.'}
          </p>
        </div>

        <div className='mt-14 grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4'>
          {ALLIANCES.map((alliance) => (
            <div
              key={alliance.alt}
              className='group flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md'>
              <div className='relative h-16 w-full sm:h-20'>
                <Image
                  src={alliance.src}
                  alt={alliance.alt}
                  fill
                  sizes='(max-width: 640px) 40vw, 200px'
                  className='object-contain'
                />
              </div>
              <p className='mt-4 text-center text-xs font-semibold text-slate-700 sm:text-sm'>
                {isEnglish ? alliance.nameEn : alliance.nameEs}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
