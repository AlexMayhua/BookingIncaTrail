import { useRouter } from 'next/router';
import en from '../../lang/en/home'
import es from '../../lang/es/home'
import { LazyLoadImage } from "react-lazy-load-image-component"
import Carrusel from './Carrusel'



export default function HeroSlider() {
    const router = useRouter()
    const { locale } = router;
    const t = locale === 'en' ? en : es;
    return (
        <section className="relative lg:h-4xh h-96"> 
            <Carrusel>
                {
                    t.hero_array.map((item, i) => (
                        <div key={i} className='relative'>
                            <LazyLoadImage
                                src={item.img}
                                alt={item.alt}
                                title={item.alt}
                                className='object-cover lg:h-4xh h-96'
                            />
                            <div className='absolute inset-0'>
                                <div className='absolute inset-0 bg-gradient-to-tl from-blue via-transparent to-transparent opacity-70'></div> 
                            </div>
                            <span className='absolute lg:top-1/3 md:top-1/4 bottom-40 left-0 right-0 lg:mx-36 mx-3 text-center text-white lg:text-6xl text-3xl animate-fadeinup opacity-0'>{item.title}</span>                            
                        </div>                        
                    ))
                }
            </Carrusel>
        </section>

    )
}