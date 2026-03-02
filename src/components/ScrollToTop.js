import { useEffect, useState } from 'react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const toggleVisibility = () => {
    const scrolled = window.pageYOffset;
    const maxHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrolled / maxHeight) * 100;

    setScrollProgress(progress);
    setIsVisible(scrolled > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div className={`scroll-to-top-container ${isVisible ? 'visible' : ''}`}>
      <button
        onClick={scrollToTop}
        className="scroll-to-top-btn"
        aria-label='Ir arriba'
      >
        {/* Círculo de progreso */}
        <svg className="scroll-progress-ring" viewBox="0 0 60 60">
          <circle
            className="scroll-progress-bg"
            cx="30"
            cy="30"
            r="26"
          />
          <circle
            className="scroll-progress-bar"
            cx="30"
            cy="30"
            r="26"
            style={{
              strokeDasharray: `${2 * Math.PI * 26}`,
              strokeDashoffset: `${2 * Math.PI * 26 * (1 - scrollProgress / 100)}`
            }}
          />
        </svg>

        {/* Icono de flecha */}
        <svg className="scroll-arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
}
