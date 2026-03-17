import authGuard, { requireRole } from '@/modules/auth/middleware/authGuard';
import { applyCors } from '@/utils/cors';
import * as userService from '@/modules/users/service/user.service';

export default async function handler(req, res) {
  await applyCors(req, res);

  const authUser = await authGuard(req, res);
  if (!authUser) return;
  if (!requireRole(res, authUser, 'admin')) return;

  const { id } = req.query;

  switch (req.method) {
    case 'GET': {
      const user = await userService.getUserById(id);
      if (!user) return res.status(404).json({ err: 'User not found.' });
      return res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        root: user.root,
        avatar: user.avatar,
      });
    }
    case 'PUT': {
      const updated = await userService.updateUser(id, req.body);
      if (!updated) return res.status(404).json({ err: 'User not found.' });
      return res.json({
        id: updated._id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        root: updated.root,
        avatar: updated.avatar,
      });
    }
    case 'DELETE': {
      // Prevent deleting yourself
      if (String(authUser.id) === String(id)) {
        return res.status(400).json({ err: 'Cannot delete your own account.' });
      }
      await userService.deleteUser(id);
      return res.json({ msg: 'User deleted.' });
    }
    default:
      return res.status(405).json({ err: 'Method not allowed' });
  }
}
