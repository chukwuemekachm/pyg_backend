import { Router } from 'express';
import StoryController from './story.controller';
import { permissions, validation } from '../shared/middlewares';
import { UserRole, User } from '../../database/entities/User';
import { Story } from '../../database/entities/Story';
import { StoryHistory } from '../../database/entities/StoryHistory';
import { StoryValidator } from '../validators/StoryValidator';
import { ProcessStoryValidator } from '../validators/ProcessStoryValidator';
import { UpdateStoryValidator } from '../validators/UpdateStoryValidator';

export default function bootstrapStory(): Router {
  const storyRouter = Router();
  const controller = new StoryController(Story, StoryHistory, User);

  storyRouter
    .route('/')
    .post(permissions([UserRole.USER, UserRole.ADMIN]), validation(StoryValidator), controller.createStory)
    .get(permissions([UserRole.USER, UserRole.ADMIN]), controller.getStories);

  storyRouter
    .route('/:storyId')
    .patch(permissions([UserRole.ADMIN]), validation(ProcessStoryValidator), controller.processStory)
    .put(permissions([UserRole.USER, UserRole.ADMIN]), validation(UpdateStoryValidator, true), controller.updateStory)
    .get(permissions([UserRole.ADMIN]), controller.getStory);

  return storyRouter;
}
