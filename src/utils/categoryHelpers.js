/**
 * Utilidades para manejo de categorías
 * Funciones que pueden ser usadas tanto en el cliente como en el servidor
 *
 * ACTUALIZADO: Enero 2026 - Nueva estructura SEO-optimizada
 * - Eliminada: alternative-tours
 * - Agregadas: choquequirao, sacred-lakes, luxury-glamping, family-tours, sustainable-tours
 */

// Función para obtener la descripción de una categoría
export const getCategoryDescription = (category, locale = 'es') => {
  const descriptionsES = {
    'inca-trail': 'Descubre el famoso Camino Inca hacia Machu Picchu con nuestros tours guiados. La ruta de trekking más icónica de Sudamérica con permisos limitados.',
    'salkantay': 'Aventúrate en el espectacular trek de Salkantay, una alternativa al Camino Inca. Paisajes glaciares impresionantes y naturaleza virgen.',
    'machupicchu': 'Explora la maravilla del mundo Machu Picchu con nuestros tours especializados. Tours en tren, bus o caminata desde Cusco.',
    'choquequirao': 'Descubre la ciudad hermana de Machu Picchu. Trek exclusivo a Choquequirao, el sitio arqueológico más remoto y menos visitado de Perú. Aventura para exploradores que buscan escapar de las multitudes.',
    'rainbow-mountain': 'Visita la impresionante Montaña de Colores en nuestros tours especializados. Vinicunca, el fenómeno natural más fotografiado de Perú.',
    'ausangate': 'Explora el majestuoso nevado Ausangate en este desafiante trek. Montaña sagrada de los Andes con lagunas de colores y comunidades tradicionales.',
    'inca-jungle': 'Combina aventura y cultura en el emocionante Inca Jungle Trek hacia Machu Picchu. Ciclismo, rafting, tirolesa y trekking en un solo tour.',
    'sacred-lakes': 'Explora las místicas lagunas sagradas de los Andes. Aguas turquesas de altura rodeadas de imponentes nevados y paisajes de ensueño. Humantay, Laguna 69 y más.',
    'day-tours': 'Tours de un día perfectos para explorar los principales atractivos de Cusco. Valle Sagrado, Salineras de Maras, Moray, ruinas arqueológicas y más.',
    'peru-packages': 'Paquetes turísticos completos para descubrir lo mejor del Perú. Combina Cusco, Lima, Arequipa, Puno y la selva amazónica en un solo viaje.',
    'luxury-glamping': 'Experimenta el trekking con lujo 5 estrellas. Glamping exclusivo en el Camino Inca y Salkantay con tiendas espaciosas, duchas calientes, spa y cocina gourmet. Aventura sin sacrificar comodidad.',
    'family-tours': 'Paquetes diseñados para familias multi-generacionales. Tours a Machu Picchu y Valle Sagrado adaptados para niños y adultos mayores. Ritmo pausado, actividades interactivas y experiencias educativas.',
    'sustainable-tours': 'Turismo responsable y sostenible en Perú. Tours carbon-neutral, experiencias comunitarias, y trekking eco-consciente. Viaja con propósito y apoya comunidades locales.'
  };

  const descriptionsEN = {
    'inca-trail': 'Discover the famous Inca Trail to Machu Picchu with our guided tours. The most iconic trekking route in South America with limited permits.',
    'salkantay': 'Venture into the spectacular Salkantay Trek, an alternative to the Inca Trail. Stunning glacial landscapes and pristine nature.',
    'machupicchu': 'Explore the wonder of the world Machu Picchu with our specialized tours. Train, bus, or hiking tours from Cusco.',
    'choquequirao': 'Discover the sister city of Machu Picchu. Exclusive trek to Choquequirao, Peru\'s most remote and least visited archaeological site. Adventure for explorers seeking to escape the crowds.',
    'rainbow-mountain': 'Visit the impressive Rainbow Mountain on our specialized tours. Vinicunca, Peru\'s most photographed natural phenomenon.',
    'ausangate': 'Explore the majestic Ausangate snow-capped mountain on this challenging trek. Sacred Andean mountain with colorful lakes and traditional communities.',
    'inca-jungle': 'Combine adventure and culture on the exciting Inca Jungle Trek to Machu Picchu. Biking, rafting, zip-lining, and trekking in one tour.',
    'sacred-lakes': 'Explore the mystical sacred lakes of the Andes. Turquoise high-altitude waters surrounded by imposing snow-capped peaks and dreamlike landscapes. Humantay, Laguna 69, and more.',
    'day-tours': 'Perfect day tours to explore the main attractions of Cusco. Sacred Valley, Maras Salt Mines, Moray, archaeological ruins, and more.',
    'peru-packages': 'Complete tour packages to discover the best of Peru. Combine Cusco, Lima, Arequipa, Puno, and the Amazon rainforest in one trip.',
    'luxury-glamping': 'Experience trekking with 5-star luxury. Exclusive glamping on the Inca Trail and Salkantay with spacious tents, hot showers, spa services, and gourmet cuisine. Adventure without sacrificing comfort.',
    'family-tours': 'Packages designed for multi-generational families. Machu Picchu and Sacred Valley tours adapted for kids and seniors. Slow pacing, interactive activities, and educational experiences.',
    'sustainable-tours': 'Responsible and sustainable tourism in Peru. Carbon-neutral tours, community-based experiences, and eco-conscious trekking. Travel with purpose and support local communities.'
  };

  const descriptions = locale === 'en' ? descriptionsEN : descriptionsES;
  return descriptions[category] || `Descubre los mejores tours de ${category.replace('-', ' ')} con BookingIncatrail.`;
};

