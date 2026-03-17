import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export function hashPassword(plain) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export function comparePassword(plain, hashed) {
  return bcrypt.compare(plain, hashed);
}
