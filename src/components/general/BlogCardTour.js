import Link from 'next/link';
import { useRouter } from 'next/router';
import en from '../../lang/en/home';
import es from '../../lang/es/home';

/**
 * BlogCardTour - Tarjeta de blog con estilo de TourCard
 * Usa los mismos estilos CSS de tours.css para consistencia visual
 */
export default function BlogCardTour({ post }) {
    const router = useRouter();
    const { locale } = router;
    const t = locale === 'en' ? en : es;

    if (!post) return null;

    // Obtener imagen
    const imageUrl = post.image?.[0]?.url || '/general/hero/mapi-home.jpg';
    const imageAlt = post.image?.[0]?.alt || post.title;

    // Formatear fecha
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString(locale === 'en' ? 'en-US' : 'es-PE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Limpiar HTML y obtener excerpt
    const cleanExcerpt = (html) => {
        if (!html) return '';
        return html
            .replace(/<[^>]*>/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 80) + '...';
    };

    // Obtener categoría principal
    const mainCategory = post.categories?.[0]?.name || (locale === 'en' ? 'Travel Guide' : 'Guía de Viaje');

    return (
        <Link href={`/blog/${post.slug}`} className="tour-card blog-card-tour">
            {/* Imagen de fondo */}
            <div className="tour-card-image">
                <img
                    src={imageUrl}
                    alt={imageAlt}
                    title={post.title}
                    loading="lazy"
                />
            </div>

            {/* Overlay gradiente */}
            <div className="tour-card-overlay"></div>

            {/* Badge de categoría */}
            {mainCategory && (
                <div className="tour-card-badge blog-badge">
                    {mainCategory}
                </div>
            )}

            {/* Contenido siempre visible */}
            <div className="tour-card-content">
                {/* Información básica */}
                <div className="tour-card-info">
                    <span className="tour-card-category">
                        {formatDate(post.date)}
                    </span>
                    <h3 className="tour-card-title">{post.title}</h3>
                </div>

                {/* Footer con autor y tiempo de lectura */}
                <div className="tour-card-footer">
                    <div className="tour-card-duration">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                        </svg>
                        <span>5 {t.min_read}</span>
                    </div>
                    {post.author && (
                        <div className="tour-card-price blog-author">
                            <span className="price-label">{t.by}</span>
                            <span className="price-current blog-author-name">{post.author.name || 'Admin'}</span>
                        </div>
                    )}
                </div>

                {/* Botón de acción (aparece en hover) */}
                <div className="tour-card-action">
                    <span className="tour-card-btn">
                        {t.read_article}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </span>
                </div>
            </div>
        </Link>
    );
}
