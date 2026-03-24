export const FILTER_CATEGORIES = [
  {
    key: 'inca-trail',
    labelEn: 'Inca Trail',
    labelEs: 'Camino Inca',
    descriptionEn: 'Classic Inca routes and Machu Picchu-focused experiences.',
    descriptionEs:
      'Rutas clasicas de Camino Inca y experiencias enfocadas en Machu Picchu.',
    matchTerms: ['inca-trail'],
  },
  {
    key: 'mountain-treks',
    labelEn: 'Mountain Treks',
    labelEs: 'Trekking de Montaña',
    descriptionEn:
      'Salkantay, Choquequirao, Rainbow Mountain, Ausangate, and Inca Jungle routes.',
    descriptionEs:
      'Rutas de Salkantay, Montana de Colores, Ausangate e Inca Jungle.',
    matchTerms: [
      'salkantay',
      'rainbow-mountain',
      'ausangate',
      'inca-jungle',
    ],
  },
  {
    key: 'day-tours',
    labelEn: 'Day Tours',
    labelEs: 'Tours de un Dia',
    descriptionEn:
      'Flexible one-day experiences including Sacred Lakes and nearby highlights.',
    descriptionEs:
      'Experiencias de un dia, incluyendo Lagos Sagrados y atractivos cercanos.',
    matchTerms: [
      'day-tours',
      'sacred-lakes',
    ],
  },
  {
    key: 'peru-packages',
    labelEn: 'Peru Packages',
    labelEs: 'Paquetes Peru',
    descriptionEn:
      'Multi-day package combinations across Peru in one itinerary.',
    descriptionEs:
      'Combinaciones de varios dias por Peru en un solo itinerario.',
    matchTerms: ['peru-packages', 'machupicchu'],
  },
  {
    key: 'others',
    labelEn: 'Other Experiences',
    labelEs: 'Otras Experiencias',
    descriptionEn: 'Tours and routes not included in the main category groups.',
    descriptionEs: 'Tours y rutas que no entran en los grupos principales.',
    matchTerms: [],
  },
];

export const SAMPLE_TOURS = [
  {
    _id: '1',
    slug: 'short-inca-trail',
    title: 'Camino Inca Corto',
    category: 'inca-trail',
    duration: '2 Dias / 1 Noche',
    price: 420,
    discount: 0,
    gallery: [
      { url: '/img/hero/hero-machu-picchu.webp', alt: 'Camino Inca Corto' },
    ],
    quickstats: [{ content: 'Aventura y Naturaleza' }],
  },
  {
    _id: '2',
    slug: 'classic-inca-trail',
    title: 'Classic Inca Trail',
    category: 'inca-trail',
    duration: '4 Days / 3 Nights',
    price: 690,
    discount: 10,
    gallery: [
      {
        url: '/img/hero/hero-slider-inca-trail.webp',
        alt: 'Classic Inca Trail',
      },
    ],
    quickstats: [{ content: 'Permits Included' }],
  },
  {
    _id: '3',
    slug: 'salkantay-trek-5-days',
    title: 'Salkantay Trek 5 Days',
    category: 'salkantay-trek',
    duration: '5 Days / 4 Nights',
    price: 650,
    discount: 10,
    gallery: [
      { url: '/img/hero/hero-slider-3.jpg', alt: 'Salkantay Trek 5 Days' },
    ],
    quickstats: [{ content: 'High Mountain Trek' }],
  },
  {
    _id: '4',
    slug: 'ausangate-trek-4-days',
    title: 'Ausangate Trek 4 Days',
    category: 'ausangate',
    duration: '4 Days / 3 Nights',
    price: 620,
    discount: 0,
    gallery: [
      { url: '/img/hero/hero-slider-4.jpg', alt: 'Ausangate Trek 4 Days' },
    ],
    quickstats: [{ content: 'Colored Lagoons' }],
  },
  {
    _id: '5',
    slug: 'rainbow-mountain',
    title: 'Rainbow Mountain',
    category: 'rainbow-mountain',
    duration: '1 Day',
    price: 45,
    discount: 0,
    gallery: [
      { url: '/img/hero/hero-slider-5-min.webp', alt: 'Rainbow Mountain' },
    ],
    quickstats: [{ content: 'Vinicunca Adventure' }],
  },
  {
    _id: '6',
    slug: 'cusco-city-tour',
    title: 'Cusco City Tour',
    category: 'cusco-tours',
    duration: '1 Day',
    price: 85,
    discount: 0,
    gallery: [
      { url: '/img/hero/hero-salineras-de-maras.webp', alt: 'Cusco City Tour' },
    ],
    quickstats: [{ content: 'Culture and History' }],
  },
  {
    _id: '7',
    slug: 'humantay-lake',
    title: 'Humantay Lake',
    category: 'cusco-tours',
    duration: '1 Day',
    price: 40,
    discount: 0,
    gallery: [
      { url: '/img/hero/hero-slider-humantay.webp', alt: 'Humantay Lake' },
    ],
    quickstats: [{ content: 'Full Day Escape' }],
  },
];

