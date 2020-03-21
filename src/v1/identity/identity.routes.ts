import { Router } from 'express';
import Controller from './identity.controller';
import { permissions } from '../shared/middlewares';
import { UserRole } from '../../database/entities/User';

const router = Router();

router.post('/user', Controller.loginUser);
router.post('/admin', Controller.loginUser);
router.get('/me', permissions([UserRole.USER, UserRole.ADMIN]), Controller.getProfile);

export default router;
