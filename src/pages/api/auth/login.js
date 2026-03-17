import { loginUser } from '@/modules/auth/service/auth.service';
import { setRefreshTokenCookie } from '@/modules/auth/utils/cookies';
import { applyCors } from '@/utils/cors';

export default async function handler(req, res) {
  await applyCors(req, res);

  if (req.method !== 'POST') {
    return res.status(405).json({ err: 'Method not allowed' });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ err: 'Email and password are required.' });
  }

  try {
    const result = await loginUser(email, password);

    if (result.error) {
      return res.status(result.status).json({ err: result.error });
    }

    // Set refresh token as HttpOnly cookie
    setRefreshTokenCookie(res, result.refreshToken);

    // Return access token + user info (access token stored in memory on client)
    return res.json({
      access_token: result.accessToken,
      user: result.user,
    });
  } catch (err) {
    return res.status(500).json({ err: 'Authentication failed.' });
  }
}
