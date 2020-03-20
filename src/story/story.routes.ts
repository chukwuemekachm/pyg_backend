import { Router } from 'express';
import Controller from './story.controller';

const storyRouter = Router();

storyRouter.get('/', Controller.get);

export default storyRouter;
