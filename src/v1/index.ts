import { Router } from 'express';
import identityRouter from './identity/identity.routes';
import storyRouter from './story/story.routes';

const v1Router = Router();

v1Router.use('/identity', identityRouter);
v1Router.use('/story', storyRouter);

export default v1Router;