// Función para obtener el título de una categoría
export const getCategoryTitle = (category, locale = 'es') => {
  const titlesES = {
    'inca-trail': 'Camino Inca',
    'salkantay': 'Salkantay Trek',
    'machupicchu': 'Tours a Machu Picchu',
    'choquequirao': 'Choquequirao Trek',
    'rainbow-mountain': 'Montaña de Colores',
    'ausangate': 'Ausangate Trek',
    'inca-jungle': 'Inca Jungle Trek',
    'sacred-lakes': 'Lagunas Sagradas',
    'day-tours': 'Tours de un Día',
    'peru-packages': 'Paquetes Turísticos Perú',
    'luxury-glamping': 'Glamping de Lujo',
    'family-tours': 'Tours Familiares',
    'sustainable-tours': 'Turismo Sostenible'
  };

  const titlesEN = {
    'inca-trail': 'Inca Trail',
    'salkantay': 'Salkantay Trek',
    'machupicchu': 'Machu Picchu Tours',
    'choquequirao': 'Choquequirao Trek',
    'rainbow-mountain': 'Rainbow Mountain',
    'ausangate': 'Ausangate Trek',
    'inca-jungle': 'Inca Jungle Trek',
    'sacred-lakes': 'Sacred Lakes',
    'day-tours': 'Day Tours',
    'peru-packages': 'Peru Packages',
    'luxury-glamping': 'Luxury Glamping',
    'family-tours': 'Family Tours',
    'sustainable-tours': 'Sustainable Tours'
  };

  const titles = locale === 'en' ? titlesEN : titlesES;
  return titles[category] || category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
};

// Función para obtener la imagen de una categoría (usando imágenes existentes del proyecto)
export const getCategoryImagePath = (category) => {
  const images = {
    'inca-trail': '/img/hero/hero-slider-inca-trail.webp',
    'salkantay': '/img/hero/hero-slider-3.jpg',
    'machupicchu': '/img/hero/hero-machu-picchu.webp',
    'choquequirao': '/img/hero/hero-slider-4.jpg', // Usando imagen de montañas similar
    'rainbow-mountain': '/img/hero/hero-slider-5-min.webp',
    'ausangate': '/img/hero/hero-slider-4.jpg',
    'inca-jungle': '/img/hero/hero-slider-inca-jungle.webp',
    'sacred-lakes': '/img/hero/hero-slider-humantay.webp', // ✅ Laguna Humantay
    'day-tours': '/img/hero/hero-salineras-de-maras.webp',
    'peru-packages': '/home/peru-trips.jpeg',
    'luxury-glamping': '/img/hero/hero-slider-3.jpg', // Placeholder: paisaje montañoso
    'family-tours': '/img/hero/hero-machu-picchu.webp', // Placeholder: Machu Picchu (familiar)
    'sustainable-tours': '/img/hero/hero-slider-2.jpg' // Placeholder: naturaleza andina
  };
  return images[category] || '/img/hero/hero-machu-picchu.webp';
};

// Función para obtener metadatos completos de una categoría
export const getCategoryMetadata = (category) => {
  return {
    title: getCategoryTitle(category),
    description: getCategoryDescription(category),
    image: getCategoryImagePath(category)
  };
};