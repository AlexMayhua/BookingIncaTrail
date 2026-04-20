'use client';

import React, { useEffect, useMemo, useState } from 'react';
import parser, { domToReact } from 'html-react-parser';
import useHeaderOffset from '@/hooks/useHeaderOffset';

function slugify(text = '') {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&nbsp;/g, ' ')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function normalizeText(text = '') {
  return text
    .replace(/\u00A0/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getTextFromNode(node) {
  if (!node) return '';

  if (node.type === 'text') {
    return node.data || '';
  }

  if (!node.children || !Array.isArray(node.children)) {
    return '';
  }

  return node.children.map(getTextFromNode).join(' ');
}

function normalizeTitle(title = '') {
  const clean = normalizeText(title).toLowerCase();

  if (clean === 'itinerary' || clean === 'itinerario') return 'itinerary';

  if (
    clean.includes('incluye') ||
    clean.includes('includes') ||
    clean.includes('included') ||
    clean.includes('what is included') ||
    clean.includes('what’s included')
  ) {
    return 'includes';
  }

  return 'default';
}

function isDayHeading(text = '') {
  const normalized = normalizeText(text).toLowerCase();
  return (
    /^day\s*\d+/i.test(normalized) ||
    /^día\s*\d+/i.test(normalized) ||
    /^dia\s*\d+/i.test(normalized)
  );
}

function getCompactDayLabel(text = '', index = 0, locale = 'en') {
  const normalized = normalizeText(text);
  const match = normalized.match(/^(?:day|día|dia)\s*(\d+)/i);
  const dayNumber = match?.[1] || `${index + 1}`;
  const prefix = locale === 'en' ? 'DAY' : 'DIA';

  return `${prefix} ${dayNumber}`;
}

function isIncludeHeading(text = '') {
  const normalized = normalizeText(text).toLowerCase();
  return (
    (normalized.includes('incluye') ||
      normalized.includes('includes') ||
      normalized.includes('included')) &&
    !normalized.includes('no incluye') &&
    !normalized.includes('not included')
  );
}

function isExcludeHeading(text = '') {
  const normalized = normalizeText(text).toLowerCase();
  return (
    normalized.includes('no incluye') ||
    normalized.includes('not include') ||
    normalized.includes('not included')
  );
}

function extractDaysFromHtml(html = '', locale = 'en') {
  const days = [];
  let index = 0;

  parser(html, {
    replace(domNode) {
      if (!domNode || domNode.type !== 'tag') return;

      const tagName = domNode.name?.toLowerCase();
      const isHeading = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName);

      if (!isHeading) return;

      const text = normalizeText(getTextFromNode(domNode));

      if (isDayHeading(text)) {
        days.push({
          id: `itinerary-day-${slugify(text)}-${index}`,
          label: getCompactDayLabel(text, index, locale),
        });
        index += 1;
      }

      return undefined;
    },
  });

  return days;
}

function splitIncludesSection(html = '') {
  const blocks = [];
  let currentBlock = null;

  parser(html, {
    replace(domNode) {
      if (!domNode) return;

      const text = normalizeText(getTextFromNode(domNode));

      if (domNode.type === 'tag' && /^h[1-6]$/i.test(domNode.name || '')) {
        if (isIncludeHeading(text)) {
          currentBlock = { type: 'include', nodes: [domNode] };
          blocks.push(currentBlock);
          return undefined;
        }

        if (isExcludeHeading(text)) {
          currentBlock = { type: 'exclude', nodes: [domNode] };
          blocks.push(currentBlock);
          return undefined;
        }
      }

      if (!currentBlock) {
        currentBlock = { type: 'include', nodes: [] };
        blocks.push(currentBlock);
      }

      currentBlock.nodes.push(domNode);
      return undefined;
    },
  });

  const renderNodes = (targetType) => {
    const targetBlocks = blocks.filter((block) => block.type === targetType);
    if (!targetBlocks.length) return null;

    const transformOptions = buildContentParserOptions();

    return targetBlocks.map((block, blockIndex) => (
      <React.Fragment key={`${targetType}-${blockIndex}`}>
        {domToReact(block.nodes, transformOptions)}
      </React.Fragment>
    ));
  };

  return {
    includeContent: renderNodes('include'),
    excludeContent: renderNodes('exclude'),
  };
}

function buildSections(tourInformation = [], locale = 'en') {
  return tourInformation.map((item, index) => {
    const type = normalizeTitle(item.title);
    const baseId = `section-${slugify(item.title)}-${index}`;

    if (type === 'itinerary') {
      return {
        id: baseId,
        title: item.title,
        type: 'itinerary',
        days: extractDaysFromHtml(item.content, locale),
        content: item.content,
      };
    }

    if (type === 'includes') {
      return {
        id: baseId,
        title: locale === 'en' ? 'Includes' : 'Incluye',
        type: 'includes',
        content: item.content,
      };
    }

    return {
      id: baseId,
      title: item.title,
      type: 'default',
      content: item.content,
    };
  });
}

function buildContentParserOptions(options = {}) {
  const { isItinerary = false } = options;
  let itineraryHeadingIndex = 0;

  const transformOptions = {
    replace(domNode) {
      if (!domNode || domNode.type !== 'tag') return;

      const tagName = domNode.name?.toLowerCase();
      if (!tagName) return;

      const text = normalizeText(getTextFromNode(domNode));
      const isHeading = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName);

      if (isItinerary && isHeading && isDayHeading(text)) {
        const id = `itinerary-day-${slugify(text)}-${itineraryHeadingIndex}`;
        itineraryHeadingIndex += 1;

        return React.createElement(
          tagName,
          {
            id,
            className:
              'scroll-mt-[calc(var(--header-offset)+2.5rem)] mt-10 mb-4 text-2xl font-bold text-primary',
          },
          domToReact(domNode.children, transformOptions),
        );
      }

      if (isHeading) {
        const headingClasses = {
          h2: 'text-2xl font-bold text-primary mt-8 mb-4',
          h3: 'text-lg font-bold text-primary mt-6 mb-3',
          h4: 'text-base font-semibold text-primary mt-5 mb-3',
        };

        return React.createElement(
          tagName,
          {
            className:
              headingClasses[tagName] ||
              'text-lg font-semibold text-primary mt-5 mb-3',
          },
          domToReact(domNode.children, transformOptions),
        );
      }

      if (tagName === 'p') {
        return (
          <p className='mb-2 leading-8 text-stone-700'>
            {domToReact(domNode.children, transformOptions)}
          </p>
        );
      }

      if (tagName === 'ul') {
        return (
          <ul className='mb-6 space-y-1 list-disc pl-6 text-stone-700'>
            {domToReact(domNode.children, transformOptions)}
          </ul>
        );
      }

      if (tagName === 'ol') {
        return (
          <ol className='mb-6 space-y-3 list-decimal pl-6 text-stone-700'>
            {domToReact(domNode.children, transformOptions)}
          </ol>
        );
      }

      if (tagName === 'li') {
        const meaningfulChildren = (domNode.children || []).filter(
          (child) =>
            child.type !== 'text' || normalizeText(child.data || '') !== '',
        );
        const isNestedListWrapper =
          meaningfulChildren.length === 1 &&
          meaningfulChildren[0].type === 'tag' &&
          ['ul', 'ol'].includes(
            (meaningfulChildren[0].name || '').toLowerCase(),
          );

        if (isNestedListWrapper) {
          return (
            <React.Fragment>
              {domToReact(meaningfulChildren, transformOptions)}
            </React.Fragment>
          );
        }

        return (
          <li className='leading-7'>
            {domToReact(domNode.children, transformOptions)}
          </li>
        );
      }

      return undefined;
    },
  };

  return transformOptions;
}

