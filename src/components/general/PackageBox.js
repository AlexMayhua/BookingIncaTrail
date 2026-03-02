import { useKeenSlider } from 'keen-slider/react';
import Card from './Card';
import { useState } from 'react';

export default function PackageBox({ getTreks, numcard }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loaded, setLoaded] = useState(false);

    const [sliderRef, instanceRef] = useKeenSlider({
        initial: 0,
        slides: {
            perView: numcard,
            spacing: 10,
        },
        breakpoints: {
            '(max-width: 768px)': {
                slides: { perView: 2, spacing: 10 },
            },
            '(max-width: 480px)': {
                slides: { perView: 1, spacing: 10 },
            },
        },
        slideChanged(slider) {
            setCurrentSlide(slider.track.details.rel);
        },
        created() {
            setLoaded(true);
        },
    });

    return (
        <div className="relative">
            <div ref={sliderRef} className="keen-slider">
                {getTreks.map((item) => (
                    <div key={item._id} className="keen-slider__slide px-2.5">
                        <Card
                            title={item.title}
                            description={item.card_description}
                            id={item._id}
                            image={item.image}
                            price={item.price}
                            difficulty={item.difficulty}
                            group_size={item.group_size}
                            category={item.category}
                        />
                    </div>
                ))}
            </div>

            {loaded && instanceRef.current && getTreks.length > numcard && (
                <>
                    <button
                        onClick={() => instanceRef.current?.prev()}
                        disabled={currentSlide === 0}
                        className={`absolute left-0 top-1/2 -translate-y-1/2 bg-white hover:bg-secondary text-primary rounded-full p-2 shadow-lg z-10 transition-all ${
                            currentSlide === 0 ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        aria-label="Previous slide"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
                        </svg>
                    </button>

                    <button
                        onClick={() => instanceRef.current?.next()}
                        disabled={currentSlide === instanceRef.current.track.details.slides.length - numcard}
                        className={`absolute right-0 top-1/2 -translate-y-1/2 bg-white hover:bg-secondary text-primary rounded-full p-2 shadow-lg z-10 transition-all ${
                            currentSlide === instanceRef.current.track.details.slides.length - numcard
                                ? 'opacity-50 cursor-not-allowed'
                                : ''
                        }`}
                        aria-label="Next slide"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                        </svg>
                    </button>
                </>
            )}
        </div>
    );
}