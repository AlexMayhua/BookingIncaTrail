import { NextSeo } from 'next-seo'
import EmailFormulary from '../components/general/EmailFormulary.js'
import en from '../lang/en/contact'
import es from '../lang/es/contact'
import { useRouter } from 'next/router.js';
import { BRAND, absoluteUrl } from '../lib/brandConfig';

export default function contact() {

  const router = useRouter()
  const { locale } = router;
  const t = locale === 'en' ? en : es;
  return (
    <>
      <NextSeo
        title={t.meta_title}
        description={t.meta_description}
        canonical={absoluteUrl('/contact')}
        
        openGraph={{
          url: absoluteUrl('/contact'),
          title: t.meta_title,
          description: t.meta_description,
          images: [
            {
                url: '/img/hero/hero-slider-1.jpeg',
                width: 1400,
                height: 465,
                type: 'image/jpg',
            }
        ],
        site_name: BRAND.name,
        }}
      />
          <div className='flex justify-center'>
            <div className=' lg:mx-0 mx-2'>
              <EmailFormulary/>
            </div>

          </div>

    </>
  )
}
