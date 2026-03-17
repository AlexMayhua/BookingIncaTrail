import Link from 'next/link';
import en from '../../lang/en/footer';
import es from '../../lang/es/footer';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useRouter } from 'next/router';
import { BRAND } from '../../lib/brandConfig';
import { useState } from 'react';
import Image from 'next/image';

// Componente para iconos de redes sociales con hover de color real
function SocialIcon({ href, icon, label, brandColor }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      aria-label={label}
      className='footer-social-icon'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '42px',
        height: '42px',
        borderRadius: '12px',
        background: isHovered ? brandColor : 'rgba(255, 255, 255, 0.05)',
        border: `1px solid ${isHovered ? brandColor : 'rgba(255, 255, 255, 0.1)'}`,
        color: isHovered ? '#ffffff' : '#8B949E',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered ? `0 8px 24px ${brandColor}50` : 'none',
      }}>
      <svg width='18' height='18' viewBox='0 0 24 24' fill='currentColor'>
        <path d={icon} />
      </svg>
    </a>
  );
}

// Datos de redes sociales con colores de marca
const socialNetworks = [
  {
    key: 'facebook',
    icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
    label: 'Facebook',
    brandColor: '#1877F2',
  },
  {
    key: 'instagram',
    icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
    label: 'Instagram',
    brandColor: '#E4405F',
  },
  {
    key: 'tiktok',
    icon: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
    label: 'TikTok',
    brandColor: '#000000',
  },
  {
    key: 'youtube',
    icon: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
    label: 'YouTube',
    brandColor: '#FF0000',
  },
  {
    key: 'whatsapp',
    icon: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z',
    label: 'WhatsApp',
    brandColor: '#25D366',
  },
];

export default function Footer() {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'en' ? en : es;

  return (
    <footer className='print:hidden footer-modern'>
      {/* Línea decorativa superior con gradiente */}
      <div className='footer-top-accent'></div>

      {/* Contenido principal */}
      <div className='footer-content'>
        <div className='footer-grid'>
          {/* Columna 1: Logo + Descripción + Redes */}
          <div className='footer-brand-column'>
            <Link href='/' className='footer-logo'>
              <Image
                src='/assets/logo-Booking.svg'
                alt='Booking Inca Trail Logo'
                className='h-16 w-40'
                width={40}
                height={16}
                size='80px'
              />
            </Link>

            <p className='footer-description'>{t.slogan}</p>

            {/* Redes Sociales con colores de marca en hover */}
            <div className='footer-social-icons'>
              {socialNetworks.map((social) => (
                <SocialIcon
                  key={social.key}
                  href={BRAND.social[social.key] || '#'}
                  icon={social.icon}
                  label={social.label}
                  brandColor={social.brandColor}
                />
              ))}
            </div>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div className='footer-links-column'>
            <h3 className='footer-column-title'>
              <span className='title-accent'></span>
              {t.company}
            </h3>
            <ul className='footer-links'>
              {[
                { href: '/about-us', label: t.about },
                { href: '/terms-conditions', label: t.terms },
                {
                  href: '/terms-conditions/complaintsBook',
                  label: t.complaintsBook,
                },
                { href: '/contact', label: t.contact },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className='footer-link'>
                    <svg
                      className='link-arrow'
                      viewBox='0 0 24 24'
                      fill='currentColor'>
                      <path d='M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z' />
                    </svg>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Servicios */}
          <div className='footer-links-column'>
            <h3 className='footer-column-title'>
              <span className='title-accent'></span>
              {t.ourservices}
            </h3>
            <ul className='footer-links'>
              {[
                { href: '/inca-trail', label: t.IncaTrail },
                { href: '/salkantay', label: t.SalkantayTrek },
                { href: '/machupicchu', label: t.MachupicchuTour },
                { href: '/ausangate', label: t.AusangateTreks },
                { href: '/peru-packages', label: t.PeruPackages },
                { href: '/day-tours', label: t.DayTours },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className='footer-link'>
                    <svg
                      className='link-arrow'
                      viewBox='0 0 24 24'
                      fill='currentColor'>
                      <path d='M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z' />
                    </svg>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div className='footer-contact-column'>
            <h3 className='footer-column-title'>
              <span className='title-accent'></span>
              {t.contactos}
            </h3>

            <div className='footer-contact-cards'>
              {/* Teléfono */}
              <a
                href={`tel:${BRAND.contactPhone}`}
                className='footer-contact-card'>
                <span className='contact-icon phone-icon'>
                  <svg viewBox='0 0 24 24' fill='currentColor'>
                    <path d='M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z' />
                  </svg>
                </span>
                <span className='contact-text'>{BRAND.contactPhone}</span>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${BRAND.whatsapp?.replace(/\D/g, '')}`}
                target='_blank'
                rel='noopener noreferrer'
                className='footer-contact-card whatsapp-card'>
                <span className='contact-icon whatsapp-icon'>
                  <svg viewBox='0 0 24 24' fill='currentColor'>
                    <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z' />
                  </svg>
                </span>
                <span className='contact-text'>{t.whatsapp}</span>
              </a>

              {/* Email */}
              <Link href='/contact' className='footer-contact-card'>
                <span className='contact-icon email-icon'>
                  <svg viewBox='0 0 24 24' fill='currentColor'>
                    <path d='M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z' />
                  </svg>
                </span>
                <span className='contact-text'>{t.sendmail}</span>
              </Link>

              {/* Ubicación */}
              <a
                href='https://maps.app.goo.gl/qFAvCyjs4FFXtf1B7'
                target='_blank'
                rel='noopener noreferrer'
                className='footer-contact-card'>
                <span className='contact-icon location-icon'>
                  <svg viewBox='0 0 24 24' fill='currentColor'>
                    <path d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z' />
                  </svg>
                </span>
                <span className='contact-text'>{t.address}</span>
              </a>
            </div>

            {/* Info empresa */}
            <div className='footer-company-info'>
              <p className='company-name'>{t.company_name}</p>
              <p className='company-ruc'>{t.ruc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Separador */}
      <div className='footer-separator'></div>

      {/* Métodos de pago */}
      <div className='footer-payment'>
        <span className='payment-label'>{t.method}</span>
        <LazyLoadImage
          src='/img/footer/metodos-de-pago.svg'
          alt='Payment Methods'
          className='payment-methods-img'
        />
        <span className='payment-label'>{t.payment}</span>
      </div>

      {/* Copyright */}
      <div className='footer-copyright'>
        <p className='copyright-text'>
          © {new Date().getFullYear()} Booking Inca Trail. {t.copyright}{' '}
          <Link href='https://lifexpeditions.com/' className='copyright-text' >
            Life Expeditions
          </Link >
        </p>
        <div className='copyright-links'>
          <Link href='/terms-conditions' className='copyright-link'>
            {t.privacy_policy}
          </Link>
          <Link href='/sitemap.xml' className='copyright-link'>
            {t.sitemap}
          </Link>
        </div>
      </div>
    </footer>
  );
}
