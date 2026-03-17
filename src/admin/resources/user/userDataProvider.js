import { fetchWithAuth } from '../../fetchWithAuth';

const API_URL = '/api/admin/users';

function normalizeUser(user) {
  if (!user) return user;
  const { _id, ...rest } = user;
  return { id: _id || user.id, ...rest };
}

const userDataProvider = {
  getList: async (_resource, params) => {
    const { page, perPage } = params.pagination;
    const query = new URLSearchParams({
      page: String(page),
      limit: String(perPage),
    });

    const res = await fetchWithAuth(`${API_URL}?${query}`);
    const json = await res.json();
    const data = (json.users || []).map(normalizeUser);
    return { data, total: json.total || data.length };
  },

  getOne: async (_resource, params) => {
    const res = await fetchWithAuth(`${API_URL}/${params.id}`);
    const json = await res.json();
    return { data: normalizeUser(json) };
  },

  getMany: async (_resource, params) => {
    const results = await Promise.all(
      params.ids.map(async (id) => {
        try {
          const res = await fetchWithAuth(`${API_URL}/${id}`);
          return normalizeUser(await res.json());
        } catch {
          return null;
        }
      }),
    );
    return { data: results.filter(Boolean) };
  },

  getManyReference: async (_resource, params) => {
    const { page, perPage } = params.pagination;
    const res = await fetchWithAuth(`${API_URL}?page=${page}&limit=${perPage}`);
    const json = await res.json();
    const data = (json.users || []).map(normalizeUser);
    return { data, total: json.total || data.length };
  },

  create: async (_resource, params) => {
    const res = await fetchWithAuth(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params.data),
    });
    const json = await res.json();
    return { data: normalizeUser(json) };
  },

  update: async (_resource, params) => {
    const res = await fetchWithAuth(`${API_URL}/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params.data),
    });
    const json = await res.json();
    return { data: normalizeUser(json) };
  },

  delete: async (_resource, params) => {
    await fetchWithAuth(`${API_URL}/${params.id}`, { method: 'DELETE' });
    return { data: { id: params.id } };
  },

  deleteMany: async (_resource, params) => {
    await Promise.all(
      params.ids.map((id) =>
        fetchWithAuth(`${API_URL}/${id}`, { method: 'DELETE' }),
      ),
    );
    return { data: params.ids };
  },
};

export default userDataProvider;
