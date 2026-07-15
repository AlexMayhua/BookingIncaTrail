import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router.js';
import EmailFormulary from '../components/general/EmailFormulary.js';
import en from '../lang/en/contact';
import es from '../lang/es/contact';
import { BRAND, publicUrl, seoLocale } from '../lib/brandConfig';

export default function ContactPage() {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'en' ? en : es;
  const localeMetadata = seoLocale(locale);

  return (
    <>
      <NextSeo
        title={t.meta_title}
        description={t.meta_description}
        canonical={publicUrl('/contact', locale)}
        openGraph={{
          url: publicUrl('/contact', locale),
          locale: localeMetadata.og,
          title: t.meta_title,
          description: t.meta_description,
          images: [
            {
              url: '/img/hero/hero-slider-1.jpeg',
              width: 1400,
              height: 465,
              type: 'image/jpg',
            },
          ],
          site_name: BRAND.name,
        }}
      />
      <div className='flex justify-center'>
        <div className='mx-2 lg:mx-0'>
          <EmailFormulary t={t} locale={locale} />
        </div>
      </div>
    </>
  );
}
