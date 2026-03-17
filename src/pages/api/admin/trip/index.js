import authGuard, { requireRole } from '@/modules/auth/middleware/authGuard';
import { applyCors } from '@/utils/cors';
import {
  handleAdminGetTrips,
  handleAdminCreateTrip,
} from '@/modules/trips/api/trip.controller';

export default async (req, res) => {
  await applyCors(req, res);

  switch (req.method) {
    case 'GET':
      return handleAdminGetTrips(req, res);
    case 'POST': {
      const user = await authGuard(req, res);
      if (!user) return;
      if (!requireRole(res, user, 'admin')) return;
      return handleAdminCreateTrip(req, res);
    }
    default:
      return res.status(405).json({ err: 'Method not allowed' });
  }
};