function normalizeValue(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
}

function matchesCategory(tour, category) {
  const values = [tour?.category, tour?.slug, tour?.title]
    .map(normalizeValue)
    .filter(Boolean);

  return category.matchTerms.some((term) =>
    values.some((value) => value.includes(term)),
  );
}

export function getToursByCategory(tours = [], activeFilter) {
  const category = FILTER_CATEGORIES.find((item) => item.key === activeFilter);
  const sourceTours =
    Array.isArray(tours) && tours.length > 0 ? tours : SAMPLE_TOURS;

  if (!category) {
    return sourceTours;
  }

  const nonOtherCategories = FILTER_CATEGORIES.filter(
    (item) => item.key !== 'others',
  );

  const seen = new Set();

  return sourceTours.filter((tour) => {
    const belongsToCurrent =
      category.key === 'others'
        ? !nonOtherCategories.some((item) => matchesCategory(tour, item))
        : matchesCategory(tour, category);

    if (!belongsToCurrent) {
      return false;
    }

    const uniqueKey = normalizeValue(tour.slug || tour._id);
    if (seen.has(uniqueKey)) {
      return false;
    }

    seen.add(uniqueKey);
    return true;
  });
}

export function getFeaturedTours(tours = [], limit = 5) {
  return tours.slice(0, limit);
}

export function getTourPrice(tour) {
  const basePrice = Number(tour?.price || 0);
  const discount = Number(tour?.discount || 0);

  if (discount > 0) {
    return (basePrice - (basePrice * discount) / 100).toFixed(0);
  }

  return basePrice.toFixed(0);
}

export function getTourImage(tour) {
  return tour?.gallery?.[0]?.url || '/img/hero/hero-machu-picchu.webp';
}

export function getTourAlt(tour) {
  return tour?.gallery?.[0]?.alt || tour?.title || 'Tour image';
}

export function getTourTag(tour, locale) {
  return (
    tour?.quickstats?.[0]?.content ||
    tour?.category?.replace(/-/g, ' ') ||
    (locale === 'en' ? 'Adventure' : 'Aventura')
  );
}

export function getTourDesc(tour, locale) {
  return (
    tour?.highlight ||
    (locale === 'en'
      ? 'Explore this amazing tour and discover unforgettable experiences.'
      : 'Explora este increíble tour y descubre experiencias inolvidables.')
  );
}

export function getCategoryCopy(activeFilter, locale) {
  const category = FILTER_CATEGORIES.find((item) => item.key === activeFilter);

  if (!category) {
    return {
      label: locale === 'en' ? 'Featured Tours' : 'Tours Destacados',
      description:
        locale === 'en'
          ? 'Curated routes across Peru.'
          : 'Rutas seleccionadas por todo el Peru.',
    };
  }

  return {
    label: locale === 'en' ? category.labelEn : category.labelEs,
    description:
      locale === 'en' ? category.descriptionEn : category.descriptionEs,
  };
}
