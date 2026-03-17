import { verifyAccessToken } from '../utils/token';
import Users from '@/modules/users/model/user.model';
import { connectDB } from '@/lib/mongodb';

/**
 * Auth guard middleware for API routes.
 * Reads Bearer token from Authorization header.
 * Returns user info or sends error response and returns null.
 */
export default async function authGuard(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log(
      '[authGuard] 401 — No Bearer token. Header:',
      authHeader || '(empty)',
    );
    res.status(401).json({ err: 'Authentication required.' });
    return null;
  }

  const token = authHeader.slice(7);
  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (err) {
    console.log(
      '[authGuard] 401 — Token verify failed:',
      err.name,
      err.message,
    );
    if (err.name === 'TokenExpiredError') {
      res.status(401).json({ err: 'Token expired.' });
    } else {
      res.status(401).json({ err: 'Invalid token.' });
    }
    return null;
  }

  await connectDB();
  const user = await Users.findById(decoded.id).select('_id role root');
  if (!user) {
    console.log('[authGuard] 401 — User not found for id:', decoded.id);
    res.status(401).json({ err: 'User not found.' });
    return null;
  }

  return { id: user._id, role: user.role, root: user.root };
}

/**
 * Require specific roles. Returns true if allowed, false if denied (sends 403).
 */
export function requireRole(res, user, ...roles) {
  if (user.root) return true;
  if (roles.includes(user.role)) return true;
  res.status(403).json({ err: 'Forbidden. Insufficient permissions.' });
  return false;
}
