import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router.js';
import EmailFormulary from '../components/general/EmailFormulary.js';
import en from '../lang/en/contact';
import es from '../lang/es/contact';
import { BRAND, absoluteUrl } from '../lib/brandConfig';

export default function ContactPage() {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'en' ? en : es;
  const localizedPath = locale === 'es' ? '/es/contact' : '/contact';

  return (
    <>
      <NextSeo
        title={t.meta_title}
        description={t.meta_description}
        canonical={absoluteUrl(localizedPath)}
        openGraph={{
          url: absoluteUrl(localizedPath),
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
          <EmailFormulary t={t} />
        </div>
      </div>
    </>
  );
}
