import { BRAND } from './brandConfig';

const XML_HEADER = '<?xml version="1.0" encoding="UTF-8"?>';
const XML_STYLESHEET = '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>';

const DEFAULT_LASTMOD = new Date().toISOString();

const BASE_ROUTE_GROUPS = [
  {
    enPath: '/',
    esPath: '/es',
    changefreq: 'daily',
    priority: 1.0,
  },
  {
    enPath: '/about-us',
    esPath: '/es/about-us',
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    enPath: '/contact',
    esPath: '/es/contact',
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    enPath: '/terms-conditions',
    esPath: '/es/terms-conditions',
    changefreq: 'monthly',
    priority: 0.6,
  },
  {
    enPath: '/terms-conditions/complaintsBook',
    esPath: '/es/terms-conditions/complaintsBook',
    changefreq: 'monthly',
    priority: 0.5,
  },
];

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function normalizeSiteUrl(siteUrl = BRAND.siteUrl) {
  return String(siteUrl || '').replace(/\/+$/, '');
}

export function absoluteSitemapUrl(path, siteUrl = BRAND.siteUrl) {
  const baseUrl = normalizeSiteUrl(siteUrl);

  if (!path || path === '/') {
    return baseUrl;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

export function buildLocaleAlternates({
  enPath,
  esPath,
  siteUrl = BRAND.siteUrl,
  includeEnglish = true,
  includeSpanish = true,
  defaultPath,
}) {
  const alternates = [];

  if (includeEnglish && enPath) {
    alternates.push({
      hreflang: 'en',
      href: absoluteSitemapUrl(enPath, siteUrl),
    });
  }

  if (includeSpanish && esPath) {
    alternates.push({
      hreflang: 'es',
      href: absoluteSitemapUrl(esPath, siteUrl),
    });
  }

  alternates.push({
    hreflang: 'x-default',
    href: absoluteSitemapUrl(defaultPath || enPath || esPath || '/', siteUrl),
  });

  return alternates;
}

function renderAlternates(alternates = []) {
  return alternates
    .map(
      ({ hreflang, href }) =>
        `<xhtml:link rel="alternate" hreflang="${escapeXml(hreflang)}" href="${escapeXml(href)}" />`,
    )
    .join('');
}

function renderUrlEntry(entry) {
  const lastmod = entry.lastmod || DEFAULT_LASTMOD;
  const changefreq = entry.changefreq || 'weekly';
  const priority =
    typeof entry.priority === 'number' ? entry.priority.toFixed(1) : '0.5';

  return [
    '  <url>',
    `    <loc>${escapeXml(entry.loc)}</loc>`,
    `    <lastmod>${escapeXml(lastmod)}</lastmod>`,
    `    <changefreq>${escapeXml(changefreq)}</changefreq>`,
    `    <priority>${escapeXml(priority)}</priority>`,
    entry.alternates?.length
      ? `    ${renderAlternates(entry.alternates)}`
      : null,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n');
}

export function renderUrlSet(entries) {
  return [
    XML_HEADER,
    XML_STYLESHEET,
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    entries.map(renderUrlEntry).join('\n'),
    '</urlset>',
  ].join('\n');
}

export function renderSitemapIndex(items) {
  return [
    XML_HEADER,
    XML_STYLESHEET,
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    items
      .map(({ loc, lastmod = DEFAULT_LASTMOD }) =>
        [
          '  <sitemap>',
          `    <loc>${escapeXml(loc)}</loc>`,
          `    <lastmod>${escapeXml(lastmod)}</lastmod>`,
          '  </sitemap>',
        ].join('\n'),
      )
      .join('\n'),
    '</sitemapindex>',
  ].join('\n');
}

export function writeXmlResponse(res, xml) {
  res.setHeader('Content-Type', 'application/xml; charset=UTF-8');
  res.write(xml);
  res.end();
}

export function getBaseSitemapEntries(siteUrl = BRAND.siteUrl) {
  return BASE_ROUTE_GROUPS.flatMap(
    ({ enPath, esPath, changefreq, priority }) => [
      {
        loc: absoluteSitemapUrl(enPath, siteUrl),
        lastmod: DEFAULT_LASTMOD,
        changefreq,
        priority,
        alternates: buildLocaleAlternates({ enPath, esPath, siteUrl }),
      },
      {
        loc: absoluteSitemapUrl(esPath, siteUrl),
        lastmod: DEFAULT_LASTMOD,
        changefreq,
        priority,
        alternates: buildLocaleAlternates({ enPath, esPath, siteUrl }),
      },
    ],
  );
}

export function getTourSitemapEntries({
  groups,
  locale,
  siteUrl = BRAND.siteUrl,
  alternateCategorySet = new Set(),
  alternateTourSet = new Set(),
}) {
  const localePrefix = locale === 'es' ? '/es' : '';

  return groups.flatMap(({ category, tours = [] }) => {
    const categoryLastmod =
      tours
        .map((tour) => tour?.updatedAt)
        .filter(Boolean)
        .sort()
        .at(-1) || DEFAULT_LASTMOD;

    const enCategoryPath = `/${category}`;
    const esCategoryPath = `/es/${category}`;
    const hasAlternateCategory = alternateCategorySet.has(category);

    const categoryEntry = {
      loc: absoluteSitemapUrl(`${localePrefix}/${category}`, siteUrl),
      lastmod: categoryLastmod,
      changefreq: 'weekly',
      priority: 0.9,
      alternates: buildLocaleAlternates({
        enPath: enCategoryPath,
        esPath: esCategoryPath,
        siteUrl,
        includeEnglish: locale === 'en' || hasAlternateCategory,
        includeSpanish: locale === 'es' || hasAlternateCategory,
        defaultPath: enCategoryPath,
      }),
    };

    const tourEntries = tours.map((tour) => {
      const tourKey = `${category}/${tour.slug}`;
      const hasAlternateTour = alternateTourSet.has(tourKey);
      const enTourPath = `/${category}/${tour.slug}`;
      const esTourPath = `/es/${category}/${tour.slug}`;

      return {
        loc: absoluteSitemapUrl(
          `${localePrefix}/${category}/${tour.slug}`,
          siteUrl,
        ),
        lastmod: tour?.updatedAt || DEFAULT_LASTMOD,
        changefreq: 'weekly',
        priority: 0.8,
        alternates: buildLocaleAlternates({
          enPath: enTourPath,
          esPath: esTourPath,
          siteUrl,
          includeEnglish: locale === 'en' || hasAlternateTour,
          includeSpanish: locale === 'es' || hasAlternateTour,
          defaultPath: enTourPath,
        }),
      };
    });

    return [categoryEntry, ...tourEntries];
  });
}

export function createCategorySet(groups = []) {
  return new Set(groups.map(({ category }) => category).filter(Boolean));
}

export function createTourSet(groups = []) {
  return new Set(
    groups.flatMap(({ category, tours = [] }) =>
      tours
        .filter((tour) => tour?.slug && category)
        .map((tour) => `${category}/${tour.slug}`),
    ),
  );
}
