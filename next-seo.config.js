import { BRAND } from './src/lib/brandConfig';

const additionalMetaTags = [
  {
    name: 'google-site-verification',
    content: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || ''
  },
  {
    name: 'theme-color',
    content: '#005249'  // Color primary de BookingIncatrail
  },
  {
    name: 'MobileOptimized',
    content: 'width'
  },
  {
    name: 'HandheldFriendly',
    content: 'true'
  }
];

const additionalLinkTags = [
  {
    rel: 'icon',
    href: '/favicon.ico'
  }
];

const openGraph = {
  type: 'website',
  locale: 'es_PE',
  url: BRAND.siteUrl,
  siteName: BRAND.name
};

const twitter = {
  handle: '@bookingincatrail',
  site: '@bookingincatrail',
  cardType: 'summary_large_image'
};

export const SEO = {
  additionalMetaTags,
  additionalLinkTags,
  openGraph,
  twitter
};

export const DefaultSeo = {
  ...SEO
};
