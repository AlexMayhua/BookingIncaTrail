import { useState } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import Link from 'next/link';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useRouter } from 'next/router';
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

export default function CategorySlider({ categories }) {
    const router = useRouter();
    const { locale } = router;
    const t = locale === 'en' ? en : es;
    const [currentSlide, setCurrentSlide] = useState(0);
    const [dots, setDots] = useState([]);
    const safeCategories = Array.isArray(categories) ? categories : [];

    const [sliderRef, instanceRef] = useKeenSlider(
        {
            loop: true,
            slides: { perView: 1.15, spacing: 16 },
            breakpoints: {
                '(min-width: 640px)': {
                    slides: { perView: 2.2, spacing: 20 },
                },
                '(min-width: 1024px)': {
                    slides: { perView: 3.5, spacing: 24 },
                },
                '(min-width: 1400px)': {
                    slides: { perView: 4, spacing: 24 },
                },
            },
            created(slider) {
                if (slider.track.details && slider.track.details.slides) {
                    setDots([...Array(slider.track.details.slides.length).keys()]);
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

    return (
        <div className="featured-tours-container">
            {/* Slider */}
            <div ref={sliderRef} className="keen-slider featured-tours-slider">
                {safeCategories.map((category) => (
                    <div className='keen-slider__slide' key={category.slug}>
                        <Link href={`/category/${category.slug}`} className="tour-card">
                            {/* Imagen de fondo */}
                            <div className="tour-card-image">
                                <LazyLoadImage
                                    src={category.image}
                                    alt={category.name}
                                    title={category.name}
                                />
                            </div>

                            {/* Overlay gradiente */}
                            <div className="tour-card-overlay"></div>

                            {/* Badge con cantidad de tours */}
                            <div className="tour-card-badge" style={{ background: 'linear-gradient(135deg, #e6c200 0%, #d4b000 100%)' }}>
                                {category.count} {category.count === 1 ? 'tour' : 'tours'}
                            </div>

                            {/* Contenido siempre visible */}
                            <div className="tour-card-content">
                                {/* Información básica */}
                                <div className="tour-card-info">
                                    <span className="tour-card-category">
                                        {t.category}
                                    </span>
                                    <h3 className="tour-card-title">{category.name}</h3>
                                    <p className="tour-card-description">
                                        {category.description}
                                    </p>
                                </div>

                                {/* Footer con información */}
                                <div className="tour-card-footer">
                                    <div className="tour-card-duration">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Perú</span>
                                    </div>
                                </div>

                                {/* Botón de acción (aparece en hover) */}
                                <div className="tour-card-action">
                                    <span className="tour-card-btn">
                                        {t.view_tours}
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

            {/* Navegación */}
            <div className="featured-tours-nav">
                {/* Flecha izquierda */}
                <button
                    onClick={() => instanceRef.current?.prev()}
                    className="nav-arrow nav-arrow-prev"
                    aria-label="Previous"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
                    </svg>
                </button>

                {/* Dots */}
                <div className="nav-dots">
                    {dots.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => instanceRef.current?.moveToIdx(idx)}
                            className={`nav-dot ${currentSlide === idx ? 'active' : ''}`}
                            aria-label={`Ir al slide ${idx + 1}`}
                        />
                    ))}
                </div>

                {/* Flecha derecha */}
                <button
                    onClick={() => instanceRef.current?.next()}
                    className="nav-arrow nav-arrow-next"
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

