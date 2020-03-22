import { Router } from 'express';
import Controller from './story.controller';
import { permissions, validation } from '../shared/middlewares';
import { UserRole } from '../../database/entities/User';
import { StoryValidator } from '../validators/StoryValidator';
import { ProcessStoryValidator } from '../validators/ProcessStoryValidator';

const storyRouter = Router();

storyRouter
  .route('/')
  .post(permissions([UserRole.USER, UserRole.ADMIN]), validation(StoryValidator), Controller.createStory)
  .get(permissions([UserRole.USER, UserRole.ADMIN]), Controller.getStories);

storyRouter
  .route('/:storyId')
  .patch(permissions([UserRole.ADMIN]), validation(ProcessStoryValidator), Controller.processStory)
  .get(permissions([UserRole.ADMIN]), validation(ProcessStoryValidator), Controller.getStory);

export default storyRouter;
