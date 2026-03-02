import '../styles/globals.css'
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import '../styles/react-datepicker.css'
import '../styles/custom-tailwind.css'
import '../styles/cal.css'
import '../styles/hero.css'
import '../styles/tours.css'
import '../styles/categories-section.css'
import { initFacebookPixel } from '../lib/facebookPixel';
import { initTikTokPixel } from '../lib/tiktokPixel';
import Script from 'next/script'
import { GTM_ID, pageview } from '../lib/gtm'
import { DefaultSeo } from 'next-seo';
import { DefaultSeo as DefaultSeoConfig } from '../../next-seo.config.js';
import { DataProvider } from '../store/GlobalState'
import Layout from '../layout/Layout';
import AdminLayout from '../layout/AdminLayout';
import 'keen-slider/keen-slider.min.css';

function MyApp({ Component, pageProps }) {
  const { pathname } = useRouter();
  const router = useRouter()
  const lang = pathname.startsWith("/es") ? "es-ES" : "en";
  
  // Determinar si la página es del admin
  const isAdminPage = pathname.startsWith('/admin');
  const LayoutComponent = isAdminPage ? AdminLayout : Layout;
  
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    // Inicializa ambos píxeles
    initFacebookPixel();
    initTikTokPixel();

    const handleRouteChange = (url) => {
      // Rastrear la vista de página para ambos píxeles
      if (typeof window.fbq !== 'undefined') {
        window.fbq('track', 'PageView');
      }

      if (typeof window.ttq !== 'undefined') {
        window.ttq.push(['track', 'PageView']);  // Event type for TikTok
      }

      if (typeof window !== 'undefined') {
        pageview(url); // Google Tag Manager pageview
      }
    };

    // Escuchar los cambios de ruta
    router.events.on('routeChangeComplete', handleRouteChange);

    // Limpiar el evento cuando el componente se desmonte
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <DefaultSeo {...DefaultSeoConfig} />

      {/* Solo cargar GTM si el ID está definido */}
      {GTM_ID && (
        <Script
          id="gtm-head"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />
      )}

      <DataProvider>
        <LayoutComponent>
          <Component {...pageProps} />
        </LayoutComponent>
      </DataProvider>
    </>
  )
}

export default MyApp
