import { Router } from 'express';
import Controller from './story.controller';
import { permissions } from '../shared/middlewares';
import { UserRole } from '../../database/entities/User';

const storyRouter = Router();

storyRouter.get('/', permissions([UserRole.USER]), Controller.get);

export default storyRouter;
