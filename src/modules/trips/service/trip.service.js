import * as tripRepository from '../repository/trip.repository';

// ── Servicios públicos ────────────────────────────────────────

/**
 * Lista trips aplicando filtros de locale, categoría, deals y selección de campos.
 */
export async function listTrips({ locale, category, isDeals, fields }) {
  const filter = {};

  // Filtro de idioma: 'all' devuelve todo, otro valor incluye trips del idioma + lang='all'
  if (locale && locale !== 'all') {
    filter.$or = [{ lang: locale }, { lang: 'all' }];
  }

  // Filtrar por categoría (acepta string con comas o array)
  if (category && category !== '') {
    const categoriesArray = Array.isArray(category)
      ? category
      : category
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean);
    filter.category = { $in: categoriesArray };
  }

  // Filtrar por deals
  if (isDeals === 'true' || isDeals === true) {
    filter.isDeals = true;
  }

  // Selección de campos
  const selectedFields =
    fields && fields !== '' ? fields.split(',').join(' ') : null;

  return tripRepository.findTrips(filter, selectedFields);
}

/**
 * Obtiene un trip por slug e idioma.
 */
export async function getTripBySlug(slug, lang) {
  const trip = await tripRepository.findTripBySlug(slug, lang);
  if (!trip) return null;
  return trip;
}

/**
 * Devuelve las categorías únicas ordenadas alfabéticamente.
 */
export async function getCategories() {
  const categories = await tripRepository.getDistinctCategories();
  return categories.filter(Boolean).sort((a, b) => a.localeCompare(b));
}

/**
 * Devuelve categorías con sus tours agrupados, filtrados por idioma.
 */
export async function getCategoriesWithTours(locale) {
  const trips = await tripRepository.findTripsGroupedByCategory(locale);
  const grouped = {};
  for (const trip of trips) {
    if (!trip.category) continue;
    if (!grouped[trip.category]) grouped[trip.category] = [];
    grouped[trip.category].push(trip);
  }
  return Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([category, tours]) => ({ category, tours }));
}

/**
 * Devuelve los trips marcados como deals para un idioma.
 */
export async function getDeals(lang) {
  return tripRepository.findDeals(lang);
}

// ── Servicios admin ───────────────────────────────────────────

/**
 * Lista trips para el panel admin con paginación.
 */
export async function listTripsAdmin({
  category,
  lang,
  q,
  page = 1,
  limit = 10,
}) {
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const filter = {};

  if (category) filter.category = category;
  if (lang) filter.lang = lang;
  if (q) filter.title = { $regex: q, $options: 'i' };

  const [trips, totalTrips] = await Promise.all([
    tripRepository.findTripsWithPagination(filter, pageNum, limitNum),
    tripRepository.countTrips(filter),
  ]);

  return {
    trips,
    totalPages: Math.ceil(totalTrips / limitNum),
    currentPage: pageNum,
    totalTrips,
  };
}

/**
 * Obtiene un trip por su ID (admin).
 */
export async function getTripById(id) {
  const trip = await tripRepository.findTripById(id);
  if (!trip) return null;
  return trip;
}

/**
 * Crea un nuevo trip. Valida campos obligatorios.
 */
export async function createTrip(data) {
  const { title, price, category, lang } = data;

  if (!title || !price || !category || !lang) {
    throw {
      status: 400,
      message:
        'Missing required fields: title, price, category, and lang are required.',
    };
  }

  const parsedPrice = Number(price);

  if (!parsedPrice || parsedPrice <= 0) {
    throw { status: 400, message: 'Price must be a positive number.' };
  }

  return tripRepository.createTrip(data);
}

/**
 * Actualiza un trip existente. Valida campos obligatorios.
 */
export async function updateTrip(id, data) {
  const { title, price, gallery } = data;

  if (!title || !price || !gallery || gallery.length === 0) {
    throw { status: 400, message: 'Please add all the fields.' };
  }

  const parsedPrice = Number(price);

  if (!parsedPrice || parsedPrice <= 0) {
    throw { status: 400, message: 'Price must be a positive number.' };
  }

  return tripRepository.updateTripById(id, data);
}

/**
 * Elimina un trip por su ID.
 */
export async function deleteTrip(id) {
  return tripRepository.deleteTripById(id);
}
