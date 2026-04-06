import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import en from '../../lang/en/navbar';
import es from '../../lang/es/navbar';
import { BRAND } from '../../lib/brandConfig';
import { ESFlag, USFlag } from '../general/FlagSVG';
import TourPanel from './TourPanel';
import useHeaderMenuData from '../../hooks/useHeaderMenuData';
import {
  getHeaderCategoryMeta,
  normalizeCategorySlug,
} from '@/utils/categoryHelpers';

export default function Header() {
  const router = useRouter();
  const { locale, asPath } = router;
  const t = locale === 'en' ? en : es;
  const { categories, loading } = useHeaderMenuData();
  const [activeCategory, setActiveCategory] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMobileCategory, setOpenMobileCategory] = useState(null);

  const logoAlt =
    locale === 'en' ? 'Booking Inca Trail Logo' : 'Logo Booking Inca Trail';

  const socialLinks = [
    {
      key: 'facebook',
      href: BRAND.social?.facebook,
      label: 'Facebook',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='currentColor'>
          <path d='M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z' />
        </svg>
      ),
    },
    {
      key: 'instagram',
      href: BRAND.social?.instagram,
      label: 'Instagram',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='currentColor'>
          <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' />
        </svg>
      ),
    },
    {
      key: 'tiktok',
      href: BRAND.social?.tiktok,
      label: 'TikTok',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='currentColor'>
          <path d='M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z' />
        </svg>
      ),
    },
    {
      key: 'youtube',
      href: BRAND.social?.youtube,
      label: 'YouTube',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='currentColor'>
          <path d='M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' />
        </svg>
      ),
    },
  ];

  const secondaryLinks = [
    { href: '/about-us', label: t.about },
    { href: '/contact', label: t.review },
  ];

  const activeGroup = categories.find(
    (group) => group.category === activeCategory,
  );
  const activeGroupMeta = getHeaderCategoryMeta(activeGroup?.category, locale);
  const activeCategoryTitle = activeGroup?.title || activeGroupMeta.title;

  const activePanelItems = (activeGroup?.trips || []).map((trip, index) => ({
    id: `${activeGroupMeta.slug || 'tour'}-${trip.slug || index}`,
    title: trip.title || '',
    category: normalizeCategorySlug(trip.category || activeGroupMeta.slug),
    categoryTitle: activeCategoryTitle,
    slug: trip.slug || '',
    subtitle: trip.subtitle || '',
    description: trip.navbar_description || '',
    image: trip.gallery?.url || null,
  }));

  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenMobileCategory(null);
    setActiveCategory(null);
  }, [asPath]);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;

    const previousOverflow = document.body.style.overflow;

    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = previousOverflow || '';
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  const changeLanguage = (language) => {
    if (language !== locale) {
      router.push(router.pathname, router.asPath, { locale: language });
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setOpenMobileCategory(null);
  };

  const toggleMobileCategory = (category) => {
    setOpenMobileCategory((current) =>
      current === category ? null : category,
    );
  };

  return (
    <header id='headerDesktop' className='sticky top-0 z-40 w-full text-white'>
      <div className='header-mobile-bar border-b border-white/10 bg-primary lg:hidden'>
        <div className='flex items-center justify-between px-4 py-3'>
          <Link href='/' aria-label={logoAlt}>
            <Image
              src='/assets/logo-Booking.svg'
              alt={logoAlt}
              width={144}
              height={48}
              className='h-11 w-auto'
            />
          </Link>

          <div className='flex items-center gap-2'>
            <button
              onClick={() => changeLanguage('en')}
              className='rounded-lg p-1.5 transition-colors hover:bg-white/10'
              aria-label='English'
              aria-pressed={router.locale === 'en'}>
              <USFlag
                className={`w-6 rounded-sm ${router.locale === 'en' ? 'drop-shadow-[0px_0px_5px_white]' : ''}`}
              />
            </button>
            <button
              onClick={() => changeLanguage('es')}
              className='rounded-lg p-1.5 transition-colors hover:bg-white/10'
              aria-label='Español'
              aria-pressed={router.locale === 'es'}>
              <ESFlag
                className={`w-6 rounded-sm ${router.locale === 'es' ? 'drop-shadow-[0px_0px_5px_white]' : ''}`}
              />
            </button>
            <button
              type='button'
              onClick={() => setMobileMenuOpen((current) => !current)}
              aria-expanded={mobileMenuOpen}
              aria-controls='mobile-menu-panel'
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              className='flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-secondary transition-colors hover:bg-white/10'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                className='h-6 w-6'>
                {mobileMenuOpen ? (
                  <path
                    d='M6 6l12 12M18 6L6 18'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                ) : (
                  <path
                    d='M4 7h16M4 12h16M4 17h16'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-black/55 transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={closeMobileMenu}
        aria-hidden='true'
      />

      <aside
        id='mobile-menu-panel'
        className={`fixed right-0 top-0 z-50 flex h-dvh w-[88vw] max-w-sm flex-col border-l border-white/10 bg-primary shadow-2xl transition-transform duration-300 lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
        <div className='flex items-center justify-between border-b border-white/10 px-4 py-4'>
          <div>
            <p className='text-[10px] uppercase tracking-[0.28em] text-white/55'>
              {t.tours}
            </p>
            <p className='mt-1 text-lg font-semibold text-white'>{t.slogan}</p>
          </div>
          <button
            type='button'
            onClick={closeMobileMenu}
            aria-label='Close menu'
            className='flex h-10 w-10 items-center justify-center rounded-full border border-secondary/50 bg-secondary/10 text-secondary transition-colors hover:bg-secondary/20'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              className='h-5 w-5'>
              <path
                d='M6 6l12 12M18 6L6 18'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>
        </div>

        <div className='flex-1 overflow-y-auto px-4 py-5'>
          <div className='mb-5 flex flex-col gap-2'>
            {secondaryLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={closeMobileMenu}
                className='rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white/85 transition-colors hover:bg-white/10'>
                {link.label}
              </Link>
            ))}
          </div>

          <div className='mb-4 flex items-center gap-3'>
            <div className='h-px flex-1 bg-white/10' />
            <span className='text-[10px] font-semibold uppercase tracking-[0.28em] text-secondary'>
              {t.tours}
            </span>
            <div className='h-px flex-1 bg-white/10' />
          </div>

          <ul className='space-y-2'>
            {categories.map((categoryGroup) => {
              const hasTrips = Array.isArray(categoryGroup?.trips)
                ? categoryGroup.trips.length > 0
                : false;
              const isOpen = openMobileCategory === categoryGroup.category;
              const categoryMeta = getHeaderCategoryMeta(
                categoryGroup?.category,
                locale,
              );
              const categoryLabel = categoryGroup?.title || categoryMeta.title;

              return (
                <li key={categoryGroup.category}>
                  <button
                    type='button'
                    onClick={() => toggleMobileCategory(categoryGroup.category)}
                    aria-expanded={isOpen}
                    aria-controls={`mobile-category-${categoryGroup.category}`}
                    className='flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left uppercase tracking-[0.08em] text-white transition-colors hover:bg-white/10'>
                    <span className='text-sm font-semibold'>
                      {categoryLabel}
                    </span>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 20 20'
                      fill='none'
                      className={`h-4 w-4 text-secondary transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}>
                      <path
                        d='M5 8l5 5 5-5'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </button>

                  <div
                    id={`mobile-category-${categoryGroup.category}`}
                    className={isOpen ? 'block' : 'hidden'}>
                    <div className='mt-2 rounded-2xl border border-white/10 bg-white/5 p-2'>
                      {hasTrips ? (
                        <ul className='space-y-1'>
                          {categoryGroup.trips.map((trip) => (
                            <li key={`${categoryGroup.category}-${trip.slug}`}>
                              <Link
                                href={`/${normalizeCategorySlug(trip.category || categoryGroup.category)}/${trip.slug}`}
                                onClick={closeMobileMenu}
                                className='flex items-start gap-3 rounded-xl px-3 py-3 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white'>
                                <span className='mt-1 h-2 w-2 shrink-0 rounded-full bg-secondary' />
                                <span>{trip.title}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className='px-3 py-3 text-sm text-white/60'>
                          {loading ? t.loading : t.coming_soon}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className='border-t border-white/10 px-4 py-4'>
          <div className='mb-4 flex items-center justify-center gap-3'>
            {socialLinks.map((social) =>
              social.href ? (
                <Link
                  key={social.key}
                  href={social.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/75 transition-colors hover:bg-white/10 hover:text-secondary'
                  aria-label={social.label}>
                  <span className='h-5 w-5'>{social.icon}</span>
                </Link>
              ) : null,
            )}
          </div>

          <Link
            href='/contact'
            onClick={closeMobileMenu}
            className='block rounded-full bg-[#e6c200] px-4 py-3 text-center text-sm font-bold uppercase tracking-[0.14em] text-primary transition-colors hover:bg-[#e6c200]/90'>
            {t.enquire}
          </Link>
        </div>
      </aside>

      <div className='header-desktop-shell hidden w-full bg-primary pt-4 text-white lg:block'>
        <div className='flex items-center justify-around'>
          <Link href='/' aria-label={logoAlt}>
            <div>
              <Image
                src='/assets/logo-Booking.svg'
                alt={logoAlt}
                className='h-10 lg:h-12'
                width={150}
                height={50}
              />
            </div>
          </Link>

          <div className='flex items-center gap-4 text-nowrap text-sm text-white/50 2xl:text-lg'>
            {secondaryLinks.map((link, index) => (
              <div key={link.label} className='flex items-center gap-4'>
                {index > 0 && <div className='h-5 w-px bg-white/20' />}
                <Link href={link.href}>{link.label}</Link>
              </div>
            ))}
          </div>

          <div className='flex gap-3'>
            <div className='flex gap-2'>
              <button
                onClick={() => changeLanguage('en')}
                className='flex gap-2 items-center'>
                <USFlag
                  className={`w-6 2xl:w-8 rounded-sm ${router.locale === 'en' ? 'drop-shadow-[0px_0px_5px_white]' : ''}`}
                />
              </button>
              <div className='contact-divider'></div>
              <button
                onClick={() => changeLanguage('es')}
                className='flex gap-2 items-center'>
                <ESFlag
                  className={`w-6 2xl:w-8 rounded-sm ${router.locale === 'es' ? 'drop-shadow-[0px_0px_5px_white]' : ''}`}
                />
              </button>
            </div>

            <div className='contact-divider'></div>
            <div className='flex gap-2 items-center'>
              {socialLinks.map((social) =>
                social.href ? (
                  <Link
                    key={social.key}
                    href={social.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='size-5 text-white/50 transition-colors duration-300 hover:text-secondary 2xl:size-7'
                    aria-label={social.label}>
                    {social.icon}
                  </Link>
                ) : null,
              )}
            </div>
            <div className='contact-divider'></div>
            <div className='flex items-center'>
              <Link
                href='/contact'
                className='bg-[#e6c200] px-4 py-2 rounded-full text-nowrap text-xs 2xl:text-sm font-bold uppercase text-primary hover:bg-[#e6c200]/90 transition-colors duration-300'>
                {t.enquire}
              </Link>
            </div>
          </div>
        </div>
        <div className='border-t border-white/10'></div>
        <div className='flex w-full p-4'>
          <nav className='relative w-full'>
            <ul className='flex w-full items-center justify-center gap-2 px-8 text-xs font-medium 2xl:text-sm lg:gap-4 xl:gap-6 3xl:gap-8'>
              {categories.map((categoryGroup) => {
                const hasTrips = Array.isArray(categoryGroup?.trips)
                  ? categoryGroup.trips.length > 0
                  : false;
                const isInteractive = hasTrips && !loading;
                const categoryMeta = getHeaderCategoryMeta(
                  categoryGroup?.category,
                  locale,
                );
                const categoryLabel =
                  categoryGroup?.title || categoryMeta.title;
                const isActive = activeCategory === categoryGroup.category;

                return (
                  <li key={categoryGroup.category}>
                    <button
                      type='button'
                      aria-disabled={!isInteractive}
                      onMouseEnter={() => {
                        if (!isInteractive) return;
                        setActiveCategory(categoryGroup.category);
                      }}
                      onClick={() => {
                        if (!isInteractive) return;
                        setActiveCategory((current) =>
                          current === categoryGroup.category
                            ? null
                            : categoryGroup.category,
                        );
                      }}
                      className={[
                        'relative flex items-center gap-1 uppercase transition-opacity',
                        isInteractive ? 'group' : 'cursor-default opacity-90',
                      ].join(' ')}>
                      {categoryLabel}
                      <span
                        className={[
                          'absolute left-0 bottom-0 h-[2px] bg-current transition-all',
                          isActive
                            ? 'w-full'
                            : isInteractive
                              ? 'w-0 group-hover:w-full'
                              : 'w-0',
                        ].join(' ')}></span>
                      {isInteractive && (
                        <span aria-hidden='true'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 20 20'
                            fill='none'
                            className={`h-3 w-3 text-white/80 transition-transform duration-200 ${isActive ? 'rotate-180' : 'rotate-0'}`}>
                            <path
                              d='M5 8l5 5 5-5'
                              stroke='currentColor'
                              strokeWidth='2'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </svg>
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            {activeCategory && activePanelItems.length > 0 && (
              <div
                className='absolute top-full w-full'
                onMouseEnter={() => setActiveCategory(activeCategory)}
                onMouseLeave={() => setActiveCategory(null)}>
                <TourPanel
                  items={activePanelItems}
                  title={activeCategoryTitle}
                />
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
