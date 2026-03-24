import { useState } from 'react';
import { useRouter } from 'next/router';
import en from '../../lang/en/home';
import es from '../../lang/es/home';
import { renderHighlightedText } from './tour1/renderHighlightedText';
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

function FaqItem({ faq, index, isOpen, onToggle }) {
  const itemClass = cn(
    'group relative overflow-hidden rounded-xl border-2 bg-white shadow-sm transition-colors',
    isOpen
      ? 'border-secondary'
      : 'border-secondary/20 hover:border-secondary/40',
  );

  const indicatorClass = cn(
    'pointer-events-none absolute inset-y-0 left-0 w-1 transition-colors',
    isOpen ? 'bg-secondary' : 'bg-transparent group-hover:bg-secondary/40',
  );

  const buttonClass = cn(
    'flex w-full items-center gap-3 px-4 py-4 text-left sm:gap-4 sm:px-5',
    isOpen ? 'bg-secondary/5' : '',
  );

  const numberClass = cn(
    'flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 border-secondary',
    'bg-secondary/10 text-xs font-bold sm:h-7 sm:w-7',
    isOpen ? 'bg-secondary' : '',
  );

  const titleClass = cn(
    'flex-1 text-sm font-semibold leading-snug ',
    isOpen ? 'text-black' : '',
  );

  const iconClass = cn(
    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black/5 text-gray-400',
    'sm:h-6 sm:w-6',
    isOpen ? 'bg-secondary text-white' : 'group-hover:text-secondary',
  );

  return (
    <div className={itemClass}>
      <span aria-hidden='true' className={indicatorClass} />

      <button
        type='button'
        className={buttonClass}
        onClick={() => onToggle(index)}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
        id={`faq-question-${index}`}>
        <span className={numberClass}>
          {String(index + 1).padStart(2, '0')}
        </span>

        <span className={titleClass}>{faq.title}</span>

        <span aria-hidden='true' className={iconClass}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            className='h-3 w-3 sm:h-3.5 sm:w-3.5'>
            <path d={isOpen ? 'M5 12h14' : 'M12 5v14M5 12h14'} />
          </svg>
        </span>
      </button>

      <div
        id={`faq-answer-${index}`}
        role='region'
        aria-labelledby={`faq-question-${index}`}
        className={cn(
          'grid overflow-hidden transition-[grid-template-rows] duration-200',
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}>
        <div className='overflow-hidden'>
          <div className='px-4 pb-4 pl-10 sm:px-5 sm:pl-12'>
            <p className='border-l-2 border-secondary pl-3 text-sm leading-relaxed'>
              {renderHighlightedText(faq.content)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Section7() {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'en' ? en : es;
  const faqs = t.array_faqs || [];

  const [showAllFaqs, setShowAllFaqs] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  const displayFaqs = showAllFaqs ? faqs : faqs.slice(0, 6);
  const faqColumns = [
    displayFaqs.filter((_, index) => index % 2 === 0),
    displayFaqs.filter((_, index) => index % 2 === 1),
  ];

  const toggleFaq = (index) => {
    setOpenIndex((currentIndex) => (currentIndex === index ? null : index));
  };

  const toggleShowAllFaqs = () => {
    setShowAllFaqs((current) => {
      const next = !current;

      if (!next) {
        setOpenIndex((currentOpenIndex) =>
          currentOpenIndex !== null && currentOpenIndex >= 6
            ? null
            : currentOpenIndex,
        );
      }

      return next;
    });
  };

  return (
    <section className='py-10 sm:py-14'>
      <div className='mx-auto max-w-6xl px-6'>
        <div className='mb-10 text-center'>
          <span className='mb-4 inline-flex items-center gap-2 rounded-full bg-[#E6C20026] px-5 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-[#0d1117]'>
            {locale === 'en' ? 'Got Questions?' : '¿Tienes Preguntas?'}
          </span>

          <h2 className='mb-2 text-3xl font-bold leading-tight text-primary sm:text-4xl'>
            {t.h2_title_FAQs}
          </h2>

          <p className='mx-auto max-w-2xl text-sm text-gray-500 sm:text-base'>
            {t.h3_subtitle_FAQs}
          </p>
        </div>

        <div className='space-y-4 md:hidden'>
          {displayFaqs.map((faq, index) => (
            <FaqItem
              key={index}
              faq={faq}
              index={index}
              isOpen={openIndex === index}
              onToggle={toggleFaq}
            />
          ))}
        </div>

        <div className='hidden items-start gap-4 md:grid md:grid-cols-2'>
          {faqColumns.map((column, columnIndex) => (
            <div key={columnIndex} className='space-y-4'>
              {column.map((faq, itemIndex) => {
                const originalIndex =
                  columnIndex === 0 ? itemIndex * 2 : itemIndex * 2 + 1;

                return (
                  <FaqItem
                    key={originalIndex}
                    faq={faq}
                    index={originalIndex}
                    isOpen={openIndex === originalIndex}
                    onToggle={toggleFaq}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {faqs.length > 6 && (
          <div className='mt-8 flex justify-center'>
            <button
              type='button'
              onClick={toggleShowAllFaqs}
              className='inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-2 text-sm font-medium text-alternative transition-colors hover:border-secondary/50 hover:bg-secondary/20'>
              <span aria-hidden='true'>💡</span>

              {showAllFaqs
                ? locale === 'en'
                  ? 'Show fewer questions'
                  : 'Mostrar menos preguntas'
                : locale === 'en'
                  ? `+${faqs.length - 6} more questions`
                  : `+${faqs.length - 6} preguntas más`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
