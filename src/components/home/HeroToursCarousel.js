import { useState, useEffect } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import Link from 'next/link';

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

export default function HeroToursCarousel({ tours, t }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const safeTours = Array.isArray(tours) ? tours : [];

    // Garantizar al menos 3 slides para loop correcto
    const slidesToShow = safeTours.length === 0 ? [] :
        safeTours.length === 1 ? [safeTours[0], safeTours[0], safeTours[0]] :
            safeTours.length === 2 ? [...safeTours, ...safeTours] :
                safeTours;

    const [sliderRef, instanceRef] = useKeenSlider(
        {
            loop: slidesToShow.length >= 3,
            mode: "snap",
            slides: {
                perView: 1,
                spacing: 0
            },
            defaultAnimation: {
                duration: 800
            },
            created(slider) {
                setTimeout(() => {
                    if (slider && slider.track) {
                        slider.update();
                    }
                }, 200);
            },
            slideChanged(slider) {
                if (slider.track.details) {
                    const realIndex = slider.track.details.rel % (safeTours.length || 1);
                    setCurrentSlide(realIndex);
                }
            },
        },
        slidesToShow.length >= 3 ? [AutoplayPlugin] : []
    );

    // Validación después de los hooks
    if (safeTours.length === 0) {
        return null;
    }

    return (
        <div className="hero-tours-carousel-horizontal">
            {/* Slider horizontal - un tour a la vez */}
            <div ref={sliderRef} className="keen-slider hero-tours-slider-horizontal">
                {slidesToShow.map((item, index) => (
                    <div className='keen-slider__slide' key={`${item.slug}-${index}`}>
                        <Link href={`/${item.category}/${item.slug}`} className="tour-card hero-tour-card-single">
                            {/* Imagen de fondo */}
                            <div className="tour-card-image">
                                <img
                                    src={item.gallery[0]?.url}
                                    alt={item.gallery[0]?.alt || item.title}
                                    title={item.gallery[0]?.alt || item.title}
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

                            {/* Contenido siempre visible */}
                            <div className="tour-card-content">
                                {/* Información básica */}
                                <div className="tour-card-info">
                                    <span className="tour-card-category">
                                        {item.quickstats?.[0]?.content || 'Adventure'}
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
                ))}
            </div>

            {/* Navegación horizontal */}
            <div className="hero-tours-nav-horizontal">
                {/* Flecha izquierda */}
                <button
                    onClick={() => instanceRef.current?.prev()}
                    className="hero-nav-arrow"
                    aria-label="Previous"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
                    </svg>
                </button>

                {/* Dots */}
                <div className="hero-nav-dots-horizontal">
                    {safeTours.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => instanceRef.current?.moveToIdx(idx)}
                            className={`hero-nav-dot-h ${currentSlide === idx ? 'active' : ''}`}
                            aria-label={`Ir al slide ${idx + 1}`}
                        />
                    ))}
                </div>

                {/* Flecha derecha */}
                <button
                    onClick={() => instanceRef.current?.next()}
                    className="hero-nav-arrow"
                    aria-label="Next"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
