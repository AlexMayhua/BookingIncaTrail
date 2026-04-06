import { useMemo, useState } from 'react';
import Tour1Slider from './Tour1Slider';
import { renderHighlightedText } from './renderHighlightedText';
import { matchesStrictTerms } from './utils';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Tour1Section({ section, locale }) {
  const sectionTitle = locale === 'en' ? section.titleEn : section.titleEs;
  const sectionDescription =
    locale === 'en' ? section.descriptionEn : section.descriptionEs;
  const filters =
    section.filters && section.filters.length > 0
      ? section.filters
      : [
          {
            key: 'all',
            labelEn: 'All',
            labelEs: 'Todos',
            terms: [],
          },
        ];

  const [activeFilterKey, setActiveFilterKey] = useState(filters[0].key);

  const activeFilter =
    filters.find((filter) => filter.key === activeFilterKey) || filters[0];
  const filteredTours = useMemo(() => {
    if (!activeFilter?.terms?.length) {
      return section.tours;
    }

    return section.tours.filter((tour) =>
      matchesStrictTerms(tour, activeFilter.terms),
    );
  }, [activeFilter, section.tours]);

  return (
    <div className=''>
      <div className='space-y-1 lg:space-y-2 max-w-4xl text-center mx-auto'>
        <h2 className='m-0 text-2xl lg:text-3xl font-bold text-[#1a181b]'>
          {sectionTitle}
        </h2>
        <p className='m-0 text-sm lg:text-base'>
          {renderHighlightedText(sectionDescription)}
        </p>
      </div>

      {filters.length > 1 && (
        <div className='flex py-2 px-2 z-0'>
          <div className='w-full'>
            <p className='lg:hidden text-center py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#2a9d8f] bg-[#2a9d8f1f] rounded-md'>
              {locale === 'en' ? 'Pick your category!' : '¡Elige tu categoría!'}
            </p>
            <div className='flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between'>
              <div
                className='inline-flex flex-wrap gap-2 rounded-lg bg-white/80 p-1.5 shadow-sm backdrop-blur-sm'
                aria-label={
                  locale === 'en'
                    ? 'Tour category filters'
                    : 'Filtros de categoria'
                }>
                {filters.map((filter) => {
                  const isActive = activeFilter.key === filter.key;
                  const label =
                    locale === 'en' ? filter.labelEn : filter.labelEs;

                  return (
                    <button
                      key={filter.key}
                      type='button'
                      onClick={() => setActiveFilterKey(filter.key)}
                      aria-pressed={isActive}
                      className={cn(
                        'rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ease-out',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e6c20066]',
                        isActive
                          ? 'bg-primary text-white shadow-md'
                          : 'text-black/65 hover:bg-black/5 hover:text-black',
                      )}>
                      {label}
                    </button>
                  );
                })}
              </div>

              <p className='hidden lg:flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#2a9d8f] bg-[#2a9d8f1f] px-2 py-1 rounded-md'>
                {locale === 'en'
                  ? 'Pick your category!'
                  : '¡Elige tu categoría!'}
              </p>
            </div>
          </div>
        </div>
      )}
      {filteredTours.length > 0 ? (
        <Tour1Slider
          key={`${section.key}-${activeFilter.key}`}
          tours={filteredTours}
          locale={locale}
          sectionKey={`${section.key}-${activeFilter.key}`}
        />
      ) : (
        <div className='rounded-xl border border-black/10 bg-white p-8 text-center text-gray-600'>
          {locale === 'en'
            ? 'No tours available for this filter yet.'
            : 'Aun no hay tours disponibles para este filtro.'}
        </div>
      )}
    </div>
  );
}
