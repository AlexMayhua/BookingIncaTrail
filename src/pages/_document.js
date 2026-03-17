import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  // Versión para cache busting del favicon
  const faviconVersion = '2.0.0';

  return (
    <Html>
      <Head>
        {/* Preconnect para recursos externos - mejora performance */}
        <link rel='preconnect' href='https://res.cloudinary.com' />
        <link rel='dns-prefetch' href='https://res.cloudinary.com' />

        {/* Favicon con cache busting */}
        <link
          rel='icon'
          href={`/favicon.ico?v=${faviconVersion}`}
          sizes='any'
        />

        {/* Manifest para PWA */}
        <link rel='manifest' href={`/site.webmanifest?v=${faviconVersion}`} />

        {/* Theme color para navegadores móviles */}
        <meta name='theme-color' content='#005249' />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
