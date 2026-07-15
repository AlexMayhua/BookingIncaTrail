import Head from 'next/head';
import { NextSeo } from 'next-seo';
import { publicUrl, seoLocale } from '@/lib/brandConfig';

export default function TravelSeo({
  categoryTitle,
  categoryDescription,
  categoryImage,
  category,
  locale,
  trips,
}) {
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
                '@type': 'BreadcrumbList',
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: locale === 'en' ? 'Home' : 'Inicio',
                    item: publicUrl('/', locale),
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: categoryTitle,
                    item: publicUrl(`/${category}`, locale),
                  },
                ],
              },
              {
                '@context': 'https://schema.org',
                '@type': 'ItemList',
                name: `${categoryTitle} Tours`,
                description: categoryDescription,
                numberOfItems: trips.length,
                itemListElement: trips.slice(0, 10).map((trip, index) => ({
                  '@type': 'ListItem',
                  position: index + 1,
                  item: {
                    '@type': 'Product',
                    name: trip.title,
                    url: publicUrl(`/${category}/${trip.slug}`, locale),
                    image: trip.gallery?.[0]?.url || '',
                    offers: {
                      '@type': 'Offer',
                      price: trip.price?.toFixed(2) || '0.00',
                      priceCurrency: 'USD',
                      url: publicUrl(`/${category}/${trip.slug}`, locale),
                    },
                  },
                })),
              },
              {
                '@context': 'https://schema.org',
                '@type': 'TouristDestination',
                name: categoryTitle,
                description: categoryDescription,
                url: publicUrl(`/${category}`, locale),
                image: categoryImage,
              },
            ]),
          }}
        />
      </Head>
      <NextSeo
        title={`${categoryTitle} - Tours & Adventures | BookingIncatrail`}
        description={categoryDescription}
        canonical={publicUrl(`/${category}`, locale)}
        openGraph={{
          url: publicUrl(`/${category}`, locale),
          locale: localeMetadata.og,
          title: `${categoryTitle} - Tours & Adventures | BookingIncatrail`,
          description: categoryDescription,
          images: [
            {
              url: categoryImage,
              width: 1200,
              height: 630,
              alt: categoryTitle,
            },
          ],
        }}
      />
    </>
  );
}
