/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Desactivar el indicador flotante de Next.js en desarrollo
  devIndicators: false,

  // Silenciar warning de workspace root con múltiples lockfiles
  outputFileTracingRoot: __dirname,

  // i18n configuration for Pages Router
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'en',
  },

  // Image optimization configuration for Next.js 15
  images: {
    localPatterns: [
      {
        pathname: '/assets/**',
        // search omitted to allow query strings like ?v=2.0.0
      },
      {
        pathname: '/img/**',
      },
      {
        pathname: '/home/**',
      },
      {
        pathname: '/storage/**',
      },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
    ],
    // Mantener formato legible de imágenes
    unoptimized: false,
  },

  // Redirects configuration
  // ACTUALIZADO: Enero 2026 - Nueva estructura SEO-optimizada
  async redirects() {
    return [
      // === LEGACY REDIRECTS: /category/* → /* ===
      {
        source: '/category/inca-trail',
        destination: '/inca-trail',
        permanent: true,
      },
      {
        source: '/category/salkantay',
        destination: '/salkantay',
        permanent: true,
      },
      {
        source: '/category/machupicchu',
        destination: '/machupicchu',
        permanent: true,
      },
      {
        source: '/category/cusco',
        destination: '/cusco',
        permanent: true,
      },
      {
        source: '/category/day-tours',
        destination: '/day-tours',
        permanent: true,
      },
      {
        source: '/category/peru-packages',
        destination: '/peru-packages',
        permanent: true,
      },
      {
        source: '/category/rainbow-mountain',
        destination: '/rainbow-mountain',
        permanent: true,
      },
      {
        source: '/category/ausangate',
        destination: '/ausangate',
        permanent: true,
      },
      {
        source: '/category/inca-jungle',
        destination: '/inca-jungle',
        permanent: true,
      },

      // === NEW 2026: Redirects para nuevas categorías ===
      {
        source: '/category/choquequirao',
        destination: '/choquequirao',
        permanent: true,
      },
      {
        source: '/category/sacred-lakes',
        destination: '/sacred-lakes',
        permanent: true,
      },
      {
        source: '/category/luxury-glamping',
        destination: '/luxury-glamping',
        permanent: true,
      },
      {
        source: '/category/family-tours',
        destination: '/family-tours',
        permanent: true,
      },
      {
        source: '/category/sustainable-tours',
        destination: '/sustainable-tours',
        permanent: true,
      },

      // === MIGRACIÓN: alternative-tours → Nuevas categorías ===
      // Redirect genérico de alternative-tours a choquequirao (categoría principal)
      {
        source: '/alternative-tours',
        destination: '/choquequirao',
        permanent: true,
      },
      {
        source: '/category/alternative-tours',
        destination: '/choquequirao',
        permanent: true,
      },

      // Redirects específicos de tours migrados desde alternative-tours
      {
        source: '/alternative-tours/choquequirao-trek-4-days',
        destination: '/choquequirao/choquequirao-trek-4-days',
        permanent: true,
      },
      {
        source: '/alternative-tours/inca-quarry-trail-to-machu-picchu',
        destination: '/inca-trail/inca-quarry-trail-to-machu-picchu',
        permanent: true,
      },
      {
        source: '/alternative-tours/humantay-lake',
        destination: '/sacred-lakes/humantay-lake',
        permanent: true,
      },
      {
        source: '/alternative-tours/Waqrapukara-trek',
        destination: '/day-tours/Waqrapukara-trek',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
