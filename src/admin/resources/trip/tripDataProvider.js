/**
 * DataProvider personalizado para react-admin que consume la API existente de trips.
 *
 * Mapea las convenciones de react-admin (id, pagination, sort) al formato
 * de la API interna (/api/admin/trip).
 */

import { fetchWithAuth } from '../../fetchWithAuth';

const API_URL = '/api/admin/trip';
const UPLOAD_API_URL = '/api/admin/trip/upload';

function fileToBase64(rawFile) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'));
    reader.readAsDataURL(rawFile);
  });
}

async function uploadGalleryItem(item, category) {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const alt = String(item.alt || '').trim();
  const rawFile = item.file?.rawFile;

  if (rawFile instanceof File) {
    const base64Data = await fileToBase64(rawFile);

    const uploadRes = await fetchWithAuth(UPLOAD_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        base64Data,
        category,
        fileName: rawFile.name,
        mimeType: rawFile.type,
        alt,
      }),
    });

    const uploadJson = await uploadRes.json();

    return {
      url: uploadJson.url,
      alt,
    };
  }

  const currentUrl = String(item.url || item.file?.src || '').trim();
  if (!currentUrl) {
    return null;
  }

  return {
    url: currentUrl,
    alt,
  };
}

async function prepareTripPayload(data) {
  const payload = { ...data };

  if (Array.isArray(payload.gallery)) {
    const uploadedGallery = await Promise.all(
      payload.gallery.map((item) => uploadGalleryItem(item, payload.category)),
    );

    payload.gallery = uploadedGallery.filter(Boolean);
  }

  return payload;
}

/** Normaliza _id → id para react-admin */
function normalizeTrip(trip) {
  if (!trip) return trip;
  const { _id, ...rest } = trip;

  const normalizedGallery = Array.isArray(rest.gallery)
    ? rest.gallery.map((item) => {
        if (!item || typeof item !== 'object') {
          return item;
        }

        const currentUrl = String(item.url || '').trim();

        if (!currentUrl) {
          return { ...item };
        }

        return {
          ...item,
          file: {
            src: currentUrl,
            title: item.alt || 'image',
          },
        };
      })
    : rest.gallery;

  return {
    id: _id || trip.id,
    ...rest,
    gallery: normalizedGallery,
  };
}

const tripDataProvider = {
  // ── GET LIST ──────────────────────────────────────────────
  getList: async (_resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const filter = params.filter || {};

    const query = new URLSearchParams({
      page: String(page),
      limit: String(perPage),
      ...(filter.category ? { category: filter.category } : {}),
      ...(filter.lang ? { lang: filter.lang } : {}),
      ...(filter.q ? { q: filter.q } : {}),
    });

    const res = await fetchWithAuth(`${API_URL}?${query}`);
    const json = await res.json();
    let data = (json.trips || []).map(normalizeTrip);

    // Client-side sort (la API solo ordena por createdAt desc)
    if (field && field !== 'createdAt') {
      data.sort((a, b) => {
        const va = a[field] ?? '';
        const vb = b[field] ?? '';
        if (typeof va === 'number' && typeof vb === 'number') {
          return order === 'ASC' ? va - vb : vb - va;
        }
        return order === 'ASC'
          ? String(va).localeCompare(String(vb))
          : String(vb).localeCompare(String(va));
      });
    }

    return {
      data,
      total: json.totalTrips || data.length,
    };
  },

  // ── GET ONE ───────────────────────────────────────────────
  getOne: async (_resource, params) => {
    const res = await fetchWithAuth(`${API_URL}/${params.id}`);
    const json = await res.json();
    return { data: normalizeTrip(json) };
  },

  // ── GET MANY (por IDs) ───────────────────────────────────
  getMany: async (_resource, params) => {
    const results = await Promise.all(
      params.ids.map(async (id) => {
        try {
          const res = await fetchWithAuth(`${API_URL}/${id}`);
          const json = await res.json();
          return normalizeTrip(json);
        } catch {
          return null;
        }
      }),
    );
    return { data: results.filter(Boolean) };
  },

  // ── GET MANY REFERENCE ────────────────────────────────────
  getManyReference: async (_resource, params) => {
    const { page, perPage } = params.pagination;
    const res = await fetchWithAuth(`${API_URL}?page=${page}&limit=${perPage}`);
    const json = await res.json();
    const data = (json.trips || []).map(normalizeTrip);
    return { data, total: json.totalTrips || data.length };
  },

  // ── CREATE ────────────────────────────────────────────────
  create: async (_resource, params) => {
    const payload = await prepareTripPayload(params.data);

    const res = await fetchWithAuth(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    return { data: normalizeTrip(json.trip) };
  },

  // ── UPDATE ────────────────────────────────────────────────
  update: async (_resource, params) => {
    const payload = await prepareTripPayload(params.data);

    await fetchWithAuth(`${API_URL}/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    // La API no devuelve el trip actualizado, así que re-fetch
    const getRes = await fetchWithAuth(`${API_URL}/${params.id}`);
    const updated = await getRes.json();
    return { data: normalizeTrip(updated) };
  },

  // ── UPDATE MANY ───────────────────────────────────────────
  updateMany: async (_resource, params) => {
    await Promise.all(
      params.ids.map((id) =>
        fetchWithAuth(`${API_URL}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params.data),
        }),
      ),
    );
    return { data: params.ids };
  },

  // ── DELETE ────────────────────────────────────────────────
  delete: async (_resource, params) => {
    await fetchWithAuth(`${API_URL}/${params.id}`, { method: 'DELETE' });
    return { data: { id: params.id } };
  },

  // ── DELETE MANY ───────────────────────────────────────────
  deleteMany: async (_resource, params) => {
    await Promise.all(
      params.ids.map((id) =>
        fetchWithAuth(`${API_URL}/${id}`, { method: 'DELETE' }),
      ),
    );
    return { data: params.ids };
  },
};

export default tripDataProvider;
