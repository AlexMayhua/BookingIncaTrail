import { connectDB } from '@/lib/mongodb';
import Users from '../model/user.model';

export async function findByEmail(email) {
  await connectDB();
  return Users.findOne({ email });
}

export async function findById(id, select = '_id name email role root avatar') {
  await connectDB();
  return Users.findById(id).select(select);
}

export async function listUsers({ page = 1, limit = 25 } = {}) {
  await connectDB();
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    Users.find()
      .select('_id name email role root avatar createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Users.countDocuments(),
  ]);
  return { users, total };
}

export async function createUser(data) {
  await connectDB();
  const user = new Users(data);
  return user.save();
}

export async function updateUser(id, data) {
  await connectDB();
  return Users.findByIdAndUpdate(id, data, { new: true }).select(
    '_id name email role root avatar',
  );
}

export async function deleteUser(id) {
  await connectDB();
  return Users.findByIdAndDelete(id);
}
