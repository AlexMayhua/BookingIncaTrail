import NextCors from 'nextjs-cors';
import { handleGetNavbarTrips } from '../../../modules/trips/api/trip.controller';

export default async (req, res) => {
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200,
  });

  if (req.method === 'GET') {
    return handleGetNavbarTrips(req, res);
  }

  return res.status(405).json({ err: 'Method not allowed' });
};
