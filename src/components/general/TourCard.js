import Link from 'next/link';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useRouter } from 'next/router';
import en from '../../lang/en/home';
import es from '../../lang/es/home';

export default function TourCard({ tour }) {
    const router = useRouter();
    const { locale } = router;
    const t = locale === 'en' ? en : es;

    // Obtener la imagen correcta (desde gallery o placeholder)
    const tourImage = tour.gallery && tour.gallery.length > 0
        ? tour.gallery[0].url
        : 'https://via.placeholder.com/400x300?text=Tour+Imagen';

    const tourImageAlt = tour.gallery && tour.gallery.length > 0
        ? tour.gallery[0].alt || tour.title
        : tour.title;

    // Obtener quickstats si existen
    const tourType = tour.quickstats && tour.quickstats.length > 0
        ? tour.quickstats[0].content
        : tour.category?.replace('-', ' ');

    return (
        <div className="custom-link-diagonal-sweep-activator relative bg-white drop-shadow-[0_0_2px_rgba(50,50,50,0.25)] rounded h-full hover:shadow-lg hover:drop-shadow-[0_0_4px_rgba(50,50,50,0.5)] transition-shadow duration-300">
            <div className="text-center relative h-56 cursor-pointer rounded-t overflow-hidden">
                <Link
                    href={`/${tour.category}/${tour.slug}`}
                    className="block h-56 w-full rounded-t overflow-hidden">

                    <img
                        src={tourImage}
                        alt={tourImageAlt}
                        title={tourImageAlt}
                        className="h-56 w-full object-cover rounded-t transition duration-300 ease-in-out hover:scale-110"
                    />

                </Link>
            </div>
            <div className="h-[15rem] px-1">
                <h3 className="text-2xl my-3 capitalize line-clamp-2">{tour.title}</h3>
                <div className="flex justify-between p-2">
                    <div className="flex-wrap gap-3">
                        {tour.duration && (
                            <span className="flex cursor-pointer p-1">
                                <LazyLoadImage src="/assets/icon/time.png" alt='Time' className="w-5 h-5" />&nbsp;
                                <span className="text-left text-primary">{tour.duration}</span>
                            </span>
                        )}
                        {tourType && (
                            <span className="flex cursor-pointer p-1">
                                <LazyLoadImage src="/assets/icon/type-tour.png" alt='Type' className="w-5 h-5 text-left text-primary" />&nbsp;
                                <span className="text-left text-primary capitalize">{tourType}</span>
                            </span>
                        )}
                    </div>
                    <div className="text-right">
                        {tour.price && (
                            <>
                                <span className="text-sm font-bold">{t.from}</span> <br />
                                {tour.discount && tour.discount > 0 ? (
                                    <div>
                                        <span className="line-through text-red-700 decoration-red-700 text-sm font-bold">$ {tour.price}.00</span><br />
                                        <span className="text-2xl font-bold py-2 ">$ {(tour.price - (tour.price * tour.discount) / 100).toFixed(0)}.00</span>
                                    </div>
                                ) : (
                                    <span className="text-2xl font-bold py-2 ">$ {tour.price}.00</span>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="absolute bottom-0 right-0 left-0 cursor-pointer">
                <div className="flex text-center">
                    <Link
                        href={`/${tour.category}/${tour.slug}`}
                        className="bg-primary text-secondary custom-link-diagonal-sweep font-bold py-3 w-full rounded-b">

                        {t.btn_viewtrip}

                    </Link>
                </div>
            </div>
        </div>
    );
}
