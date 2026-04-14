import Image from 'next/image';
import Link from 'next/link';
import parser from 'html-react-parser';
import Tabs from '@/components/general/Tabs';
import TravelSectionTitle from '@/components/travel/TravelSectionTitle';
import Calendar from '@/components/Availability';
import TourContentDesktop from './TourContentDesktop';

export default function TourMainContent({
  category,
  categoryTitle,
  dataget,
  handleBackdropClick,
  handleClose,
  handleOpen,
  isOpen,
  isZoomed,
  locale,
  modalRef,
  originalPrice,
  setIsZoomed,
  setTab,
  t,
  tab,
  tour,
  tourDays,
  contactEmail,
}) {
  const descriptionImage = tour.gallery?.[tour.gallery.length - 1];
  const descriptionImageAlt = descriptionImage?.alt || tour.title || 'Tour image';
  const activeGalleryImage = tour.gallery?.[tab];
  const activeGalleryImageAlt =
    activeGalleryImage?.alt || tour.title || 'Tour gallery image';

  return (
    <div className='2xl:container mx-auto'>
      <div className='grid grid-cols-12 lg:gap-8 gap-0'>
        <section className='col-span-12'>
          <div>
            {tour.sub_title && (
              <h2 className='text-center text-3xl font-semibold text-[#B8860B] my-4 px-12 xl:px-20'>
                {tour.sub_title}
              </h2>
            )}
          </div>

          {(tour.highlight || tour.url_brochure) && (
            <div className='max-w-5xl flex flex-col mx-auto items-center justify-center gap-3 px-3'>
              {tour.highlight && (
                <p className='italic text-center'>
                  <strong>{tour.highlight}</strong>
                </p>
              )}

              {tour.url_brochure && (
                <Link
                  href={tour.url_brochure}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 rounded-full bg-[#e6c200] px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-[#0d1117] no-underline transition hover:bg-[#0d1117] hover:text-[#e6c200]'>
                  {locale === 'en' ? 'Download Brochure' : 'Descargar Folleto'}
                </Link>
              )}
            </div>
          )}

          <nav className='mb-3 flex flex-nowrap items-center px-4 text-xs'>
            <Link
              href='/'
              className='flex items-center gap-1.5 font-medium text-stone-600 no-underline transition-colors duration-300 hover:text-[#e6c200]'>
              <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z' />
              </svg>
              {locale === 'en' ? 'Home' : 'Inicio'}
            </Link>

            <svg
              className='h-4 w-4 text-stone-400'
              fill='currentColor'
              viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                clipRule='evenodd'
              />
            </svg>

            <Link
              href={`/${category}`}
              className='flex items-center gap-1.5 font-medium text-stone-600 no-underline transition-colors duration-300 hover:text-[#e6c200]'>
              {categoryTitle}
            </Link>

            <svg
              className='h-4 w-4 text-stone-400'
              fill='currentColor'
              viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                clipRule='evenodd'
              />
            </svg>

            <span className='font-semibold text-primary'>{tour.title}</span>
          </nav>

          {tour.description && (
            <div>
              {descriptionImage?.url && (
                <Image
                  src={descriptionImage.url}
                  alt={descriptionImageAlt}
                  title={descriptionImageAlt}
                  width={1200}
                  height={900}
                  sizes='(min-width: 768px) 50vw, 100vw'
                  className='float-none md:float-right md:ml-4 mb-2 w-full md:w-1/2 h-auto rounded cursor-zoom-in px-3'
                  onClick={() => setIsZoomed(true)}
                />
              )}

              <div className='px-4'>{parser(tour.description)}</div>

              {isZoomed && descriptionImage?.url && (
                <div
                  className='fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4'
                  onClick={() => setIsZoomed(false)}>
                  <div className='relative max-w-full max-h-full'>
                    <button
                      onClick={() => setIsZoomed(false)}
                      className='absolute top-2 right-2 text-primary bg-secondary rounded-full p-0 m-0 hover:text-secondary hover:bg-primary text-3xl w-9'>
                      &times;
                    </button>
                    <Image
                      src={descriptionImage.url}
                      alt={descriptionImageAlt}
                      title={descriptionImageAlt}
                      width={1600}
                      height={1200}
                      sizes='100vw'
                      className='max-w-full max-h-screen h-auto w-auto object-contain rounded shadow-lg'
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {tour.gallery?.length > 1 && (
            <div className='col-md-6 px-4'>
              {activeGalleryImage?.url && (
                <div className='relative mt-4 h-56 w-full overflow-hidden rounded lg:h-[35rem]'>
                  <Image
                    src={activeGalleryImage.url}
                    alt={activeGalleryImageAlt}
                    title={activeGalleryImageAlt}
                    fill
                    sizes='(min-width: 1024px) 80vw, 100vw'
                    className='object-cover'
                  />
                </div>
              )}
              <div
                className='flex py-2 pr-8 md:pr-0'
                style={{ cursor: 'pointer', gap: '8px' }}>
                {(tour.gallery.length > 5
                  ? tour.gallery.slice(0, -1)
                  : tour.gallery
                ).map((img, index) => (
                  <button
                    key={index}
                    type='button'
                    onClick={() => setTab(index)}
                    aria-label={`${locale === 'en' ? 'View image' : 'Ver imagen'} ${index + 1}`}
                    className={[
                      'relative block h-[90px] w-[20%] overflow-hidden rounded border-0 bg-transparent p-0',
                      tab === index
                        ? 'ring-2 ring-[#e6c200]'
                        : 'opacity-80 transition-opacity hover:opacity-100',
                    ].join(' ')}>
                    <Image
                      src={img.url}
                      alt={img.alt || `${tour.title || 'Tour'} ${index + 1}`}
                      title={img.alt || `${tour.title || 'Tour'} ${index + 1}`}
                      fill
                      sizes='(min-width: 768px) 20vw, 25vw'
                      className='object-cover'
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {tour.information?.length > 0 && (
            <>
              {/* <TravelSectionTitle title={t.trip_details} /> */}

              <div className='block lg:hidden'>
                <Tabs
                  key={tour.slug || tour._id}
                  tabsQuery={tour.information}
                />
              </div>

              <div className='hidden lg:block'>
                <TourContentDesktop
                  tourInformation={tour.information}
                  locale={locale}
                />
              </div>
            </>
          )}

          {tour.ardiscounts?.length > 0 && (
            <div className='my-8'>
              <TravelSectionTitle
                title={
                  locale === 'en' ? 'Group Discounts' : 'Descuentos por Grupo'
                }
              />
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
                {tour.ardiscounts.map((d, i) => (
                  <div
                    key={i}
                    className='bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center hover:shadow-md transition-shadow'>
                    {d.persons && (
                      <div className='text-sm font-semibold mb-1'>
                        {d.persons} {locale === 'en' ? 'persons' : 'personas'}
                      </div>
                    )}

                    {d.pdiscount != null && (
                      <div className='text-2xl font-bold text-secondary'>
                        -{d.pdiscount}%
                      </div>
                    )}

                    {d.pdiscount != null && originalPrice > 0 && (
                      <div className='text-lg font-bold text-primary mt-1'>
                        ${(originalPrice * (1 - d.pdiscount / 100)).toFixed(0)}{' '}
                        USD
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className='grid lg:grid-cols-3 grid-cols-1 gap-2 text-white bg-primary py-4 px-8 text-center items-center rounded-t'>
            <h3 className='text-lg font-bold'>{t.have_questions}</h3>

            <div>
              <h4>{t.call}</h4>
              <Link
                href='https://api.whatsapp.com/send/?phone=51970811976'
                className='no-underline hover:underline text-secondary text-base font-bold'>
                +51 970811976
              </Link>
            </div>

            <div>
              <h4>{t.email}</h4>
              <Link
                href={`mailto:${contactEmail}`}
                className='no-underline hover:underline text-secondary text-base font-bold'>
                {contactEmail}
              </Link>
            </div>
          </div>

          <button
            onClick={handleOpen}
            className='fixed -bottom-4 left-1/2 -translate-x-1/2 text-xl shadow-xl font-extrabold inline-flex z-50'>
            <span className='animate-bounce px-4 pt-2 pb-4 text-primary bg-secondary hover:bg-primary hover:text-secondary rounded-t-2xl drop-shadow-[0_0_10px_rgba(251,184,0,1)] transition-all duration-300'>
              {dataget?.data?.length > 0 ? t.availability : t.booking}
            </span>
          </button>

          {isOpen && (
            <div
              className='fixed inset-0 flex items-center justify-center bg-black/50 z-50'
              onClick={handleBackdropClick}>
              <div
                ref={modalRef}
                className='relative bg-white rounded-lg shadow-lg w-full max-w-4xl m-4'>
                <button
                  onClick={handleClose}
                  className='absolute top-2 right-2 text-primary bg-secondary rounded-full p-0 m-0 hover:text-secondary hover:bg-primary text-3xl w-9'>
                  &times;
                </button>

                <Calendar
                  data={dataget.data}
                  updatedAt={dataget.updatedAt}
                  title={tour.title}
                  messages={t.messages}
                  tourDays={tourDays}
                  idTour={tour.wetravel}
                  language={locale}
                />
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
