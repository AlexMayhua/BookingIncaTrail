import { getAccessToken, setAccessToken } from './authProvider';

/**
 * Custom HttpError that includes the HTTP status code.
 * react-admin's checkError receives this and can read error.status.
 */
export class HttpError extends Error {
  constructor(message, status, body) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

/**
 * Refreshes the access token via the refresh endpoint.
 * Imported dynamically to avoid circular dependency —
 * we duplicate the refresh logic here for the retry flow.
 */
async function tryRefresh() {
  const res = await fetch('/api/auth/refresh', { credentials: 'include' });
  if (!res.ok) return null;
  const data = await res.json();
  return data.access_token || null;
}

/**
 * Fetch wrapper that:
 * 1. Adds Authorization: Bearer header from in-memory token
 * 2. On 401, tries to refresh the token and retry once
 * 3. Throws HttpError with status code for react-admin's checkError
 */
export async function fetchWithAuth(url, options = {}) {
  const token = getAccessToken();
  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let res = await fetch(url, { ...options, headers });

  // On 401, attempt token refresh and retry once
  if (res.status === 401) {
    setAccessToken(null);
    const newToken = await tryRefresh();
    if (newToken) {
      setAccessToken(newToken);
      const retryHeaders = {
        ...options.headers,
        Authorization: `Bearer ${newToken}`,
      };
      res = await fetch(url, { ...options, headers: retryHeaders });
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new HttpError(
      body.err || body.message || `HTTP ${res.status}`,
      res.status,
      body,
    );
  }

  return res;
}
