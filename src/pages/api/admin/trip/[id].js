import authGuard, { requireRole } from '@/modules/auth/middleware/authGuard';
import { applyCors } from '@/utils/cors';
import {
  handleAdminGetTrip,
  handleAdminUpdateTrip,
  handleAdminDeleteTrip,
} from '@/modules/trips/api/trip.controller';

export default async (req, res) => {
  await applyCors(req, res);

  switch (req.method) {
    case 'GET':
      return handleAdminGetTrip(req, res);
    case 'PUT': {
      const user = await authGuard(req, res);
      if (!user) return;
      if (!requireRole(res, user, 'admin')) return;
      return handleAdminUpdateTrip(req, res);
    }
    case 'DELETE': {
      const user = await authGuard(req, res);
      if (!user) return;
      if (!requireRole(res, user, 'admin')) return;
      return handleAdminDeleteTrip(req, res);
    }
    default:
      return res.status(405).json({ err: 'Method not allowed' });
  }
};
