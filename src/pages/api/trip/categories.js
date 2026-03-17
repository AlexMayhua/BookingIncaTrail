import { handleGetCategories } from '../../../modules/trips/api/trip.controller';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return handleGetCategories(req, res);
  }

  return res.status(405).json({ success: false, err: 'Method not allowed' });
}
