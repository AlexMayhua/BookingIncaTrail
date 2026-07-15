import '../styles/globals.css';
import '../styles/react-datepicker.css';
import '../styles/custom-tailwind.css';
import '../styles/cal.css';
import '../styles/hero.css';
import '../styles/tours.css';
import '../styles/categories-section.css';
import 'keen-slider/keen-slider.min.css';
import 'react-quill-new/dist/quill.snow.css';
import { GoogleTagManager } from '@next/third-parties/google';

import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { GTM_ID } from '../lib/gtm';
import { DefaultSeo } from 'next-seo';
import { DefaultSeo as DefaultSeoConfig } from '../../next-seo.config.js';
import { seoLocale } from '../lib/brandConfig';

import { DataProvider } from '../store/GlobalState';
import Layout from '../layout/Layout';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { pathname, locale } = router;

  const localeMetadata = seoLocale(locale);
  const isAdminPage = pathname.startsWith('/admin');
  const LayoutComponent = isAdminPage ? ({ children }) => children : Layout;

  useEffect(() => {
    document.documentElement.lang = localeMetadata.lang;
  }, [localeMetadata.lang]);

  useEffect(() => {
    const handleRouteChange = (url) => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'virtual_pageview',
        page: url,
      });
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <DefaultSeo
        {...DefaultSeoConfig}
        openGraph={{
          ...DefaultSeoConfig.openGraph,
          locale: localeMetadata.og,
        }}
      />
      <GoogleTagManager gtmId={GTM_ID} />
      <DataProvider>
        <LayoutComponent>
          <Component {...pageProps} />
        </LayoutComponent>
      </DataProvider>
    </>
  );
}

export default MyApp;
