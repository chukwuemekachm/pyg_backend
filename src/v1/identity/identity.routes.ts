import { Router } from 'express';
import Controller from './identity.controller';
import { permissions } from '../shared/middlewares';
import { UserRole } from '../../database/entities/User';

const identityRouter = Router();

identityRouter.route('/user').post(Controller.loginUser);

identityRouter.route('/admin').post(Controller.loginUser);

identityRouter.route('/me').get(permissions([UserRole.USER, UserRole.ADMIN]), Controller.getProfile);

export default identityRouter;
