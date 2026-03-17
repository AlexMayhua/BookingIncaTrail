import authGuard, { requireRole } from '@/modules/auth/middleware/authGuard';
import { applyCors } from '@/utils/cors';
import * as userService from '@/modules/users/service/user.service';

export default async function handler(req, res) {
  await applyCors(req, res);

  const user = await authGuard(req, res);
  if (!user) return;
  if (!requireRole(res, user, 'admin')) return;

  switch (req.method) {
    case 'GET': {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 25;
      const { users, total } = await userService.getUsers(page, limit);
      const data = users.map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        root: u.root,
        avatar: u.avatar,
        createdAt: u.createdAt,
      }));
      return res.json({ users: data, total });
    }
    case 'POST': {
      const { name, email, password, role } = req.body;
      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ err: 'Name, email and password are required.' });
      }
      const result = await userService.createUser({
        name,
        email,
        password,
        role,
      });
      if (result.error)
        return res.status(result.status).json({ err: result.error });
      return res.status(201).json(result.user);
    }
    default:
      return res.status(405).json({ err: 'Method not allowed' });
  }
}
