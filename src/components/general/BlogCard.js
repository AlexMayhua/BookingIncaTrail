import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

/**
 * Componente BlogCard - Tarjeta para mostrar artículos del blog
 * Compatible con datos de WordPress Headless
 */
export default function BlogCard({ post }) {
    const router = useRouter();
    const { locale } = router;

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
            month: 'long',
            day: 'numeric'
        });
    };

    // Limpiar HTML del excerpt
    const cleanExcerpt = (html) => {
        if (!html) return '';
        return html
            .replace(/<[^>]*>/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 150) + '...';
    };

    return (
        <article className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
            {/* Imagen */}
            <div className="relative h-56 overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Overlay gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Categorías */}
                {post.categories && post.categories.length > 0 && (
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        {post.categories.slice(0, 2).map((cat) => (
                            <span
                                key={cat.id}
                                className="bg-primary/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full"
                            >
                                {cat.name}
                            </span>
                        ))}
                    </div>
                )}

                {/* Fecha */}
                {post.date && (
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-3 py-1 rounded-full shadow-md">
                        {formatDate(post.date)}
                    </div>
                )}
            </div>

            {/* Contenido */}
            <div className="p-6">
                {/* Título */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                    {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {cleanExcerpt(post.min_content || post.excerpt)}
                </p>

                {/* Autor (si está disponible) */}
                {post.author && (
                    <div className="flex items-center mb-4 pb-4 border-b border-gray-100">
                        {post.author.avatar && (
                            <Image
                                src={post.author.avatar}
                                alt={post.author.name}
                                width={32}
                                height={32}
                                className="rounded-full mr-3"
                            />
                        )}
                        <span className="text-sm text-gray-500">
                            {locale === 'en' ? 'By' : 'Por'} <span className="font-medium text-gray-700">{post.author.name}</span>
                        </span>
                    </div>
                )}

                {/* Botón */}
                <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center justify-center w-full bg-gradient-to-r from-primary to-primary/80 text-white font-semibold py-3 px-6 rounded-xl hover:from-secondary hover:to-yellow-400 hover:text-primary transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                >
                    {locale === 'en' ? 'Read More' : 'Leer Más'}
                    <svg
                        className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                    </svg>
                </Link>
            </div>
        </article>
    );
}
