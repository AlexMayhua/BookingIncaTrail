import { useRouter } from "next/router";
import parser from 'html-react-parser';
import Error from "next/error";
import Image from "next/image";
import Link from "next/link";
import { NextSeo } from "next-seo";
import { BRAND, absoluteUrl } from '../../lib/brandConfig';
import { getPostBySlug, getRelatedPosts, checkWordPressConnection } from '../../lib/wordpress';
import { API_URL } from "../../lib/constants";
import BlogCard from '../../components/general/BlogCard';

export default function SingleBlog({ singleBlog, relatedPosts, error }) {
  const router = useRouter();
  const { locale } = router;

  if (error && error.statusCode) {
    return <Error statusCode={error.statusCode} title={error.statusText} />;
  }

  if (!singleBlog) {
    return <Error statusCode={404} title="Post not found" />;
  }

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

  // Obtener imagen
  const imageUrl = singleBlog.image?.[0]?.url || '/general/hero/mapi-home.jpg';
  const imageAlt = singleBlog.image?.[0]?.alt || singleBlog.title;

  return (
    <>
      <NextSeo
        title={singleBlog.meta_title}
        description={singleBlog.meta_description}
        canonical={absoluteUrl(`/blog/${singleBlog.slug}`)}
        openGraph={{
          url: absoluteUrl(`/blog/${singleBlog.slug}`),
          title: singleBlog.meta_title,
          description: singleBlog.meta_description,
          type: 'article',
          article: {
            publishedTime: singleBlog.date,
            modifiedTime: singleBlog.modified,
            authors: singleBlog.author ? [singleBlog.author.name] : [],
          },
          images: [
            {
              url: imageUrl,
              width: 1600,
              height: 620,
              type: 'image/jpeg',
            }
          ],
          site_name: BRAND.name
        }}
      />

      {/* Hero con imagen de fondo */}
      <section className="relative h-[60vh] min-h-[400px] max-h-[600px]">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          priority
          className="object-cover"
        />
        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Contenido del hero */}
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="container mx-auto px-4 pb-12">
            {/* Breadcrumb */}
            <nav className="mb-6">
              <ol className="flex items-center text-white/80 text-sm">
                <li>
                  <Link href="/" className="hover:text-secondary transition-colors">
                    {locale === 'en' ? 'Home' : 'Inicio'}
                  </Link>
                </li>
                <li className="mx-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-secondary transition-colors">
                    Blog
                  </Link>
                </li>
                <li className="mx-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </li>
                <li className="text-secondary font-medium truncate max-w-xs">
                  {singleBlog.title}
                </li>
              </ol>
            </nav>

            {/* Categorías */}
            {singleBlog.categories && singleBlog.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {singleBlog.categories.map((cat) => (
                  <span
                    key={cat.id}
                    className="bg-secondary text-primary text-xs font-bold px-3 py-1 rounded-full"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            )}

            {/* Título */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight max-w-4xl drop-shadow-lg">
              {singleBlog.title}
            </h1>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-white/80">
              {singleBlog.date && (
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formatDate(singleBlog.date)}</span>
                </div>
              )}
              {singleBlog.author && (
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{singleBlog.author.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contenido del artículo */}
      <article className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Resumen/Extracto */}
            {singleBlog.min_content && (
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-8 pb-8 border-b border-gray-200 font-light">
                {singleBlog.min_content}
              </p>
            )}

            {/* Contenido principal */}
            <div className="prose prose-lg lg:prose-xl max-w-none prose-headings:text-primary prose-headings:font-bold prose-a:text-primary hover:prose-a:text-secondary prose-img:rounded-xl prose-img:shadow-lg">
              {singleBlog.content && parser(singleBlog.content)}
              {singleBlog.content_optional && parser(singleBlog.content_optional)}
            </div>

            {/* Compartir */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {locale === 'en' ? 'Share this article' : 'Compartir este artículo'}
              </h3>
              <div className="flex gap-3">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(absoluteUrl(`/blog/${singleBlog.slug}`))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                  </svg>
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(absoluteUrl(`/blog/${singleBlog.slug}`))}&text=${encodeURIComponent(singleBlog.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(singleBlog.title + ' ' + absoluteUrl(`/blog/${singleBlog.slug}`))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Posts relacionados */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              {locale === 'en' ? 'Related Articles' : 'Artículos Relacionados'}
            </h2>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {relatedPosts.map((post) => (
                <BlogCard key={post._id || post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {locale === 'en' ? 'Explore more of our blog' : 'Explora más de nuestro blog'}
          </h2>
          <Link
            href="/blog"
            className="inline-flex items-center bg-secondary text-primary font-bold py-4 px-8 rounded-xl hover:bg-yellow-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 mt-4"
          >
            {locale === 'en' ? 'View all articles' : 'Ver todos los artículos'}
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}

export async function getServerSideProps({ params: { slug }, locale }) {
  let singleBlog = null;
  let relatedPosts = [];

  try {
    // Intentar obtener de WordPress primero
    const wpConnected = await checkWordPressConnection();

    if (wpConnected) {
      singleBlog = await getPostBySlug(slug);

      // Obtener posts relacionados si hay categorías
      if (singleBlog && singleBlog.categories && singleBlog.categories.length > 0) {
        const categoryIds = singleBlog.categories.map(c => c.id);
        relatedPosts = await getRelatedPosts(singleBlog._id, categoryIds, 3);
      }
    }

    // Fallback a MongoDB si no se encuentra en WordPress
    if (!singleBlog) {
      try {
        const res = await fetch(`${API_URL}/api/blog/${slug}?locale=${locale}`);
        if (res.ok) {
          singleBlog = await res.json();
        }
      } catch (mongoError) {
        // MongoDB no disponible
      }
    }

    // Si no se encontró el post
    if (!singleBlog) {
      return {
        props: {
          error: {
            statusCode: 404,
            statusText: "Post not found"
          }
        }
      };
    }

    return {
      props: {
        singleBlog,
        relatedPosts
      }
    };

  } catch (error) {
    console.error('Error fetching blog post:', error);
    return {
      props: {
        error: {
          statusCode: 500,
          statusText: "Error loading post"
        }
      }
    };
  }
}