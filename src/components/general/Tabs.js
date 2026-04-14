import { useState, useRef, useEffect } from 'react';
import parser, { domToReact } from 'html-react-parser';
import AccordionFromHtml from './AccordionFromHtml';
import { useRouter } from 'next/router';
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

function isDayHeading(text = '') {
  const normalized = normalizeText(text).toLowerCase();
  return (
    /^day\s*\d+/i.test(normalized) ||
    /^día\s*\d+/i.test(normalized) ||
    /^dia\s*\d+/i.test(normalized)
  );
}

function isItineraryTab(title = '') {
  const normalized = normalizeText(title).toLowerCase();
  return normalized === 'itinerary' || normalized === 'itinerario';
}

function parseSectionContent(html = '', options = {}) {
  const { isItinerary = false } = options;
  let itineraryHeadingIndex = 0;

  return parser(html, {
    replace(domNode) {
      if (!domNode || domNode.type !== 'tag') return;

      const tagName = domNode.name?.toLowerCase();
      if (!tagName) return;

      const text = normalizeText(getTextFromNode(domNode));
      const isHeading = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName);

      if (isItinerary && isHeading && isDayHeading(text)) {
        const id = `itinerary-day-${slugify(text)}-${itineraryHeadingIndex}`;
        itineraryHeadingIndex += 1;

        const HeadingTag = tagName;
        return (
          <HeadingTag
            id={id}
            className='scroll-mt-[calc(var(--header-offset)+2.5rem)] mt-10 mb-4 text-2xl font-bold text-primary'>
            {domToReact(domNode.children)}
          </HeadingTag>
        );
      }

      if (isHeading) {
        const headingClasses = {
          h2: 'text-2xl font-bold text-primary mt-8 mb-4',
          h3: 'text-lg font-bold text-primary mt-6 mb-3',
          h4: 'text-base font-semibold text-primary mt-5 mb-3',
        };

        const HeadingTag = tagName;
        return (
          <HeadingTag
            className={
              headingClasses[tagName] ||
              'text-lg font-semibold text-primary mt-5 mb-3'
            }>
            {domToReact(domNode.children)}
          </HeadingTag>
        );
      }

      if (tagName === 'p') {
        return (
          <p className='mb-5 leading-8 text-stone-700'>
            {domToReact(domNode.children)}
          </p>
        );
      }

      if (tagName === 'ul') {
        return (
          <ul className='mb-6 space-y-3 list-disc pl-6 text-stone-700'>
            {domToReact(domNode.children)}
          </ul>
        );
      }

      if (tagName === 'ol') {
        return (
          <ol className='mb-6 space-y-3 list-decimal pl-6 text-stone-700'>
            {domToReact(domNode.children)}
          </ol>
        );
      }

      if (tagName === 'li') {
        return <li className='leading-7'>{domToReact(domNode.children)}</li>;
      }

      return undefined;
    },
  });
}

export default function Tabs({ tabsQuery }) {
  const [openTab, setOpenTab] = useState(0);
  const tabRefs = useRef([]);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isStuck, setIsStuck] = useState(false);
  const sentinelRef = useRef(null);
  const headerOffset = useHeaderOffset();

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      {
        threshold: 0,
        rootMargin: `-${headerOffset + 1}px 0px 0px 0px`,
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [headerOffset]);

  useEffect(() => {
    if (!hasInteracted) return;

    tabRefs.current[openTab]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });

    const content = document.getElementById(`tabpanel${openTab}`);
    if (content) {
      const y =
        content.getBoundingClientRect().top +
        window.scrollY -
        headerOffset -
        80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [openTab, hasInteracted, headerOffset]);

  const handleTabChange = (i) => {
    setOpenTab(i);
    setHasInteracted(true);
  };

  const router = useRouter();

  useEffect(() => {
    setOpenTab(0);
    setHasInteracted(false);
  }, [router.asPath]);

  return (
    <div style={{ '--header-offset': `${headerOffset}px` }}>
      <div ref={sentinelRef} className='h-0 w-full' aria-hidden='true' />

      <div
        className={`sticky z-20 bg-white border-b transition-shadow duration-200 ${
          isStuck ? 'shadow-md' : ''
        } top-[var(--header-offset)]`}>
        <ul
          className='flex mb-0 list-none flex-nowrap overflow-x-auto pt-3 pb-1 scrollbar-hide px-3'
          role='tablist'>
          {tabsQuery.map((item, i) => (
            <li
              key={i}
              role='presentation'
              className='flex-shrink-0 ml-0 mr-2 last:mr-0 text-stone-700 text-center'>
              <a
                ref={(el) => (tabRefs.current[i] = el)}
                id={`tab${i}`}
                role='tab'
                aria-selected={openTab === i}
                aria-controls={`tabpanel${i}`}
                className={`text-sm font-bold px-4 py-3 md:px-5 md:py-4 block leading-normal whitespace-nowrap transition-colors duration-200 ease-in-out hover:bg-secondary text-primary ${
                  openTab === i
                    ? 'bg-secondary rounded-t-md'
                    : 'rounded-t-md bg-stone-200'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleTabChange(i);
                }}
                href={`#tabpanel${i}`}>
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className='relative min-w-0 break-words bg-white w-full my-4 px-3'>
        {tabsQuery.map((item, i) => (
          <div
            key={i}
            id={`tabpanel${i}`}
            role='tabpanel'
            aria-labelledby={`tab${i}`}
            className={`${openTab === i ? 'block' : 'hidden'} custom-tailwind`}>
            {isItineraryTab(item.title) ? (
              <AccordionFromHtml
                key={item.slug || i}
                htmlContent={item.content}
                renderHtmlContent={(html) => parseSectionContent(html)}
              />
            ) : (
              parseSectionContent(item.content)
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
