import Head from 'next/head';
import { NextSeo } from 'next-seo';
import {
  BRAND,
  absoluteUrl,
  getLogoUrlAbsolute,
  publicUrl,
  seoLocale,
} from '@/lib/brandConfig';

export default function TourSeo({
  tour,
  category,
  categoryTitle,
  originalPrice,
  locale,
}) {
  const tourUrl = publicUrl(`/${category}/${tour.slug}`, locale);
  const localeMetadata = seoLocale(locale);

  return (
    <>
      <Head>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: BRAND.name,
                url: absoluteUrl('/'),
                logo: getLogoUrlAbsolute(),
                sameAs: [
                  BRAND.social.facebook,
                  BRAND.social.instagram,
                  BRAND.social.tiktok,
                  BRAND.social.youtube,
                ].filter(Boolean),
              },
              {
                '@context': 'https://schema.org',
                '@type': 'TouristAttraction',
                name: tour.title,
                description: tour.meta_description,
                image: tour.gallery?.map((img) => img.url) || [],
                url: tourUrl,
                touristType: 'Adventure Travelers',
              },
              {
                '@context': 'https://schema.org',
                '@type': 'Product',
                name: tour.title,
                description: tour.meta_description,
                image: tour.gallery?.[0]?.url || '',
                brand: { '@type': 'Brand', name: BRAND.name },
                offers: {
                  '@type': 'Offer',
                  price: originalPrice.toFixed(2),
                  priceCurrency: 'USD',
                  availability: 'https://schema.org/InStock',
                  url: tourUrl,
                  priceValidUntil: new Date(
                    new Date().setFullYear(new Date().getFullYear() + 1),
                  )
                    .toISOString()
                    .split('T')[0],
                },
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: '4.9',
                  reviewCount: '150',
                  bestRating: '5',
                  worstRating: '1',
                },
              },
              {
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: publicUrl('/', locale),
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: categoryTitle,
                    item: publicUrl(`/${category}`, locale),
                  },
                  {
                    '@type': 'ListItem',
                    position: 3,
                    name: tour.title,
                    item: tourUrl,
                  },
                ],
              },
            ]),
          }}
        />
      </Head>
      <NextSeo
        title={tour.title || tour.meta_title}
        description={tour.meta_description || tour.sub_title}
        canonical={tourUrl}
        openGraph={{
          url: tourUrl,
          locale: localeMetadata.og,
          title: tour.meta_title || tour.title,
          description: tour.meta_description || tour.sub_title,
          images: tour.gallery?.[0]
            ? [
                {
                  url: tour.gallery[0].url,
                  width: 1600,
                  height: 620,
                  type: `image/${tour.gallery[0].url.split('.').pop().split('?')[0]}`,
                },
              ]
            : [],
        }}
      />
    </>
  );
}
