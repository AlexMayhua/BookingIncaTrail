import { useRouter } from 'next/router';
import en from '../../lang/en/home';
import es from '../../lang/es/home';
import { useEffect, useState } from 'react';
import { getVideoUrl, getImageUrl } from '../../utils/cacheHelpers';
import Link from 'next/link';
import HeroToursCarousel from './HeroToursCarousel';

export default function FrontPage({ topTours = [] }) {
    const router = useRouter();
    const { locale } = router;
    const t = locale === 'en' ? en : es;

    const [isMobile, setIsMobile] = useState(false);
    const [videoSrc, setVideoSrc] = useState(null);
    const [posterSrc, setPosterSrc] = useState(null);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth <= 767;
            setIsMobile(mobile);

            // Lazy load: solo establecer URLs de video después de un delay
            // Priorizar la carga de poster primero
            setPosterSrc(
                mobile
                    ? getImageUrl('/img/other/FrontPageMobile.webp', true)
                    : getImageUrl('/img/other/FrontPage.webp', true)
            );

            // Retrasar carga de video para priorizar contenido crítico
            setTimeout(() => {
                setVideoSrc(
                    mobile
                        ? getVideoUrl('/img/other/FrontPageMobile.mp4')
                        : getVideoUrl('/img/other/FrontPage.mp4')
                );
            }, 1000); // 1 segundo de delay
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const safeTours = Array.isArray(topTours) ? topTours : [];

    return (
        <section className="hero-section hero-split-layout">
            {/* Video de fondo sin overlay oscuro */}
            {videoSrc && (
                <video
                    autoPlay
                    muted
                    loop
                    preload="metadata"
                    poster={posterSrc}
                    className="hero-video"
                    aria-label="Inca Trail To Machu Picchu"
                    playsInline
                    onError={(e) => {
                        console.warn('Error cargando video:', e.target.src);
                        e.target.style.display = 'none';
                    }}
                >
                    <source src={videoSrc} type="video/mp4" />
                    <img
                        src={posterSrc}
                        alt="Inca Trail To Machu Picchu"
                        className="hero-video"
                        onError={(e) => {
                            console.warn('Error cargando imagen poster:', e.target.src);
                            e.target.src = '/home/hero.jpg';
                        }}
                    />
                </video>
            )}

            {/* Overlay muy sutil solo para legibilidad */}
            <div className="hero-overlay"></div>

            {/* Contenido dividido en dos columnas */}
            <div className="hero-content hero-content-split">
                {/* Columna Izquierda - Contenido Principal */}
                <div className="hero-left-column">
                    <div className="hero-content-inner hero-content-left">
                        {/* Badge de confianza */}
                        <div className="hero-badge">
                            <span className="hero-badge-dot"></span>
                            {locale === 'en' ? '100% Local Peruvian Agency' : '100% Agencia Local Peruana'}
                        </div>

                        {/* Título principal */}
                        <h1 className="hero-title">
                            {locale === 'en'
                                ? 'Discover the Magic of Peru'
                                : 'Descubre la Magia de Perú'
                            }
                        </h1>

                        {/* Subtítulo */}
                        <p className="hero-subtitle">
                            {locale === 'en'
                                ? 'Expert Inca Trail & Machu Picchu Adventures'
                                : 'Expertos en Camino Inca y Aventuras a Machu Picchu'
                            }
                        </p>

                        {/* Botones CTA */}
                        <div className="hero-cta-group">
                            <Link href="/contact" className="hero-btn-primary">
                                {locale === 'en' ? 'Book Your Adventure' : 'Reserva Tu Aventura'}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </Link>
                            <Link href="/inca-trail" className="hero-btn-secondary">
                                {locale === 'en' ? 'View Tours' : 'Ver Tours'}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </Link>
                        </div>

                        {/* Stats compactos */}
                        <div className="hero-stats">
                            <div className="hero-stat">
                                <span className="hero-stat-number">10+</span>
                                <span className="hero-stat-label">{locale === 'en' ? 'Years' : 'Años'}</span>
                            </div>
                            <div className="hero-stat-divider"></div>
                            <div className="hero-stat">
                                <span className="hero-stat-number">8.9K+</span>
                                <span className="hero-stat-label">{locale === 'en' ? 'Travelers' : 'Viajeros'}</span>
                            </div>
                            <div className="hero-stat-divider"></div>
                            <div className="hero-stat">
                                <span className="hero-stat-number">4.9</span>
                                <span className="hero-stat-label">★ Rating</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Columna Derecha - Carrusel de Top Tours */}
                <div className="hero-right-column">
                    {safeTours.length > 0 && (
                        <div className="hero-tours-wrapper">
                            <div className="hero-tours-header">
                                <span className="hero-tours-label">
                                    {locale === 'en' ? 'Featured Tours' : 'Tours Destacados'}
                                </span>
                            </div>
                            <HeroToursCarousel tours={safeTours} t={t} />
                        </div>
                    )}
                </div>
            </div>

            {/* Indicador de scroll */}
            <div className="hero-scroll-indicator">
                <div className="hero-scroll-mouse">
                    <div className="hero-scroll-wheel"></div>
                </div>
            </div>
        </section>
    );
}