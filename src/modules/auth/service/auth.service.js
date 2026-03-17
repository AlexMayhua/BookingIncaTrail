import Users from '@/modules/users/model/user.model';
import { hashPassword, comparePassword } from '../utils/password';
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from '../utils/token';
import { connectDB } from '@/lib/mongodb';

export async function loginUser(email, password) {
  await connectDB();

  const user = await Users.findOne({ email }).select(
    '+password +role +root +name +avatar',
  );
  if (!user) return { error: 'Invalid email or password.', status: 401 };

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) return { error: 'Invalid email or password.', status: 401 };

  // Only admin and root users can access the admin panel
  if (user.role !== 'admin' && !user.root) {
    return { error: 'Access denied. Admin privileges required.', status: 403 };
  }

  const accessToken = createAccessToken({ id: user._id, role: user.role });
  const refreshToken = createRefreshToken({ id: user._id });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      root: user.root,
      avatar: user.avatar,
    },
  };
}

export async function refreshAccessToken(refreshTokenValue) {
  if (!refreshTokenValue) {
    return { error: 'No refresh token provided.', status: 401 };
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshTokenValue);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return {
        error: 'Refresh token expired. Please login again.',
        status: 401,
      };
    }
    return { error: 'Invalid refresh token.', status: 401 };
  }

  await connectDB();
  const user = await Users.findById(decoded.id).select(
    '_id name email role avatar root',
  );
  if (!user) return { error: 'User not found.', status: 401 };

  const accessToken = createAccessToken({ id: user._id, role: user.role });

  return {
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      root: user.root,
      avatar: user.avatar,
    },
  };
}
