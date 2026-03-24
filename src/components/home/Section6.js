import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import en from '../../lang/en/home';
import es from '../../lang/es/home';
import Link from 'next/link';
import { useKeenSlider } from 'keen-slider/react';
import Image from 'next/image';

const reviews = [
    {
        user: 'Burcu D',
        avatar: 'BD',
        title: 'A good, trustworthy, professional experience for solo travellers',
        comment: 'I was a very last minute customer for them yet they arranged everything for me. As a solo traveller, it is always a bit bumpy if you are visiting a country like Peru, where most of the people don\'t know English. I felt like somebody that I trusted took my hand and created me a life time experience without any delays...',
        date: 'Apr 2025',
        type: 'Solo',
        rating: 5,
        url: 'https://www.tripadvisor.com/ShowUserReviews-g294314-d12614123-r1003117911-Life_Expeditions-Cusco_Cusco_Region.html'
    },
    {
        user: 'Rom S',
        avatar: 'RS',
        title: 'Great tour all around, great activities on the way to Machu Picchu',
        comment: 'We had a great time doing this 4 day tour. The activities were fun and the food and accommodations were great. Our guide Ricardo was excellent, he knows so much about the area, history and especially about coffee.',
        date: 'Mar 2025',
        type: 'Couples',
        rating: 5,
        url: 'https://www.tripadvisor.com/ShowUserReviews-g294314-d12614123-r1000972948-Life_Expeditions-Cusco_Cusco_Region.html'
    },
    {
        user: 'Carolina M',
        avatar: 'CM',
        title: 'We traveled as a mother and daughter and had an amazing time',
        comment: 'Wonderful scenery, attention, hotels, a thousand photos the guides 🥰 the agency ported a 10 out of 10 served us better than at home, all personalized 🫶',
        date: 'Feb 2025',
        type: 'Family',
        rating: 5,
        url: 'https://www.tripadvisor.com/ShowUserReviews-g294314-d12614123-r996189657-Life_Expeditions-Cusco_Cusco_Region.html'
    },
    {
        user: 'Emilia A',
        avatar: 'EA',
        title: 'Amazing experience!!',
        comment: 'If you are thinking of booking with Life Expeditions, I 100% recommend you do!! They are a wonderful company, genuinely local and small scale, so they focus on each person to ensure you have the best experience.',
        date: 'Jan 2025',
        type: 'Couples',
        rating: 5,
        url: 'https://www.tripadvisor.com/ShowUserReviews-g294314-d12614123-r988452390-Life_Expeditions-Cusco_Cusco_Region.html'
    },
    {
        user: 'Adi A',
        avatar: 'AA',
        title: 'Best experience ever',
        comment: 'I went with Life Expedition agency to the classic Inca trail of 4 days. It\'s my first time trekking so I didn\'t know what to expect. And it was amazing! The food was delicious and super creative.',
        date: 'Sep 2024',
        type: 'Solo',
        rating: 5,
        url: 'https://www.tripadvisor.com/ShowUserReviews-g294314-d12614123-r970628263-Life_Expeditions-Cusco_Cusco_Region.html'
    },
];

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
            slider.next();
        }, 5000);
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

