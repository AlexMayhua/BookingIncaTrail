/**
 * Cache Busting Helpers
 *
 * Utilidades para evitar problemas de caché en archivos estáticos
 * cuando son reemplazados con el mismo nombre.
 */

// Versión del sitio - Incrementar cuando hagas cambios importantes
const SITE_VERSION = '2.0.0';

/**
 * Agrega un parámetro de versión a una URL para evitar caché
 * @param {string} url - URL del archivo estático
 * @param {boolean} useTimestamp - Si es true, usa timestamp en lugar de versión
 * @returns {string} URL con parámetro de caché
 */
export function addCacheBuster(url, useTimestamp = false) {
  if (!url) return url;

  // No agregar cache buster a URLs externas
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  const separator = url.includes('?') ? '&' : '?';
  const version = useTimestamp ? `v=${Date.now()}` : `v=${SITE_VERSION}`;

  return `${url}${separator}${version}`;
}

/**
 * Obtiene la URL de un video con cache busting
 * @param {string} videoPath - Ruta del video
 * @returns {string} URL del video con cache buster
 */
export function getVideoUrl(videoPath) {
  return addCacheBuster(videoPath, true);
}

/**
 * Obtiene la URL de una imagen con cache busting
 * @param {string} imagePath - Ruta de la imagen
 * @param {boolean} useTimestamp - Usar timestamp para imágenes que cambien frecuentemente
 * @returns {string} URL de la imagen con cache buster
 */
export function getImageUrl(imagePath, useTimestamp = false) {
  return addCacheBuster(imagePath, useTimestamp);
}

/**
 * Obtiene la URL de un archivo PDF con cache busting
 * @param {string} pdfPath - Ruta del PDF
 * @returns {string} URL del PDF con cache buster
 */
export function getPdfUrl(pdfPath) {
  return addCacheBuster(pdfPath, false);
}

/**
 * Precarga una imagen para mejorar rendimiento
 * @param {string} src - URL de la imagen
 * @returns {Promise} Promesa que se resuelve cuando la imagen está cargada
 */
export function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = addCacheBuster(src);
  });
}

/**
 * Precarga múltiples imágenes
 * @param {string[]} sources - Array de URLs de imágenes
 * @returns {Promise} Promesa que se resuelve cuando todas las imágenes están cargadas
 */
export function preloadImages(sources) {
  return Promise.all(sources.map(preloadImage));
}

/**
 * Limpia el caché del navegador para un archivo específico (solo desarrollo)
 * @param {string} url - URL del archivo a limpiar
 */
export function clearFileCache(url) {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // Forzar recarga del archivo
    fetch(url, {
      method: 'GET',
      cache: 'reload'
    }).catch(err => console.warn('Error clearing cache:', err));
  }
}
