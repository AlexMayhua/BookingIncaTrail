import { useState } from 'react';
import { useRouter } from 'next/router';
import en from '../../lang/en/home';
import es from '../../lang/es/home';

export default function Section7() {
    const router = useRouter();
    const { locale } = router;
    const t = locale === 'en' ? en : es;
    const faqs = t.array_faqs || [];

    // Mostrar solo 6 FAQs en una distribución de 2 columnas
    const displayFaqs = faqs.slice(0, 6);

    const [openIndex, setOpenIndex] = useState(null);

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="faq-section">
            <div className="faq-container">
                {/* Encabezado */}
                <div className="faq-header">
                    <span className="faq-label">
                        {locale === 'en' ? 'Got Questions?' : '¿Tienes Preguntas?'}
                    </span>
                    <h2 className="faq-title">{t.h2_title_FAQs}</h2>
                    <p className="faq-subtitle">{t.h3_subtitle_FAQs}</p>
                </div>

                {/* Grid de FAQs - 2 columnas */}
                <div className="faq-grid">
                    {displayFaqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`faq-item ${openIndex === index ? 'open' : ''}`}
                        >
                            <button
                                className="faq-question"
                                onClick={() => toggleFaq(index)}
                                aria-expanded={openIndex === index}
                            >
                                <span className="faq-number">{String(index + 1).padStart(2, '0')}</span>
                                <span className="faq-question-text">{faq.title}</span>
                                <span className="faq-icon">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M12 5v14M5 12h14" />
                                    </svg>
                                </span>
                            </button>
                            <div className="faq-answer">
                                <p>{faq.content}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA para ver más */}
                {faqs.length > 6 && (
                    <div className="faq-cta">
                        <p className="faq-cta-text">
                            {locale === 'en'
                                ? `+${faqs.length - 6} more questions answered`
                                : `+${faqs.length - 6} preguntas más respondidas`
                            }
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
