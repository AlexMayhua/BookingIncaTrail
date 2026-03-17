import * as repo from '../repository/user.repository';
import { hashPassword } from '@/modules/auth/utils/password';

export async function getUsers(page, limit) {
  return repo.listUsers({ page, limit });
}

export async function getUserById(id) {
  return repo.findById(id);
}

export async function createUser({ name, email, password, role = 'user' }) {
  const existing = await repo.findByEmail(email);
  if (existing) return { error: 'Email already exists.', status: 400 };

  const hashedPassword = await hashPassword(password);
  const user = await repo.createUser({
    name,
    email,
    password: hashedPassword,
    role,
  });
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      root: user.root,
    },
  };
}

export async function updateUser(id, data) {
  if (data.password) {
    data.password = await hashPassword(data.password);
  }
  return repo.updateUser(id, data);
}

export async function deleteUser(id) {
  return repo.deleteUser(id);
}
