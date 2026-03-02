import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import en from '../../lang/en/blog';
import es from '../../lang/es/blog';
import { BRAND, absoluteUrl } from '../../lib/brandConfig';
import { getPosts, checkWordPressConnection } from '../../lib/wordpress';
import { API_URL } from '../../lib/constants';
import BlogCardTour from '../../components/general/BlogCardTour';
import Link from 'next/link';
import Section1 from '../../components/home/Section1';
import Section6 from '../../components/home/Section6';
import Section9 from '../../components/home/Section9';
import TourSlider from '../../components/Slider';

export default function Blog({ blogs, source, topTreks = [] }) {
    const router = useRouter();
    const { locale } = router;
    const t = locale === 'en' ? en : es;

    // Traducciones para el slider
    const sliderT = {
        from: locale === 'en' ? 'From' : 'Desde',
        btn_viewtrip: locale === 'en' ? 'View Tour' : 'Ver Tour'
    };

    return (
        <>
            <NextSeo
                title={t.meta_title}
                description={t.meta_description}
                canonical={absoluteUrl('/blog')}
                openGraph={{
                    url: absoluteUrl('/blog'),
                    title: t.meta_title,
                    description: t.meta_description,
                    images: [
                        {
                            url: '/general/hero/mapi-home.jpg',
                            width: 1400,
                            height: 465,
                            type: 'image/jpg',
                        }
                    ],
                    site_name: BRAND.name
                }}
            />

            {/* Hero Section - Estilo consistente con categorías */}
            <section className="category-hero-section relative min-h-[400px] md:min-h-[450px] flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url('/general/hero/mapi-home.jpg')`,
                    }}
                />

                {/* Overlay con gradiente */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

                {/* Patrón decorativo */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-40 h-40 border-4 border-white rounded-full" />
                    <div className="absolute bottom-10 right-10 w-60 h-60 border-4 border-white rounded-full" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-2 border-white rounded-full" />
                </div>

                {/* Contenido del Hero */}
                <div className="container mx-auto px-4 relative z-10 text-center py-16">
                    {/* Breadcrumb */}
                    <nav className="flex items-center justify-center text-white/80 text-sm mb-6">
                        <Link href="/" className="hover:text-secondary transition-colors">
                            {locale === 'en' ? 'Home' : 'Inicio'}
                        </Link>
                        <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-secondary font-medium">Blog</span>
                    </nav>

                    {/* Badge */}
                    <div className="inline-flex items-center bg-secondary/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                        <svg className="w-5 h-5 text-secondary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                        <span className="text-white font-medium text-sm">
                            {locale === 'en' ? 'Travel Guides & Stories' : 'Guías y Historias de Viaje'}
                        </span>
                    </div>

                    {/* Título */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 drop-shadow-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {locale === 'en' ? 'Travel Blog' : 'Blog de Viajes'}
                    </h1>

                    {/* Descripción */}
                    <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                        {locale === 'en'
                            ? 'Discover tips, guides and travel stories about Peru, Machu Picchu and the Inca Trail'
                            : 'Descubre consejos, guías e historias de viaje sobre Perú, Machu Picchu y el Camino Inca'
                        }
                    </p>

                    {/* Stats compactos */}
                    <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
                        <div className="flex items-center text-white/90">
                            <svg className="w-5 h-5 text-secondary mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                            </svg>
                            <span className="font-semibold">{blogs?.length || 0}</span>
                            <span className="ml-1">{locale === 'en' ? 'Articles' : 'Artículos'}</span>
                        </div>
                        <div className="w-px h-5 bg-white/30 hidden sm:block" />
                        <div className="flex items-center text-white/90">
                            <svg className="w-5 h-5 text-secondary mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            <span className="font-semibold">5K+</span>
                            <span className="ml-1">{locale === 'en' ? 'Readers' : 'Lectores'}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Blog Grid Section - Usando estilos de Tours */}
            <section className="py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
                <div className="2xl:container mx-auto">
                    <div className="lg:mx-20 mx-5 md:mx-8">

                        {/* Header de sección - Estilo Home */}
                        <div className="text-center mb-12">
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                                {locale === 'en' ? 'Latest Articles' : 'Últimos Artículos'}
                            </h2>
                            <div className="flex items-center justify-center gap-3">
                                <div className="w-16 h-1 bg-secondary rounded-full"></div>
                                <div className="w-8 h-1 bg-secondary/60 rounded-full"></div>
                                <div className="w-4 h-1 bg-secondary/30 rounded-full"></div>
                            </div>
                        </div>

                        {blogs && blogs.length > 0 ? (
                            <>
                                {/* Grid de blogs - Usando clase blog-grid de tours.css */}
                                <div className="blog-grid">
                                    {blogs.map((post) => (
                                        <BlogCardTour key={post._id || post.slug} post={post} />
                                    ))}
                                </div>
                            </>
                        ) : (
                            /* Estado vacío premium */
                            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full mb-6">
                                    <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-700 mb-3">
                                    {locale === 'en' ? 'No articles yet' : 'Sin artículos aún'}
                                </h2>
                                <p className="text-gray-500 max-w-md mx-auto mb-6">
                                    {locale === 'en'
                                        ? 'We are preparing amazing content for you. Come back soon!'
                                        : '¡Estamos preparando contenido increíble para ti. Vuelve pronto!'
                                    }
                                </p>
                                <Link
                                    href="/inca-trail"
                                    className="inline-flex items-center bg-primary text-white font-semibold py-3 px-6 rounded-xl hover:bg-primary/90 transition-all"
                                >
                                    {locale === 'en' ? 'Explore Tours' : 'Explorar Tours'}
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Sección de Tours - Estilo Home "Listos para explorar" */}
            {topTreks && topTreks.length > 0 && (
                <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50">
                    <div className="2xl:container mx-auto">
                        <div className="lg:mx-20 mx-5 md:mx-8">
                            {/* Header estilo Home */}
                            <div className="text-center mb-8 md:mb-12">
                                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-primary inline-block mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    {locale === 'en' ? 'Ready to Explore?' : '¿Listo para Explorar?'}
                                </h2>
                                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                    {locale === 'en'
                                        ? 'Discover our most popular tours and start planning your adventure'
                                        : 'Descubre nuestros tours más populares y comienza a planear tu aventura'
                                    }
                                </p>
                                <div className="flex items-center justify-center gap-3 mt-6">
                                    <div className="w-16 h-1 bg-secondary rounded-full"></div>
                                    <div className="w-8 h-1 bg-secondary/60 rounded-full"></div>
                                    <div className="w-4 h-1 bg-secondary/30 rounded-full"></div>
                                </div>
                            </div>

                            {/* Slider de tours - mismo que Home */}
                            <TourSlider tours={topTreks} t={sliderT} />

                            {/* CTA Ver todos */}
                            <div className="flex justify-center mt-10">
                                <Link
                                    href="/inca-trail"
                                    className="view-all-btn"
                                >
                                    {locale === 'en' ? 'View All Tours' : 'Ver Todos los Tours'}
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Secciones reutilizables del Home - Consistencia visual */}
            <div className="2xl:container mx-auto">
                <div className="lg:mx-20 mx-5 md:mx-8">
                    {/* Testimonios */}
                    <Section6 />

                    {/* Por qué elegirnos */}
                    <Section1 />

                    {/* Estadísticas */}
                    <Section9 />
                </div>
            </div>
        </>
    );
}

export async function getServerSideProps({ locale }) {
    let blogs = [];
    let source = 'none';
    let topTreks = [];

    try {
        // Intentar obtener posts de WordPress primero
        const wpConnected = await checkWordPressConnection();

        if (wpConnected) {
            blogs = await getPosts({ locale, perPage: 12 });
            source = 'wordpress';
        }

        // Si WordPress no tiene posts o no está conectado, usar MongoDB como fallback
        if (blogs.length === 0) {
            try {
                const res = await fetch(`${API_URL}/api/blog?locale=${locale}`);
                if (res.ok) {
                    const mongoBlogs = await res.json();
                    if (Array.isArray(mongoBlogs) && mongoBlogs.length > 0) {
                        blogs = mongoBlogs;
                        source = 'mongodb';
                    }
                }
            } catch (mongoError) {
                // MongoDB no disponible
            }
        }

        // Obtener tours destacados para la sección "Listos para explorar"
        try {
            const resTrips = await fetch(`${API_URL}/api/trip/?locale=${locale}&isDeals=true&fields=title,slug,gallery,price,from,discount,category,quickstats,duration`);
            if (resTrips.ok) {
                const tripsData = await resTrips.json();
                if (Array.isArray(tripsData)) {
                    topTreks = tripsData;
                }
            }
        } catch (tripError) {
            // Tours no disponibles
        }
    } catch (error) {
        console.error('Error fetching blogs:', error);
    }

    return {
        props: {
            blogs,
            source,
            topTreks
        },
    };
}
