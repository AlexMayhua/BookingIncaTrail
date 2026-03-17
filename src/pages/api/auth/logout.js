import { clearRefreshTokenCookie } from '@/modules/auth/utils/cookies';
import { applyCors } from '@/utils/cors';

export default async function handler(req, res) {
  await applyCors(req, res);

  if (req.method !== 'POST') {
    return res.status(405).json({ err: 'Method not allowed' });
  }

  clearRefreshTokenCookie(res);
  return res.json({ msg: 'Logged out successfully.' });
}
