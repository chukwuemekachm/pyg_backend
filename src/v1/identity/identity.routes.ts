import { Router } from 'express';
import IdentityController from './identity.controller';
import { permissions } from '../shared/middlewares';
import { UserRole, User } from '../../database/entities/User';

export default function bootstrapIdentity(): Router {
  const controller = new IdentityController(User);
  const identityRouter = Router();

  identityRouter
    .route('/')
    .post(controller.loginUser)
    .get(permissions([UserRole.USER, UserRole.ADMIN]), controller.getProfile);

  return identityRouter;
}
