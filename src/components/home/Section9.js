import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import en from '../../lang/en/home'
import es from '../../lang/es/home'

// Componente Counter para animar los números solo cuando sea visible
function Counter({ end, duration = 2000 }) {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const counterRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );

        if (counterRef.current) {
            observer.observe(counterRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (isVisible) {
            let start = 0;
            const increment = end / (duration / 16);

            const counter = setInterval(() => {
                start += increment;
                if (start >= end) {
                    setCount(end);
                    clearInterval(counter);
                } else {
                    setCount(Math.ceil(start));
                }
            }, 16);

            return () => clearInterval(counter);
        }
    }, [isVisible, end, duration]);

    return <span ref={counterRef}>{count.toLocaleString()}</span>;
}

// Datos de los logros
const achievements = [
    {
        icon: (
            <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M39.37 18.432c0 3.058-.906 5.862-2.466 8.203a14.728 14.728 0 0 1-10.079 6.367c-.717.127-1.455.19-2.214.19-.759 0-1.497-.063-2.214-.19a14.728 14.728 0 0 1-10.078-6.368 14.692 14.692 0 0 1-2.467-8.202c0-8.16 6.6-14.76 14.76-14.76s14.759 6.6 14.759 14.76Z"
                    stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path
                    d="m44.712 38.17-3.431.83a2.063 2.063 0 0 0-1.539 1.572l-.728 3.122c-.09.384-.281.734-.554 1.012a2.068 2.068 0 0 1-.992.564c-.375.09-.768.073-1.134-.052a2.078 2.078 0 0 1-.938-.653l-9.92-11.64-9.92 11.661a2.078 2.078 0 0 1-.938.653 2.038 2.038 0 0 1-1.134.052 2.067 2.067 0 0 1-.992-.563 2.137 2.137 0 0 1-.554-1.012l-.728-3.123a2.13 2.13 0 0 0-.55-1.01 2.06 2.06 0 0 0-.988-.562L6.24 38.19a2.073 2.073 0 0 1-.956-.533 2.14 2.14 0 0 1-.563-.953 2.175 2.175 0 0 1-.015-1.113c.091-.366.276-.7.536-.97l8.11-8.284a14.672 14.672 0 0 0 4.307 4.281 14.34 14.34 0 0 0 5.634 2.134 12.29 12.29 0 0 0 2.183.191c.749 0 1.477-.063 2.184-.19 4.138-.617 7.694-3.017 9.94-6.416l8.11 8.285c1.144 1.147.583 3.165-.998 3.547Zm-18.03-26.532 1.227 2.507c.167.34.603.68.998.743l2.226.383c1.414.233 1.747 1.296.727 2.336l-1.726 1.764c-.29.297-.457.87-.353 1.295l.499 2.188c.395 1.721-.5 2.4-1.996 1.487l-2.08-1.253a1.434 1.434 0 0 0-1.372 0l-2.08 1.253c-1.497.892-2.392.234-1.996-1.487l.499-2.188c.083-.403-.063-.998-.354-1.295l-1.726-1.764c-1.019-1.04-.686-2.081.728-2.336l2.225-.383c.375-.063.811-.403.977-.743l1.227-2.507c.604-1.36 1.685-1.36 2.35 0Z"
                    stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        value: 10,
        prefix: '+',
        suffix: '',
        labelKey: 'experience'
    },
    {
        icon: (
            <svg viewBox="0 0 51 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="m26.91 5.776 4.483 10.683a1.544 1.544 0 0 0 1.287.942l11.474.992a1.544 1.544 0 0 1 .876 2.715L36.325 28.7a1.559 1.559 0 0 0-.49 1.523l2.61 11.296a1.544 1.544 0 0 1-2.295 1.677l-9.86-5.982a1.53 1.53 0 0 0-1.59 0l-9.861 5.982a1.544 1.544 0 0 1-2.295-1.677l2.609-11.296a1.56 1.56 0 0 0-.49-1.523l-8.705-7.593a1.544 1.544 0 0 1 .876-2.715l11.474-.992a1.544 1.544 0 0 0 1.287-.942l4.483-10.683a1.544 1.544 0 0 1 2.833 0Z"
                    stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        value: 4.9,
        prefix: '',
        suffix: '',
        labelKey: 'qualifications'
    },
    {
        icon: (
            <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M10.811 39.091c-1.775-1.775-.598-5.505-1.5-7.69-.939-2.255-4.377-4.089-4.377-6.5 0-2.413 3.438-4.246 4.376-6.502.903-2.182-.274-5.914 1.501-7.69 1.776-1.775 5.508-.598 7.69-1.5 2.266-.939 4.09-4.377 6.501-4.377 2.412 0 4.246 3.438 6.501 4.376 2.185.903 5.915-.274 7.69 1.501 1.776 1.776.598 5.506 1.502 7.69.937 2.266 4.376 4.09 4.376 6.501 0 2.412-3.439 4.246-4.377 6.501-.903 2.185.274 5.915-1.5 7.69-1.776 1.776-5.506.598-7.69 1.501-2.256.938-4.09 4.377-6.502 4.377s-4.245-3.439-6.5-4.377c-2.183-.903-5.915.275-7.69-1.5Z"
                    stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="m17.281 26.444 4.632 4.631L32.718 20.27"
                    stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        value: 8900,
        prefix: '+',
        suffix: '',
        labelKey: 'ToursSuccessfully'
    },
    {
        icon: (
            <svg viewBox="0 0 51 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M45.571 12.006 27.046 30.531l-7.719-7.718L5.434 36.706" stroke="currentColor" strokeWidth="3.5"
                    strokeLinecap="round" strokeLinejoin="round" />
                <path d="M45.569 24.356v-12.35h-12.35" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"
                    strokeLinejoin="round" />
            </svg>
        ),
        value: 50000,
        prefix: '+',
        suffix: '',
        labelKey: 'SatisfiedTravellers'
    }
];

export default function Section9() {
    const router = useRouter();
    const { locale } = router;
    const t = locale === 'en' ? en : es;

    return (
        <section className="achievements-section">
            <div className="achievements-container">
                {/* Encabezado compacto */}
                <div className="achievements-header">
                    <h2 className="achievements-title">{t.h2_title_achievements}</h2>
                    <div className="achievements-divider">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>

                {/* Grid de estadísticas - Una fila */}
                <div className="achievements-grid">
                    {achievements.map((achievement, index) => (
                        <div key={index} className="achievement-card">
                            <div className="achievement-icon">
                                {achievement.icon}
                            </div>
                            <div className="achievement-content">
                                <span className="achievement-value">
                                    {achievement.prefix}
                                    <Counter end={achievement.value} />
                                    {achievement.suffix}
                                </span>
                                <span className="achievement-label">
                                    {t[achievement.labelKey]}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
