/**
 * AuthProvider para react-admin.
 *
 * Login: POSTs credentials to /api/auth/login → receives access_token (stored in memory)
 *        + refresh_token (HttpOnly cookie set by server).
 * Token refresh: GET /api/auth/refresh → new access_token from cookie.
 * Logout: POST /api/auth/logout → clears HttpOnly cookie.
 */

let accessToken = null;

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token) {
  accessToken = token;
}

async function refreshToken() {
  const res = await fetch('/api/auth/refresh', { credentials: 'include' });
  if (!res.ok) {
    accessToken = null;
    throw new Error('Session expired');
  }
  const data = await res.json();
  accessToken = data.access_token;
  if (data.user) {
    localStorage.setItem('ra_user', JSON.stringify(data.user));
  }
  return data;
}

const authProvider = {
  login: async ({ username, password }) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email: username, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.err || 'Login failed');
    }

    const data = await res.json();
    accessToken = data.access_token;
    localStorage.setItem('ra_user', JSON.stringify(data.user));
  },

  logout: async () => {
    accessToken = null;
    localStorage.removeItem('ra_user');
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    }).catch(() => {});
  },

  checkAuth: async () => {
    if (accessToken) {
      try {
        await refreshToken();
      } catch {
        accessToken = null;
        localStorage.removeItem('ra_user');
        throw new Error('Session expired');
      }
      return;
    }
    await refreshToken();
  },

  checkError: async (error) => {
    const status = error?.status || error?.response?.status;
    if (status === 401) {
      try {
        await refreshToken();
        return;
      } catch {
        accessToken = null;
        localStorage.removeItem('ra_user');
        throw new Error('Session expired');
      }
    }
    if (status === 403) {
      throw new Error('Forbidden');
    }
  },

  getPermissions: () => {
    try {
      const user = JSON.parse(localStorage.getItem('ra_user') || '{}');
      return Promise.resolve(user.role || 'user');
    } catch {
      return Promise.resolve('user');
    }
  },

  getIdentity: () => {
    try {
      const user = JSON.parse(localStorage.getItem('ra_user') || '{}');
      return Promise.resolve({
        id: user.id || 'admin',
        fullName: user.name || 'Admin',
        avatar: user.avatar,
      });
    } catch {
      return Promise.resolve({ id: 'admin', fullName: 'Admin' });
    }
  },
};

export default authProvider;