function parseSectionContent(html = '', options = {}) {
  return parser(html, buildContentParserOptions(options));
}

export default function TourContentDesktop({
  tourInformation = [],
  locale = 'en',
}) {
  const [activeSection, setActiveSection] = useState('');
  const [activeSubSection, setActiveSubSection] = useState('');
  const headerOffset = useHeaderOffset();

  const sections = useMemo(
    () => buildSections(tourInformation, locale),
    [tourInformation, locale],
  );
  const navigationIds = useMemo(
    () =>
      sections.flatMap((section) => [
        section.id,
        ...(section.type === 'itinerary'
          ? section.days.map((day) => day.id)
          : []),
      ]),
    [sections],
  );
  const stickyLayoutVars = useMemo(
    () => ({ '--header-offset': `${headerOffset}px` }),
    [headerOffset],
  );

  useEffect(() => {
    if (!navigationIds.length) return;

    let frameId = null;

    const syncActiveState = () => {
      frameId = null;

      const activationLine = headerOffset + 120;
      let currentId = '';

      navigationIds.forEach((id) => {
        const element = document.getElementById(id);
        if (!element) return;

        if (element.getBoundingClientRect().top <= activationLine) {
          currentId = id;
        }
      });

      if (!currentId) {
        currentId =
          navigationIds.find((id) => {
            const element = document.getElementById(id);
            return (
              element && element.getBoundingClientRect().bottom > activationLine
            );
          }) || '';
      }

      if (!currentId) return;

      const matchedSection = sections.find((section) => {
        if (section.id === currentId) return true;

        if (section.type === 'itinerary') {
          return section.days.some((day) => day.id === currentId);
        }

        return false;
      });

      if (!matchedSection) return;

      setActiveSection(matchedSection.id);

      if (matchedSection.type === 'itinerary') {
        const matchedDay = matchedSection.days.find(
          (day) => day.id === currentId,
        );
        setActiveSubSection(matchedDay ? matchedDay.id : '');
        return;
      }

      setActiveSubSection('');
    };

    const scheduleSync = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(syncActiveState);
    };

    scheduleSync();

    window.addEventListener('scroll', scheduleSync, { passive: true });
    window.addEventListener('resize', scheduleSync);
    window.addEventListener('orientationchange', scheduleSync);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener('scroll', scheduleSync);
      window.removeEventListener('resize', scheduleSync);
      window.removeEventListener('orientationchange', scheduleSync);
    };
  }, [navigationIds, sections, headerOffset]);

  const scrollToId = (id) => {
    const target = document.getElementById(id);
    if (!target) return;

    const y =
      target.getBoundingClientRect().top + window.scrollY - headerOffset - 36;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <div className='grid grid-cols-12 gap-10 mt-8' style={stickyLayoutVars}>
      <aside className='col-span-3'>
        <div className='sticky top-[var(--header-offset)]'>
          <nav className='rounded-2xl border border-stone-200 bg-white shadow-sm p-4'>
            <ul className='space-y-2'>
              {sections.map((section) => {
                const isActive = activeSection === section.id;

                return (
                  <li key={section.id}>
                    <button
                      type='button'
                      onClick={() => scrollToId(section.id)}
                      className={[
                        'w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-all duration-200',
                        isActive
                          ? 'bg-secondary text-primary shadow-sm'
                          : 'text-stone-700 hover:bg-stone-100',
                      ].join(' ')}>
                      {section.title}
                    </button>

                    {section.type === 'itinerary' &&
                      section.days.length > 0 && (
                        <ul className='mt-2 ml-3 border-l border-stone-200 pl-3 space-y-1'>
                          {section.days.map((day) => {
                            const isDayActive = activeSubSection === day.id;

                            return (
                              <li key={day.id}>
                                <button
                                  type='button'
                                  onClick={() => scrollToId(day.id)}
                                  className={[
                                    'w-full rounded-lg px-2 py-1.5 text-left text-sm transition-colors',
                                    isDayActive
                                      ? 'font-semibold text-primary'
                                      : 'text-stone-500 hover:text-primary',
                                  ].join(' ')}>
                                  {day.label}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>

      <div className='col-span-9 space-y-14'>
        {sections.map((section) => {
          if (section.type === 'itinerary') {
            return (
              <section
                key={section.id}
                id={section.id}
                className='scroll-mt-[calc(var(--header-offset)+2.5rem)]'>
                <h2 className='sticky top-[var(--header-offset)] z-20 mb-6 bg-white/95 py-2 text-3xl font-bold text-primary backdrop-blur-sm'>
                  {section.title}
                </h2>

                <div className='rounded-2xl border border-stone-200 bg-white shadow-sm p-8'>
                  {parseSectionContent(section.content, { isItinerary: true })}
                </div>
              </section>
            );
          }

          if (section.type === 'includes') {
            const { includeContent, excludeContent } = splitIncludesSection(
              section.content,
            );

            return (
              <section
                key={section.id}
                id={section.id}
                className='scroll-mt-[calc(var(--header-offset)+2.5rem)]'>
                <h2 className='sticky top-[var(--header-offset)] z-20 mb-6 bg-white/95 py-2 text-3xl font-bold text-primary backdrop-blur-sm'>
                  {section.title}
                </h2>

                <div className='grid grid-cols-1 xl:grid-cols-2 gap-8'>
                  <div className='rounded-2xl border border-stone-200 bg-white shadow-sm p-8'>
                    <h3 className='text-xl font-bold text-primary mb-4'>
                      {locale === 'en' ? 'Included' : 'Incluye'}
                    </h3>
                    <div>{includeContent}</div>
                  </div>

                  <div className='rounded-2xl border border-stone-200 bg-white shadow-sm p-8'>
                    <h3 className='text-xl font-bold text-primary mb-4'>
                      {locale === 'en' ? 'Not Included' : 'No incluye'}
                    </h3>
                    <div>{excludeContent}</div>
                  </div>
                </div>
              </section>
            );
          }

          return (
            <section
              key={section.id}
              id={section.id}
              className='scroll-mt-[calc(var(--header-offset)+1rem)]'>
              <h2 className='sticky top-[var(--header-offset)] z-20 mb-6 bg-white/95 py-2 text-3xl font-bold text-primary backdrop-blur-sm'>
                {section.title}
              </h2>

              <div className='rounded-2xl border border-stone-200 bg-white shadow-sm p-8'>
                {parseSectionContent(section.content)}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
