import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import en from '../../lang/en/home';
import es from '../../lang/es/home';
import Image from 'next/image';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

export default function Section1() {
    const router = useRouter();
    const { locale } = router;
    const t = locale === 'en' ? en : es;
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loaded, setLoaded] = useState(false);

    const [sliderRef, instanceRef] = useKeenSlider({
        initial: 0,
        loop: true,
        mode: "snap",
        slides: {
            origin: "center",
            perView: 1.2,
            spacing: 16,
        },
        breakpoints: {
            "(min-width: 640px)": {
                slides: { origin: "center", perView: 2.2, spacing: 20 },
            },
            "(min-width: 1024px)": {
                slides: { origin: "center", perView: 3.5, spacing: 24 },
            },
            "(min-width: 1280px)": {
                slides: { origin: "center", perView: 4, spacing: 28 },
            },
        },
        slideChanged(slider) {
            setCurrentSlide(slider.track.details.rel);
        },
        created() {
            setLoaded(true);
        },
    });

    // Autoplay
    useEffect(() => {
        if (!instanceRef.current) return;

        const interval = setInterval(() => {
            instanceRef.current?.next();
        }, 4000);

        return () => clearInterval(interval);
    }, [instanceRef]);

    return (
        <section className="why-us-carousel-section">
            {/* Fondo decorativo */}
            <div className="why-us-carousel-bg"></div>

            <div className="why-us-carousel-container">
                {/* Encabezado */}
                <div className="why-us-carousel-header">
                    <span className="why-us-carousel-label">
                        {locale === 'en' ? 'Your Trusted Partner' : 'Tu Socio de Confianza'}
                    </span>
                    <h2 className="why-us-carousel-title">{t.h2_title_why}</h2>
                    <p className="why-us-carousel-subtitle">{t.h3_subtitle}</p>
                    <div className="why-us-carousel-divider">
                        <div className="divider-line long"></div>
                        <div className="divider-line medium"></div>
                        <div className="divider-line short"></div>
                    </div>
                </div>

                {/* Carrusel */}
                <div className="why-us-slider-wrapper">
                    <div ref={sliderRef} className="keen-slider why-us-slider">
                        {t.array.map((item, index) => {
                            const isCenter = currentSlide === index;
                            return (
                                <div
                                    key={index}
                                    className={`keen-slider__slide why-us-slide ${isCenter ? 'center-slide' : ''}`}
                                >
                                    <div className={`why-us-carousel-card ${isCenter ? 'active' : ''}`}>
                                        {/* Número decorativo */}
                                        <span className="carousel-card-number">0{index + 1}</span>

                                        {/* Icono SVG grande */}
                                        <div className="carousel-icon-wrapper">
                                            <div className="carousel-icon">
                                                <Image
                                                    src={item.img}
                                                    alt={item.title}
                                                    width={120}
                                                    height={120}
                                                    className="carousel-svg-icon"
                                                />
                                            </div>
                                        </div>

                                        {/* Contenido */}
                                        <div className="carousel-card-content">
                                            <h3 className="carousel-card-title">{item.title}</h3>
                                            <p className="carousel-card-description">{item.content}</p>
                                        </div>

                                        {/* Línea decorativa */}
                                        <div className="carousel-accent-line"></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Controles de navegación */}
                    {loaded && instanceRef.current && (
                        <>
                            <button
                                className="why-us-nav-arrow prev"
                                onClick={() => instanceRef.current?.prev()}
                                aria-label="Anterior"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <button
                                className="why-us-nav-arrow next"
                                onClick={() => instanceRef.current?.next()}
                                aria-label="Siguiente"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </>
                    )}
                </div>

                {/* Indicadores de puntos */}
                <div className="why-us-carousel-dots">
                    {t.array.map((_, idx) => (
                        <button
                            key={idx}
                            className={`carousel-dot ${currentSlide === idx ? 'active' : ''}`}
                            onClick={() => instanceRef.current?.moveToIdx(idx)}
                            aria-label={`Ir a slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
