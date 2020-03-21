import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { SECRET_KEY } = process.env;

export function hashString(word: string): string {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(word, salt);
}

export function compareHash(hash: string, word: string): boolean {
  return bcrypt.compareSync(word, hash);
}

export function generateToken(payload: object): string {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });
}

export function decodeToken(token: string): object | string | boolean {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (error) {
    return false;
  }
}
