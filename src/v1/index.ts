import { Router, Request, Response } from 'express';
import bootstrapIdentity from './identity/identity.routes';
import bootstrapStory from './story/story.routes';

export default function bootstrapV1Router(): Router {
  const v1Router = Router();
  const identityRouter = bootstrapIdentity();
  const storyRouter = bootstrapStory();

  v1Router.all('/', (req: Request, resp: Response) => {
    return resp.redirect('https://documenter.getpostman.com/view/3397523/SzS8tRET');
  });

  v1Router.use('/identity', identityRouter);

  v1Router.use('/story', storyRouter);

  return v1Router;
}
