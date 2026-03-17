/**
 * DataProvider personalizado para react-admin que consume la API existente de trips.
 *
 * Mapea las convenciones de react-admin (id, pagination, sort) al formato
 * de la API interna (/api/admin/trip).
 */

import { fetchWithAuth } from '../../fetchWithAuth';

const API_URL = '/api/admin/trip';

/** Normaliza _id → id para react-admin */
function normalizeTrip(trip) {
  if (!trip) return trip;
  const { _id, ...rest } = trip;
  return { id: _id || trip.id, ...rest };
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
    const res = await fetchWithAuth(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params.data),
    });
    const json = await res.json();
    return { data: normalizeTrip(json.trip) };
  },

  // ── UPDATE ────────────────────────────────────────────────
  update: async (_resource, params) => {
    await fetchWithAuth(`${API_URL}/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params.data),
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
