// Configuración centralizada de marca
// NOTA: Modifica las variables de entorno NEXT_PUBLIC_* para cambiar la marca sin tocar el código
// Ej.: NEXT_PUBLIC_BRAND_NAME, NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_CONTACT_EMAIL, etc.

export const BRAND = {
  // Nombre de marca (editable vía env)
  name: process.env.NEXT_PUBLIC_BRAND_NAME || 'BookingIncatrail',

  // Dominio/base URL canónica (editable vía env)
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',

  // Blog público (opcional)
  blogUrl: process.env.NEXT_PUBLIC_BLOG_URL || null,

  // Contacto
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@bookingincatrail.com',
  contactPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+51 984 000 000',

  // Logo (usa un SVG en /public para poder reemplazar fácilmente)
  logo: {
    // Ruta pública del logo (coloca tu SVG definitivo en /public/assets/ y reemplaza este archivo)
    src: '/assets/logo-Booking.svg',
    alt: 'Logo BookingIncatrail',
  },

  // Redes sociales (rellena vía env para que sean reemplazables)
  social: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://facebook.com/bookingincatrail',
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/bookingincatrail',
    tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL || 'https://tiktok.com/@bookingincatrail',
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || 'https://youtube.com/@bookingincatrail',
  },
};

// Utilidades
// Construye una URL absoluta a partir de la base canónica y un path
export function absoluteUrl(path = '/') {
  try {
    const base = BRAND.siteUrl.endsWith('/') ? BRAND.siteUrl.slice(0, -1) : BRAND.siteUrl;
    const rel = path.startsWith('/') ? path : `/${path}`;
    return `${base}${rel}`;
  } catch (e) {
    // En caso de fallo, devolver el path tal cual
    return path;
  }
}

// Devuelve la URL absoluta del logo (útil para JSON-LD)
export function getLogoUrlAbsolute() {
  return absoluteUrl(BRAND.logo.src);
}