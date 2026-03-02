import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  // Versión para cache busting del favicon
  const faviconVersion = '2.0.0';

  return (
    <Html>
      <Head>
        {/* Preconnect para recursos externos - mejora performance */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />

        {/* Favicon con cache busting */}
        <link rel="icon" href={`/favicon.ico?v=${faviconVersion}`} />

        {/* Favicon para diferentes tamaños */}
        <link rel="icon" type="image/png" sizes="32x32" href={`/favicon-32x32.png?v=${faviconVersion}`} />
        <link rel="icon" type="image/png" sizes="16x16" href={`/favicon-16x16.png?v=${faviconVersion}`} />

        {/* Apple Touch Icon para iOS */}
        <link rel="apple-touch-icon" sizes="180x180" href={`/apple-touch-icon.png?v=${faviconVersion}`} />

        {/* Android Chrome */}
        <link rel="icon" type="image/png" sizes="192x192" href={`/android-chrome-192x192.png?v=${faviconVersion}`} />
        <link rel="icon" type="image/png" sizes="512x512" href={`/android-chrome-512x512.png?v=${faviconVersion}`} />

        {/* Manifest para PWA */}
        <link rel="manifest" href={`/site.webmanifest?v=${faviconVersion}`} />

        {/* Theme color para navegadores móviles */}
        <meta name="theme-color" content="#005249" />

        {/* Microsoft Tiles */}
        <meta name="msapplication-TileColor" content="#005249" />
        <meta name="msapplication-TileImage" content={`/mstile-150x150.png?v=${faviconVersion}`} />

        {/* Safari Pinned Tab */}
        <link rel="mask-icon" href={`/safari-pinned-tab.svg?v=${faviconVersion}`} color="#005249" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