// Componente de estrellas
const StarRating = ({ rating }) => (
    <div className="testimonial-stars">
        {[...Array(5)].map((_, i) => (
            <svg
                key={i}
                className={`star ${i < rating ? 'filled' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
            >
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
            </svg>
        ))}
    </div>
);

export default function Testimonials() {
    const router = useRouter();
    const { locale } = router;
    const t = locale === 'en' ? en : es;

    const [currentSlide, setCurrentSlide] = useState(0);
    const [dots, setDots] = useState([]);

    const [sliderRef, instanceRef] = useKeenSlider(
        {
            loop: true,
            slides: { perView: 1, spacing: 20 },
            breakpoints: {
                '(min-width: 768px)': {
                    slides: { perView: 2, spacing: 24 },
                },
                '(min-width: 1200px)': {
                    slides: { perView: 3, spacing: 28 },
                },
            },
            created(slider) {
                setDots([...Array(slider.track.details.slides.length).keys()]);
                setCurrentSlide(slider.track.details.rel);
            },
            slideChanged(slider) {
                setCurrentSlide(slider.track.details.rel);
            },
        },
        [AutoplayPlugin]
    );

    useEffect(() => {
        return () => {
            if (instanceRef.current) {
                instanceRef.current.destroy();
            }
        };
    }, [instanceRef]);

    return (
      <section className='testimonials-section'>
        {/* Fondo decorativo */}
        <div className='testimonials-bg'></div>

        <div className='testimonials-container'>
          {/* Encabezado */}
          <div className='testimonials-header'>
            <span className='section-label'>
              {locale === 'en'
                ? 'What Our Travelers Say'
                : 'Lo Que Dicen Nuestros Viajeros'}
            </span>
            <h2 className='section-title'>{t.h2_title_testimonials}</h2>

            {/* TripAdvisor badge */}
            <div className='tripadvisor-badge'>
              <div className='ta-logo'>
                <Image
                  src='/assets/Tripadvisor3-BookingIncatrail.webp'
                  alt='TripAdvisor Logo'
                  width={24}
                  height={24}
                />
              </div>
              <div className='ta-info'>
                <span className='ta-rating'>4.9</span>
                <span className='ta-text'>TripAdvisor</span>
              </div>
            </div>
          </div>

          {/* Slider de testimonios */}
          <div ref={sliderRef} className='keen-slider testimonials-slider'>
            {reviews.map((review, i) => (
              <div key={i} className='keen-slider__slide'>
                <div className='testimonial-card'>
                  {/* Cita decorativa */}
                  <div className='quote-icon'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='currentColor'>
                      <path d='M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z' />
                    </svg>
                  </div>

                  {/* Rating */}
                  <StarRating rating={review.rating} />

                  {/* Título */}
                  <h3 className='testimonial-title'>{review.title}</h3>

                  {/* Comentario */}
                  <p className='testimonial-comment'>{review.comment}</p>

                  {/* Footer con info del usuario */}
                  <div className='testimonial-footer'>
                    <div className='testimonial-user'>
                      <div className='user-avatar'>{review.avatar}</div>
                      <div className='user-info'>
                        <span className='user-name'>{review.user}</span>
                        <span className='user-meta'>
                          {review.date} • {review.type}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={review.url}
                      target='_blank'
                      className='read-more-link'
                      aria-label='Read full review on TripAdvisor'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 20 20'
                        fill='currentColor'>
                        <path
                          fillRule='evenodd'
                          d='M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navegación */}
          <div className='testimonials-nav'>
            <button
              onClick={() => instanceRef.current?.prev()}
              className='nav-arrow'
              aria-label='Previous'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'>
                <path
                  fillRule='evenodd'
                  d='M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z'
                  clipRule='evenodd'
                />
              </svg>
            </button>

            <div className='nav-dots'>
              {dots.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => instanceRef.current?.moveToIdx(idx)}
                  className={`nav-dot ${currentSlide === idx ? 'active' : ''}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => instanceRef.current?.next()}
              className='nav-arrow'
              aria-label='Next'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'>
                <path
                  fillRule='evenodd'
                  d='M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z'
                  clipRule='evenodd'
                />
              </svg>
            </button>
          </div>

          {/* CTA */}
          <div className='testimonials-cta'>
            <Link
              href='https://www.tripadvisor.com.pe/Attraction_Review-g294314-d12614123-Reviews-Life_Expeditions-Cusco_Cusco_Region.html'
              target='_blank'
              className='view-all-reviews'>
              {locale === 'en'
                ? 'View All Reviews on TripAdvisor'
                : 'Ver Todas las Reseñas en TripAdvisor'}
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
                fill='currentColor'>
                <path
                  fillRule='evenodd'
                  d='M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z'
                  clipRule='evenodd'
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    );
}