import * as tripService from '../service/trip.service';
import { saveBase64ImageToLocalStorage } from '../service/tripGalleryStorage.service';

// ── Handlers públicos ─────────────────────────────────────────

/**
 * GET /api/trip — Lista trips con filtros (locale, category, isDeals, fields).
 */
export async function handleGetTrips(req, res) {
  try {
    const { locale, category, fields, isDeals } = req.query;

    if (!locale) {
      return res
        .status(400)
        .json({ msg: "El parámetro 'locale' es requerido" });
    }

    const trips = await tripService.listTrips({
      locale,
      category,
      isDeals,
      fields,
    });
    return res.status(200).json(trips);
  } catch (error) {
    return res
      .status(500)
      .json({ msg: 'Error interno del servidor', error: error.message });
  }
}

/**
 * GET /api/trip/navbar — Flujo dedicado para trips por categorías específicas.
 */
export async function handleGetNavbarTrips(req, res) {
  try {
    const { category, locale } = req.query;

    if (!category) {
      return res
        .status(400)
        .json({ msg: "El parámetro 'category' es requerido" });
    }

    const groupedTrips = await tripService.listNavbarTripsByCategory({
      category,
      locale,
    });
    return res.status(200).json(groupedTrips);
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
}

/**
 * GET /api/trip/[id] — Obtiene un trip por slug e idioma.
 */
export async function handleGetTripBySlug(req, res) {
  try {
    const { id: slug, locale } = req.query;

    if (!slug || !locale) {
      return res.status(400).json({
        success: false,
        message: 'slug and locale are required',
      });
    }

    const trip = await tripService.getTripBySlug(slug, locale);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: trip,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

/**
 * GET /api/trip/categories — Devuelve categorías únicas.
 */
export async function handleGetCategories(req, res) {
  try {
    const categories = await tripService.getCategories();

    return res.status(200).json({
      success: true,
      categories,
      count: categories.length,
    });
  } catch (error) {
    return res.status(500).json({ success: false, err: error.message });
  }
}

/**
 * GET /api/trip/deals — Devuelve trips marcados como deals.
 */
export async function handleGetDeals(req, res) {
  try {
    const { locale } = req.query;

    const deals = await tripService.getDeals(locale);
    return res.status(200).json(deals);
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
}

// ── Handlers admin ────────────────────────────────────────────

/**
 * GET /api/admin/trip — Lista trips admin con paginación.
 */
export async function handleAdminGetTrips(req, res) {
  try {
    const { category, lang, q, page, limit } = req.query;
    const result = await tripService.listTripsAdmin({
      category,
      lang,
      q,
      page,
      limit,
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
}

/**
 * POST /api/admin/trip — Crea un nuevo trip (requiere auth admin).
 */
export async function handleAdminCreateTrip(req, res) {
  try {
    const trip = await tripService.createTrip(req.body);
    return res.status(201).json({ msg: 'Success! Created a new trip', trip });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ err: error.message });
    }
    if (error.name === 'ValidationError') {
      return res
        .status(400)
        .json({ err: 'Validation failed', details: error.message });
    }
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ err: 'A trip with this slug already exists.' });
    }
    return res
      .status(500)
      .json({ err: 'Failed to create trip. Please try again.' });
  }
}

/**
 * GET /api/admin/trip/[id] — Obtiene un trip por ID (admin).
 */
export async function handleAdminGetTrip(req, res) {
  try {
    const { id } = req.query;
    const trip = await tripService.getTripById(id);
    if (!trip)
      return res.status(400).json({ err: 'This product does not exist.' });

    return res.json(trip);
  } catch (error) {
    return res
      .status(500)
      .json({ err: 'Sorry. Please Login Again or Contact Us!' });
  }
}

/**
 * PUT /api/admin/trip/[id] — Actualiza un trip (requiere auth admin).
 */
export async function handleAdminUpdateTrip(req, res) {
  try {
    const { id } = req.query;
    await tripService.updateTrip(id, req.body);
    return res.json({ msg: 'Success! Updated a product' });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ err: error.message });
    }
    return res
      .status(500)
      .json({ err: 'Sorry. Please Login Again or Contact Us!' });
  }
}

/**
 * DELETE /api/admin/trip/[id] — Elimina un trip (requiere auth admin).
 */
export async function handleAdminDeleteTrip(req, res) {
  try {
    const { id } = req.query;
    await tripService.deleteTrip(id);
    return res.json({ msg: 'Successfully Deleted Product/Products.' });
  } catch (error) {
    return res
      .status(500)
      .json({ err: 'Sorry. Please Login Again or Contact Us!' });
  }
}

/**
 * POST /api/admin/trip/upload — Sube una imagen (base64) y devuelve su URL local.
 */
export async function handleAdminUploadTripImage(req, res) {
  try {
    const { base64Data, category, fileName, mimeType, alt } = req.body || {};

    if (!base64Data || !category) {
      return res
        .status(400)
        .json({ err: "'base64Data' y 'category' son requeridos." });
    }

    const url = await saveBase64ImageToLocalStorage({
      base64Data,
      category,
      fileName,
      mimeType,
    });

    return res.status(201).json({
      url,
      alt: alt || '',
    });
  } catch (error) {
    return res.status(400).json({ err: error.message });
  }
}
