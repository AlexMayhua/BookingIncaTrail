import Head from 'next/head';
import { NextSeo } from 'next-seo';
import { BRAND, absoluteUrl, getLogoUrlAbsolute } from '@/lib/brandConfig';

export default function TourSeo({
  tour,
  category,
  categoryTitle,
  originalPrice,
}) {
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
                url: absoluteUrl(`/${category}/${tour.slug}`),
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
                url: absoluteUrl(`/${category}/${tour.slug}`),
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
                  url: absoluteUrl(`/${category}/${tour.slug}`),
                  priceValidUntil: new Date(
                    new Date().setFullYear(new Date().getFullYear() + 1),
                  )
                    .toISOString()
                    .split('T')[0],
                },
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: '4.9',
                  reviewCount: '8900',
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
                    item: absoluteUrl('/'),
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: categoryTitle,
                    item: absoluteUrl(`/${category}`),
                  },
                  {
                    '@type': 'ListItem',
                    position: 3,
                    name: tour.title,
                    item: absoluteUrl(`/${category}/${tour.slug}`),
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
        canonical={absoluteUrl(`/${category}/${tour.slug}`)}
        openGraph={{
          url: absoluteUrl(`/${category}/${tour.slug}`),
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
