/**
 * Utilidades para manejo de imágenes optimizadas
 */

// Mapeo de imágenes por categoría
export const categoryImages = {
  'inca-trail': {
    hero: '/img/hero/hero-slider-inca-trail.webp',
    card: '/assets/card/card1IncaTrailClassic.webp',
    navbar: '/img/navbar/inca-trail-2023.webp',
    fallback: '/img/hero/hero-slider-inca-trail.webp'
  },
  'salkantay': {
    hero: '/img/hero/hero-slider-3.jpg',
    card: '/assets/card/Card3Salkantay_Trek.webp',
    navbar: '/img/navbar/salkantay-trek.jpg',
    fallback: '/assets/card/salkantay-card-min.jpg'
  },
  'machupicchu': {
    hero: '/img/hero/hero-machu-picchu.webp',
    card: '/assets/card/Card2Adventure_to_Machu_Picchu.webp',
    navbar: '/img/navbar/machu-picchu.jpeg',
    fallback: '/home/machu-picchu.jpeg'
  },
  'cusco': {
    hero: '/img/hero/hero-slider-2.jpg',
    card: '/assets/card/card6-cusco_city_tour.webp',
    navbar: '/img/navbar/cusco-tours.jpg',
    fallback: '/home/cusco-trips.jpeg'
  },
  'day-tours': {
    hero: '/img/hero/hero-salineras-de-maras.webp',
    card: '/assets/card/card6-cusco_city_tour.webp',
    navbar: '/img/navbar/cusco.jpeg',
    fallback: '/img/hero/hero-slider-4.jpg'
  },
  'peru-packages': {
    hero: '/home/peru-trips.jpeg',
    card: '/assets/card/Card2Adventure_to_Machu_Picchu.webp',
    navbar: '/img/navbar/Machu-Picchu-post.jpg',
    fallback: '/home/bg25.webp'
  },
  'rainbow-mountain': {
    hero: '/img/hero/hero-slider-5-min.webp',
    card: '/assets/card/Card5Humantay_lake.webp',
    navbar: '/img/navbar/raimbow-mountain.jpg',
    fallback: '/img/navbar/rainbow-montain-&-red-valley.jpg'
  },
  'ausangate': {
    hero: '/img/hero/hero-slider-4.jpg',
    card: '/assets/card/choquequirao-card-min.jpg',
    navbar: '/img/navbar/ausangate-trek.jpeg',
    fallback: '/img/hero/hero-slider-3.jpg'
  },
  'alternative-tours': {
    hero: '/img/hero/hero-slider-humantay.webp',
    card: '/assets/card/Card5Humantay_lake.webp',
    navbar: '/img/navbar/cusco-tours.jpg',
    fallback: '/img/hero/1.webp'
  },
  'inca-jungle': {
    hero: '/img/hero/hero-slider-inca-jungle.webp',
    card: '/assets/card/card4Shotincatrail.webp',
    navbar: '/img/navbar/inca-jungle.jpg',
    fallback: '/img/hero/hero-slider-inca-jungle.webp'
  }
};

// Imágenes por defecto
export const defaultImages = {
  hero: '/img/hero/hero-machu-picchu.webp',
  card: '/assets/card/Card2Adventure_to_Machu_Picchu.webp',
  navbar: '/img/navbar/machu-picchu.jpeg',
  fallback: '/home/hero.jpg'
};

/**
 * Obtiene la imagen de una categoría específica
 * @param {string} category - Nombre de la categoría
 * @param {string} type - Tipo de imagen (hero, card, navbar, fallback)
 * @returns {string} URL de la imagen
 */
export const getCategoryImage = (category, type = 'hero') => {
  const categoryData = categoryImages[category];
  
  if (categoryData && categoryData[type]) {
    return categoryData[type];
  }
  
  // Fallback a imagen por defecto
  return defaultImages[type] || defaultImages.fallback;
};

/**
 * Genera srcSet para imágenes responsivas
 * @param {string} imagePath - Ruta base de la imagen
 * @returns {object} Objeto con src y srcSet
 */
export const generateResponsiveImage = (imagePath) => {
  // Para imágenes WebP, generar diferentes tamaños
  if (imagePath.includes('.webp')) {
    return {
      src: imagePath,
      srcSet: `${imagePath} 1x, ${imagePath} 2x`,
      loading: 'lazy'
    };
  }
  
  // Para otras imágenes, usar tal como están
  return {
    src: imagePath,
    loading: 'lazy'
  };
};

/**
 * Optimiza la carga de imágenes con lazy loading
 * @param {string} src - URL de la imagen
 * @param {string} alt - Texto alternativo
 * @param {string} className - Clases CSS
 * @returns {object} Props para el componente Image
 */
export const getOptimizedImageProps = (src, alt, className = '') => {
  return {
    src,
    alt,
    className,
    loading: 'lazy',
    decoding: 'async',
    onError: (e) => {
      // Fallback en caso de error
      e.target.src = defaultImages.fallback;
    }
  };
};

/**
 * Preload de imágenes críticas
 * @param {string[]} imagePaths - Array de rutas de imágenes
 */
export const preloadImages = (imagePaths) => {
  if (typeof window !== 'undefined') {
    imagePaths.forEach(path => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = path;
      document.head.appendChild(link);
    });
  }
};

/**
 * Obtiene todas las imágenes de una categoría para preload
 * @param {string} category - Nombre de la categoría
 * @returns {string[]} Array de URLs de imágenes
 */
export const getCategoryImagesForPreload = (category) => {
  const categoryData = categoryImages[category];
  
  if (categoryData) {
    return [categoryData.hero, categoryData.card].filter(Boolean);
  }
  
  return [defaultImages.hero];
};

/**
 * Valida si una imagen existe
 * @param {string} imagePath - Ruta de la imagen
 * @returns {Promise<boolean>} Promise que resuelve true si la imagen existe
 */
export const imageExists = (imagePath) => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(true); // En servidor, asumir que existe
      return;
    }
    
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imagePath;
  });
};

/**
 * Genera metadatos de imagen para SEO
 * @param {string} category - Nombre de la categoría
 * @param {string} categoryTitle - Título de la categoría
 * @returns {object} Metadatos de imagen
 */
export const getCategoryImageMetadata = (category, categoryTitle) => {
  const heroImage = getCategoryImage(category, 'hero');
  
  return {
    url: heroImage,
    width: 1200,
    height: 630,
    alt: `${categoryTitle} - Tours y Servicios | BookingIncatrail`,
    type: 'image/webp'
  };
};