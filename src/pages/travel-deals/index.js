import { useRouter } from 'next/router'
import en from '../../lang/en/deals'
import parser from 'html-react-parser'
import { NextSeo } from 'next-seo'
import es from '../../lang/es/deals'
import { API_URL } from '../../lib/constants'
import { LazyLoadImage } from "react-lazy-load-image-component"
import Link from 'next/link'
import { BRAND, absoluteUrl } from '../../lib/brandConfig'


export default function Deals({ deals }) {
    const router = useRouter()
    const { locale } = router;
    const t = locale === 'en' ? en : es;

    return (
      <>
        <NextSeo
        title='Travel Deals'
        description={`Welcome to ${BRAND.name}! Our tours are designed to offer you an unforgettable travel experience. Whether you prefer to join a shared group or opt for a private tour, we have got you covered.`}
        canonical={absoluteUrl('/travel-deals')}
        openGraph={{
          url: absoluteUrl('/travel-deals'),
          title: 'Travel Deals',
          description: `Welcome to ${BRAND.name}! Our tours are designed to offer you an unforgettable travel experience. Whether you prefer to join a shared group or opt for a private tour, we have got you covered.`,
          images: [
            {
              url: '/img/hero/hero-slider-1.jpeg',
              width: 1400,
              height: 465,
              type: 'image/jpeg',
            }
          ],
          site_name: BRAND.name
        }}
      />
        <div className='lg:mx-20 mx-2'>
            <h1 className='lg:text-4xl text-3xl mt-8'>{t.title}</h1>

            <div className='my-6 text-xl'>{parser(t.content)}</div>
            <h4 className='text-3xl '>{t.content_1}</h4>

            <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 my-8">
                {
                    deals.slice(0, 6).map((item, i) => (
                        <div key={i} className='hover:shadow-lg relative'>
              <div className="text-center relative h-56 cursor-pointer">
                <LazyLoadImage 
                  src={item.gallery[0].url}
                  alt={item.gallery[0].alt}
                  title={item.gallery[0].alt}
                  className=" h-56 w-full object-cover" />

              </div>

              <div className=" p-2 h-96">
                <h3 className="text-xl my-3">{item.title}</h3>
                <p>{item.highlight}</p>

              </div>

              <div className=" absolute bottom-0 right-0 left-0">
                <div >
                  <div className="text-right my-2 p-2">
                    <span className="text-sm font-bold">{t.from}</span> <br />
                    {
                      item.discount === 0 ? (

                        <span className="text-2xl font-bold py-2 ">$ {item.price}.00</span>

                      ) :
                        <div className="">
                          <span className="line-through text-red-700 decoration-red-700 text-sm font-bold">$ {item.price}.00</span><br />

                          <span className="text-2xl font-bold py-2 ">$ {(item.price - (item.price * item.discount) / 100).toFixed(0)}.00</span>
                        </div>
                    }
                  </div>
                </div>


                <div className="flex text-center ">
                  <Link
                    href={`/${item.category}/${item.slug}`}
                    className="bg-primary text-secondary hover:bg-secondary  hover:text-primary font-bold py-3 w-full">{locale ==='en'? 'View Tour': 'Ver Tour'}</Link>
                </div>

              </div>
            </div>
                    ))
                }
            </div>
        </div>
      </>
    );
}

export async function getServerSideProps({ ctx, locale }) {
    const lang = locale
    const res1 = await fetch(`${API_URL}/api/trip/deals?locale=${lang}`)
    const deals = await res1.json()

    return {
        props: {
            deals,
        },
    }
}