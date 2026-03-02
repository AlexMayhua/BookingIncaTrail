import { useState } from 'react';
import { useRouter } from 'next/router';
import { useKeenSlider } from 'keen-slider/react';
import Link from 'next/link';
import en from '../../lang/en/home';
import es from '../../lang/es/home';

function AutoplayPlugin(slider) {
    let timeout;
    let mouseOver = false;

    function clearNextTimeout() {
        clearTimeout(timeout);
    }

    function nextTimeout() {
        clearTimeout(timeout);
        if (mouseOver) return;
        timeout = setTimeout(() => {
            if (slider && slider.track && slider.track.details) {
                slider.next();
            }
        }, 4000);
    }

    slider.on("created", () => {
        slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearNextTimeout();
        });
        slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            nextTimeout();
        });
        nextTimeout();
    });
    slider.on("dragStarted", clearNextTimeout);
    slider.on("animationEnded", nextTimeout);
    slider.on("updated", nextTimeout);
}

export default function ServicesCarousel({ services = [] }) {
    const router = useRouter();
    const { locale } = router;
    const t = locale === 'en' ? en : es;

    const [currentSlide, setCurrentSlide] = useState(0);
    const safeServices = Array.isArray(services) ? services : [];

    const [sliderRef, instanceRef] = useKeenSlider(
        {
            loop: true,
            slides: { perView: 1, spacing: 16 },
            breakpoints: {
                '(min-width: 640px)': {
                    slides: { perView: 2, spacing: 20 },
                },
                '(min-width: 1024px)': {
                    slides: { perView: 3, spacing: 24 },
                },
                '(min-width: 1280px)': {
                    slides: { perView: 4, spacing: 28 },
                },
            },
            created(slider) {
                if (slider.track.details && slider.track.details.slides) {
                    setCurrentSlide(slider.track.details.rel);
                }
            },
            slideChanged(slider) {
                if (slider.track.details) {
                    setCurrentSlide(slider.track.details.rel);
                }
            },
        },
        [AutoplayPlugin]
    );

    if (safeServices.length === 0) {
        return null;
    }

    return (
        <section className="services-carousel-section">
            <div className="services-carousel-container">
                {/* Encabezado */}
                <div className="services-carousel-header">
                    <span className="section-label">
                        {locale === 'en' ? 'Discover Peru' : 'Descubre Perú'}
                    </span>
                    <h2 className="section-title">
                        {locale === 'en' ? 'Featured Adventures' : 'Aventuras Destacadas'}
                    </h2>
                    <p className="section-subtitle">
                        {locale === 'en'
                            ? 'Carefully selected experiences showcasing the best of Peru'
                            : 'Experiencias cuidadosamente seleccionadas que muestran lo mejor del Perú'}
                    </p>
                </div>

                {/* Slider */}
                {/* Slider */}
                <div className="services-slider-wrapper">
                    <div ref={sliderRef} className="keen-slider services-slider">
                        {safeServices.map((item, idx) => {
                            const isCenter = currentSlide === idx;
                            return (
                                <div className={`keen-slider__slide ${isCenter ? 'center-slide' : ''}`} key={item.slug || item._id}>
                                    <Link href={`/${item.category}/${item.slug}`} className="tour-card services-tour-card">
                                        {/* Imagen de fondo */}
                                        <div className="tour-card-image">
                                            <img
                                                src={item.gallery?.[0]?.url || '/img/hero/hero-machu-picchu.webp'}
                                                alt={item.gallery?.[0]?.alt || item.title}
                                                title={item.gallery?.[0]?.alt || item.title}
                                                loading="lazy"
                                            />
                                        </div>

                                        {/* Overlay gradiente */}
                                        <div className="tour-card-overlay"></div>

                                        {/* Badge de descuento */}
                                        {item.discount > 0 && (
                                            <div className="tour-card-badge">
                                                -{item.discount}%
                                            </div>
                                        )}

                                        {/* Contenido */}
                                        <div className="tour-card-content">
                                            {/* Información básica */}
                                            <div className="tour-card-info">
                                                <span className="tour-card-category">
                                                    {item.quickstats?.[0]?.content || item.category?.replace(/-/g, ' ') || 'Adventure'}
                                                </span>
                                                <h3 className="tour-card-title">{item.title}</h3>
                                            </div>

                                            {/* Footer con precio y duración */}
                                            <div className="tour-card-footer">
                                                <div className="tour-card-duration">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>{item.duration}</span>
                                                </div>
                                                <div className="tour-card-price">
                                                    <span className="price-label">{t?.from || 'From'}</span>
                                                    {item.discount > 0 ? (
                                                        <>
                                                            <span className="price-old">${item.price}</span>
                                                            <span className="price-current">
                                                                ${((item.price - item.price * item.discount / 100)).toFixed(0)}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="price-current">${item.price}</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Botón de acción (aparece en hover) */}
                                            <div className="tour-card-action">
                                                <span className="tour-card-btn">
                                                    {t?.btn_viewtrip || 'View Trip'}
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Navegación - Solo dots, estilo Why Us */}
                <div className="services-carousel-nav">
                    <div className="nav-dots">
                        {safeServices.slice(0, Math.min(safeServices.length, 8)).map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => instanceRef.current?.moveToIdx(idx)}
                                className={`nav-dot ${currentSlide === idx ? 'active' : ''}`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* CTA Ver todos */}
                <div className="services-carousel-cta">
                    <Link href="/inca-trail" className="view-all-btn">
                        {locale === 'en' ? 'View All Tours' : 'Ver Todos los Tours'}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
