import authGuard, { requireRole } from '@/modules/auth/middleware/authGuard';
import { applyCors } from '@/utils/cors';
import { handleAdminUploadTripImage } from '@/modules/trips/api/trip.controller';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
};

export default async (req, res) => {
  await applyCors(req, res);

  if (req.method !== 'POST') {
    return res.status(405).json({ err: 'Method not allowed' });
  }

  const user = await authGuard(req, res);
  if (!user) return;
  if (!requireRole(res, user, 'admin')) return;

  return handleAdminUploadTripImage(req, res);
};
