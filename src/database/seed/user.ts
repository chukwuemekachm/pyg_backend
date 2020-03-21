import 'dotenv/config';
import { hashString } from '../../utils/utils';
import { UserRole } from '../entities/User';

export default [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: process.env.USER_EMAIL,
    role: UserRole.USER,
    password: hashString(process.env.USER_PASSWORD),
  },
  {
    firstName: 'Esther',
    lastName: 'Fred',
    email: process.env.ADMIN_EMAIL,
    role: UserRole.ADMIN,
    password: hashString(process.env.ADMIN_PASSWORD),
  },
];
