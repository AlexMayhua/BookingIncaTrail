/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://bookingincatrail.com/',
  generateRobotsTxt: true,
  exclude: ['/admin', '/admin/*', '/cusco', '/en/cusco', '/es/cusco'],
  transform: async (config, path) => {
    // Páginas principales de categorías con prioridad alta
    if (path.includes('/inca-trail') || path.includes('/salkantay') || path.includes('/machupicchu') ||
        path.includes('/ausangate') || path.includes('/peru-packages') || path.includes('/day-tours') ||
        path.includes('/rainbow-mountain') || path.includes('/inca-jungle') || path.includes('/choquequirao') ||
        path.includes('/family-tours') || path.includes('/luxury-glamping') || path.includes('/sacred-lakes') ||
        path.includes('/sustainable-tours')) {
      return {
        loc: path,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 0.9,
      };
    }

    // Homepage
    if (path === '/' || path === '/es' || path === '/en') {
      return {
        loc: path,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 1.0,
      };
    }

    // Páginas importantes
    if (path.includes('/about-us') || path.includes('/contact') || path.includes('/travel-deals')) {
      return {
        loc: path,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.8,
      };
    }

    return {
      loc: path,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.5,
    };
  },
};



