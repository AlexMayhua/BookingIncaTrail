import { refreshAccessToken } from '@/modules/auth/service/auth.service';
import { applyCors } from '@/utils/cors';

export default async function handler(req, res) {
  await applyCors(req, res);

  if (req.method !== 'GET') {
    return res.status(405).json({ err: 'Method not allowed' });
  }

  const rfToken = req.cookies.refreshtoken;

  try {
    const result = await refreshAccessToken(rfToken);

    if (result.error) {
      return res.status(result.status).json({ err: result.error });
    }

    return res.json({
      access_token: result.accessToken,
      user: result.user,
    });
  } catch (err) {
    return res.status(500).json({ err: 'Token refresh failed.' });
  }
}
