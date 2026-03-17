import { NextSeo } from 'next-seo';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import en from '../lang/en/home';
import es from '../lang/es/home';
import FrontPage from '../components/home/FrontPage';
import { BRAND, absoluteUrl, getLogoUrlAbsolute } from '../lib/brandConfig';
import SectionAllTours from '../components/home/SectionAllTours';
import { listTrips } from '@/modules/trips/service/trip.service'
import SimpleCategoryLayout from '@/components/home/SimpleCategoryLayout';

const Section1 = dynamic(() => import('../components/home/Section1'), {
  loading: () => <div className='min-h-[400px]' />,
  ssr: true,
});
const Section6 = dynamic(() => import('../components/home/Section6'), {
  loading: () => <div className='min-h-[400px]' />,
  ssr: true,
});
const Section7 = dynamic(() => import('../components/home/Section7'), {
  loading: () => <div className='min-h-[300px]' />,
  ssr: true,
});
const Section9 = dynamic(() => import('../components/home/Section9'), {
  loading: () => <div className='min-h-[300px]' />,
  ssr: true,
});
const SectionAlliances = dynamic(
  () => import('../components/home/SectionAlliances'),
  {
    loading: () => <div className='min-h-[400px]' />,
    ssr: true,
  },
);

export default function Index({ topTreks = [], allServices = [] }) {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'en' ? en : es;

  // Asegurar que topTreks sea un array
  const treks = Array.isArray(topTreks) ? topTreks : [];

  const text =
    '<p>A professional local tour company -<strong>&nbsp;100% Peruvian</strong>. We offer&nbsp;<strong>trips to Machu Picchu</strong>, The original<strong>&nbsp;Classic Inca trail</strong>&nbsp;(no shortcuts!),&nbsp;<strong>Salkantay trekking, Lares trek, Choquequirao trek,</strong>&nbsp;as well as customized treks and hikes for professional hikers.<br /> We also offer approachable hikes for those unable to participate in the classical routes.<br /> <strong>Owned by Abraham Ocon Rojas, Official Tour guide of Machu Picchu with 17 years of experience</strong>&nbsp;in Peruvian treks, hikes and historical sites. We would gladly take you on your next unforgetable life changing expedition!</p>';

  const [isOpen, setIsOpen] = useState(false);

  // Función que cierra si haces clic en el fondo oscuro
  const handleOverlayClick = (e) => {
    if (e.target.id === 'modal-overlay') {
      setIsOpen(false);
    }
  };

  function limitWords(text, wordLimit = 15) {
    return text.split(' ').slice(0, wordLimit).join(' ') + ' ...';
  }

  const [isZoomed, setIsZoomed] = useState(false);

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
                url: BRAND.siteUrl,
                logo: getLogoUrlAbsolute(),
                description: t.meta_description,
                address: {
                  '@type': 'PostalAddress',
                  addressCountry: 'PE',
                  addressRegion: 'Cusco',
                },
                contactPoint: {
                  '@type': 'ContactPoint',
                  telephone: BRAND.contactPhone,
                  contactType: 'customer service',
                  email: BRAND.contactEmail,
                  availableLanguage: ['Spanish', 'English'],
                },
                sameAs: [
                  BRAND.social.facebook,
                  BRAND.social.instagram,
                  BRAND.social.tiktok,
                  BRAND.social.youtube,
                ].filter(Boolean),
              },
              {
                '@context': 'https://schema.org',
                '@type': 'TravelAgency',
                name: BRAND.name,
                url: BRAND.siteUrl,
                logo: getLogoUrlAbsolute(),
                priceRange: '$$',
                address: {
                  '@type': 'PostalAddress',
                  addressCountry: 'PE',
                  addressRegion: 'Cusco',
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
                '@type': 'ItemList',
                name: 'Featured Tours',
                description: 'Top adventure tours in Peru',
                numberOfItems: treks.length,
                itemListElement: treks.slice(0, 10).map((trek, index) => ({
                  '@type': 'ListItem',
                  position: index + 1,
                  item: {
                    '@type': 'Product',
                    name: trek.title,
                    url: absoluteUrl(`/${trek.category}/${trek.slug}`),
                    image: trek.gallery?.[0]?.url || '',
                    offers: {
                      '@type': 'Offer',
                      price: trek.price?.toFixed(2) || '0.00',
                      priceCurrency: 'USD',
                    },
                  },
                })),
              },
            ]),
          }}
        />
      </Head>
      <NextSeo
        title={t.meta_title}
        description={t.meta_description}
        canonical={absoluteUrl('/')}
        openGraph={{
          url: absoluteUrl('/'),
          title: t.meta_title,
          description: t.meta_description,
          images: [
            {
              url: '/img/hero/hero-slider-4-min.jpg',
              width: 1400,
              height: 465,
              type: 'image/jpg',
            },
          ],
          site_name: BRAND.name,
        }}
      />

      {/* Hero Section con Top Tours integrado */}
      <FrontPage />

      <section id='alltours'>
        <div className='xl:hidden'>
          <SectionAllTours tours={allServices} sectionId={undefined} />
        </div>
        <div className='hidden xl:block'>
          <SimpleCategoryLayout tours={allServices} />
        </div>
      </section>

      <div className='2xl:container mx-auto'>
        <div className='lg:mx-20 mx-5 md:mx-8'>
          <Section1 />
          <Section6 />
          <Section7 />
          <Section9 />
          <SectionAlliances />
        </div>
      </div>
    </>
  );
}

export async function getStaticProps({ locale }) {
  try {
    const [topTreks, allServices] = await Promise.all([
      listTrips({
        locale,
        isDeals: true,
        fields: 'title,slug,gallery,price,discount,category,quickstats,duration,meta_title,meta_description,isDeals',
      }),
      listTrips({
        locale,
        fields: 'title,slug,gallery,price,discount,category,quickstats,duration',
      }),
    ]);

    return {
      props: {
        topTreks: JSON.parse(JSON.stringify(topTreks)),
        allServices: JSON.parse(JSON.stringify(allServices)),
      },
      revalidate: 3600,
    };
  } catch (err) {
    console.error('getStaticProps: error fetching data', err);
    return { props: { topTreks: [], allServices: [] }, revalidate: 3600 };
  }
}
