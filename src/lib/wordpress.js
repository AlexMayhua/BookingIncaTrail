/**
 * WordPress Headless API Client
 * Conecta la aplicacion Next.js con WordPress como CMS
 */

// URL base de WordPress (Docker local o produccion)
const WP_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost:8080';

// Flag para usar ruta alternativa (cuando no hay pretty permalinks)
let useAlternativeRoute = null;

/**
 * Construye la URL de la API de WordPress
 * Intenta primero con /wp-json/, si falla usa ?rest_route=
 * @param {string} endpoint - El endpoint (ej: /wp/v2/posts)
 * @param {Object} params - Parámetros de query
 * @returns {Promise<string>} URL completa
 */
async function buildApiUrl(endpoint, params = {}) {
  // Si ya sabemos qué ruta usar
  if (useAlternativeRoute !== null) {
    return useAlternativeRoute
      ? `${WP_API_URL}/?rest_route=${endpoint}&${new URLSearchParams(params).toString()}`
      : `${WP_API_URL}/wp-json${endpoint}?${new URLSearchParams(params).toString()}`;
  }

  // Detectar qué ruta funciona (solo la primera vez)
  try {
    const testRes = await fetch(`${WP_API_URL}/wp-json/`, { method: 'HEAD' });
    if (testRes.ok) {
      useAlternativeRoute = false;
      return `${WP_API_URL}/wp-json${endpoint}?${new URLSearchParams(params).toString()}`;
    }
  } catch (e) {
    // /wp-json/ no funciona
  }

  // Usar ruta alternativa
  useAlternativeRoute = true;
  return `${WP_API_URL}/?rest_route=${endpoint}&${new URLSearchParams(params).toString()}`;
}

/**
 * Obtener todos los posts del blog
 * @param {Object} options - Opciones de consulta
 * @param {string} options.locale - Idioma (es/en)
 * @param {number} options.perPage - Posts por pagina
 * @param {number} options.page - Numero de pagina
 * @param {string} options.search - Termino de busqueda
 * @param {number} options.categoryId - ID de categoria
 * @returns {Promise<Array>} Lista de posts
 */
export async function getPosts({
  locale = 'es',
  perPage = 10,
  page = 1,
  search = '',
  categoryId = null
} = {}) {
  try {
    const params = {
      _embed: '1',
      per_page: perPage,
      page: page
    };

    if (search) {
      params.search = search;
    }

    if (categoryId) {
      params.categories = categoryId;
    }

    const url = await buildApiUrl('/wp/v2/posts', params);

    const res = await fetch(url, {
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      console.error('[WordPress] API error:', res.status, res.statusText);
      return [];
    }

    const posts = await res.json();

    return posts.map(post => transformPost(post));
  } catch (error) {
    console.error('[WordPress] Error fetching posts:', error.message);
    return [];
  }
}

/**
 * Obtener un post individual por slug
 * @param {string} slug - Slug del post
 * @returns {Promise<Object|null>} Post o null si no existe
 */
export async function getPostBySlug(slug) {
  try {
    const url = await buildApiUrl('/wp/v2/posts', {
      _embed: '1',
      slug: slug
    });

    const res = await fetch(url, {
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      return null;
    }

    const posts = await res.json();

    if (posts.length === 0) {
      return null;
    }

    return transformPost(posts[0], true);
  } catch (error) {
    console.error('[WordPress] Error fetching post by slug:', error.message);
    return null;
  }
}

/**
 * Obtener categorias de WordPress
 * @returns {Promise<Array>} Lista de categorias
 */
export async function getCategories() {
  try {
    const url = await buildApiUrl('/wp/v2/categories', {});

    const res = await fetch(url, {
      next: { revalidate: 300 }
    });

    if (!res.ok) {
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error('[WordPress] Error fetching categories:', error.message);
    return [];
  }
}

/**
 * Obtener posts relacionados
 * @param {number} postId - ID del post actual
 * @param {Array} categoryIds - IDs de categorias del post
 * @param {number} limit - Numero de posts a retornar
 * @returns {Promise<Array>} Lista de posts relacionados
 */
export async function getRelatedPosts(postId, categoryIds = [], limit = 3) {
  try {
    if (categoryIds.length === 0) {
      return [];
    }

    const url = await buildApiUrl('/wp/v2/posts', {
      _embed: '1',
      categories: categoryIds.join(','),
      per_page: limit + 1,
      exclude: postId
    });

    const res = await fetch(url, {
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      return [];
    }

    const posts = await res.json();
    return posts.slice(0, limit).map(post => transformPost(post));
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

/**
 * Transformar post de WordPress a formato compatible
 * @param {Object} wpPost - Post de WordPress
 * @param {boolean} full - Si incluir contenido completo
 * @returns {Object} Post transformado
 */
function transformPost(wpPost, full = false) {
  const featuredMedia = wpPost._embedded && wpPost._embedded['wp:featuredmedia'] && wpPost._embedded['wp:featuredmedia'][0];
  const imageUrl = featuredMedia ? featuredMedia.source_url : '/general/hero/mapi-home.jpg';
  const imageAlt = featuredMedia ? (featuredMedia.alt_text || wpPost.title.rendered) : wpPost.title.rendered;

  const author = wpPost._embedded && wpPost._embedded.author && wpPost._embedded.author[0];

  const categories = (wpPost._embedded && wpPost._embedded['wp:term'] && wpPost._embedded['wp:term'][0]) || [];

  const transformed = {
    _id: wpPost.id.toString(),
    title: decodeHtmlEntities(wpPost.title.rendered),
    slug: wpPost.slug,
    min_content: decodeHtmlEntities(stripHtml(wpPost.excerpt.rendered).substring(0, 200)),
    meta_title: decodeHtmlEntities(wpPost.title.rendered),
    meta_description: decodeHtmlEntities(stripHtml(wpPost.excerpt.rendered).substring(0, 160)),
    image: [{
      url: imageUrl,
      alt: imageAlt
    }],
    date: wpPost.date,
    modified: wpPost.modified,
    author: author ? {
      name: author.name,
      avatar: author.avatar_urls && author.avatar_urls['48'] ? author.avatar_urls['48'] : null
    } : null,
    categories: categories.map(function (cat) {
      return {
        id: cat.id,
        name: cat.name,
        slug: cat.slug
      };
    }),
    excerpt: decodeHtmlEntities(wpPost.excerpt.rendered),
  };

  if (full) {
    transformed.content = wpPost.content.rendered;
    transformed.content_optional = '';
  }

  return transformed;
}

/**
 * Decodificar entidades HTML
 */
function decodeHtmlEntities(text) {
  if (!text) return '';
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8211;/g, '-')
    .replace(/&#8212;/g, '--')
    .replace(/&#8216;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"');
}

/**
 * Eliminar tags HTML
 */
function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Verificar conexion con WordPress
 * @returns {Promise<boolean>} true si esta conectado
 */
export async function checkWordPressConnection() {
  try {
    // Intentar primero con /wp-json/
    let res = await fetch(WP_API_URL + '/wp-json/', {
      method: 'HEAD'
    });

    if (res.ok) {
      return true;
    }

    // Intentar con ruta alternativa
    res = await fetch(WP_API_URL + '/?rest_route=/', {
      method: 'HEAD'
    });

    return res.ok;
  } catch (e) {
    console.error('[WordPress] Connection error:', e.message);
    return false;
  }
}

// Exportar URL de WordPress para uso externo
export var WORDPRESS_URL = WP_API_URL;
