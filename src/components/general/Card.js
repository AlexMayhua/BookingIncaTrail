import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import en from '../../lang/en/home'
import es from '../../lang/es/home'

export default function Card({ title, description, image, price, id, difficulty, group_size, category, trip, slug }) {
    const router = useRouter();
    const { locale } = router;
    const t = locale === 'en' ? en : es;
    // Función para limpiar HTML y obtener solo texto
    const cleanHTML = (html) => {
        if (!html) return '';
        // Remover tags HTML
        const text = html.replace(/<[^>]*>/g, ' ');
        // Remover entidades HTML comunes
        const decoded = text
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"');
        // Limpiar espacios múltiples y retornar primeras 150 caracteres
        return decoded.replace(/\s+/g, ' ').trim().substring(0, 150) + '...';
    };

    // Función para extraer número de días de la duración
    const getDurationDays = (duration) => {
        if (!duration) return null;
        // Si ya es un número, retornarlo
        if (typeof duration === 'number') return duration;
        // Extraer el primer número de strings como "4 Days / 3 Nights"
        const match = String(duration).match(/(\d+)/);
        return match ? match[1] : null;
    };

    // Usar datos del objeto trip si está disponible, sino usar props individuales
    const cardData = trip || {
        title,
        description,
        image,
        price,
        _id: id,
        difficulty,
        group_size,
        category,
        slug: slug || id,
        duration: null,
        gallery: null
    };

    // Obtener la imagen correcta (desde gallery o prop image)
    const cardImage = cardData.gallery && cardData.gallery.length > 0
        ? cardData.gallery[0].url
        : cardData.image || image || 'https://via.placeholder.com/400x300?text=Tour+Imagen';

    // Limpiar la descripción si tiene HTML
    const cardDescription = cleanHTML(cardData.description || description);

    // Extraer días de duración
    const durationDays = getDurationDays(cardData.duration);

    // Construir la URL correcta basada en la categoría
    const getCardUrl = () => {
        if (cardData.category === 'Trek') {
            return `/treks/${cardData.slug || cardData._id}`;
        }
        // Normalizar la categoría para la URL
        const normalizedCategory = cardData.category?.toLowerCase().replace(/\s+/g, '-') || 'tours';
        return `/${normalizedCategory}/${cardData.slug || cardData._id}`;
    };

    return (
        <div className='w-full my-3 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100'>
            <div className='relative lg:h-64 h-60'>
                <Image
                    alt={cardData.title || "Tour image"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    src={cardImage}
                    className='object-cover w-full h-full'
                />
                {cardData.price && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-secondary to-yellow-400 text-primary px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        ${cardData.price}
                    </div>
                )}
                {cardData.difficulty && (
                    <div className="absolute top-4 left-4 bg-primary bg-opacity-80 text-white px-2 py-1 rounded-full text-xs font-medium">
                        {cardData.difficulty}
                    </div>
                )}
            </div>
            <div className='p-5'>
                <div className='mb-4'>
                    <h3 className='font-bold text-xl text-slate-900 mb-3 line-clamp-2 leading-tight'>
                        {cardData.title}
                    </h3>
                    {cardDescription && (
                        <p className='text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed'>
                            {cardDescription}
                        </p>
                    )}
                    <div className='grid grid-cols-2 gap-3 text-sm'>
                        {durationDays && (
                            <div className='flex items-center bg-gray-50 p-2 rounded-lg'>
                                <svg className="w-4 h-4 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                <span className='font-medium text-gray-700'>{durationDays} días</span>
                            </div>
                        )}
                        {cardData.group_size && (
                            <div className='flex items-center bg-gray-50 p-2 rounded-lg'>
                                <svg className="w-4 h-4 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                                </svg>
                                <span className='font-medium text-gray-700'>{cardData.group_size}</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className='flex items-center justify-between pt-4 border-t border-gray-200'>
                    <Link
                        href={getCardUrl()}
                        className='bg-gradient-to-r from-secondary to-yellow-400 text-primary px-6 py-3 rounded-lg text-sm font-bold hover:from-yellow-400 hover:to-secondary transition-all duration-300 flex-1 text-center mr-3 shadow-md hover:shadow-lg transform hover:scale-105'>
                        
                            {t.view_details || (locale === 'en' ? 'View Details' : 'Ver detalles')}
                        
                    </Link>
                    {cardData.price && (
                        <div className='text-right'>
                            <p className='text-xs text-gray-500 uppercase tracking-wide'>{t.from || (locale === 'en' ? 'From' : 'Desde')}</p>
                            <p className='text-xl font-bold text-primary'>${cardData.price}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}