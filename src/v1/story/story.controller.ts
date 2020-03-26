import { Request, Response, NextFunction } from 'express';
import { getRepository, Repository, ObjectLiteral } from 'typeorm';
import { StoryType, StoryComplexity, StoryStatus } from '../../database/entities/Story';
import { UserRole } from '../../database/entities/User';

class StoryController {
  private repository: Repository<ObjectLiteral>;
  private entity: any;
  private historyRepository: Repository<ObjectLiteral>;
  private historyEntity: any;
  private userRepository: Repository<ObjectLiteral>;

  constructor(storyEntity, historyEntity, userEntity) {
    this.repository = getRepository(storyEntity);
    this.entity = storyEntity;
    this.historyRepository = getRepository(historyEntity);
    this.historyEntity = historyEntity;
    this.userRepository = getRepository(userEntity);
  }

  createStory = async (req: Request, resp: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const {
        body: {
          summary,
          description = '',
          type = StoryType.DEVELOPMENT,
          complexity = StoryComplexity.MEDIUM,
          estimatedCompletionTime,
          cost,
          _user: { id },
        },
      } = req;

      const story = new this.entity();
      story.summary = summary;
      story.description = description;
      story.type = type;
      story.complexity = complexity;
      story.estimatedCompletionTime = estimatedCompletionTime;
      story.cost = parseFloat(cost);
      story.status = StoryStatus.PENDING;
      story.createdBy = id;

      await this.repository.save(story);
      this.trackStoryHistory(StoryStatus.PENDING, story.id, id);

      return resp.status(201).json({
        message: 'Story creation success',
        story,
      });
    } catch (error) {
      return next(error);
    }
  };

  getStories = async (req: Request, resp: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const {
        _user: { role, id },
      } = req.body;
      const stories =
        role === UserRole.USER ? await this.repository.find({ createdBy: id }) : await this.repository.find();

      return resp.status(200).json({
        stories,
      });
    } catch (error) {
      return next(error);
    }
  };

  processStory = async (req: Request, resp: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const {
        params: { storyId },
        body: {
          status,
          _user: { id },
        },
      } = req;
      const story = await this.repository.findOne(storyId);

      if (story) {
        story.status = status;
        await this.repository.save(story);
        this.trackStoryHistory(status, storyId, id);

        return resp.status(200).json({
          message: 'Story modification success',
          story,
        });
      }

      return resp.status(404).json({
        message: `Story with id: ${storyId} not found`,
      });
    } catch (error) {
      return next(error);
    }
  };

  getStory = async (req: Request, resp: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const {
        params: { storyId },
      } = req;
      const story = await this.repository.findOne(storyId);

      if (story) {
        const [history, user] = await Promise.all([
          this.historyRepository.find({ where: { storyId } }),
          this.userRepository.findOne(story.createdBy, { select: ['id', 'firstName', 'lastName', 'email'] }),
        ]);

        return resp.status(200).json({
          story: {
            ...story,
            history,
            createdBy: user,
          },
        });
      }

      return resp.status(404).json({
        message: `Story with id: ${storyId} not found`,
      });
    } catch (error) {
      return next(error);
    }
  };

  updateStory = async (req: Request, resp: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const {
        body: {
          summary,
          description = '',
          type,
          complexity,
          estimatedCompletionTime,
          cost,
          _user: { id, role },
        },
        params: { storyId },
      } = req;

      const story = await this.repository.findOne(storyId);

      if (story) {
        if (story.createdBy === id || role === UserRole.ADMIN) {
          story.summary = summary || story.summary;
          story.description = description || story.description;
          story.type = type || story.type;
          story.complexity = complexity || story.complexity;
          story.estimatedCompletionTime = estimatedCompletionTime || story.estimatedCompletionTime;
          story.cost = cost || story.cost;

          await this.repository.save(story);
          this.trackStoryHistory(story.status, story.id, id);

          return resp.status(200).json({
            message: 'Story modification success',
            story,
          });
        }
      }

      return resp.status(404).json({
        message: `Story with id: ${storyId} not found`,
      });
    } catch (error) {
      return next(error);
    }
  };

  private trackStoryHistory = (status: StoryStatus, storyId: string, createdBy: string): void => {
    const storyHistory = new this.historyEntity();
    storyHistory.storyId = storyId;
    storyHistory.createdBy = createdBy;
    storyHistory.status = status;
    this.historyRepository.save(storyHistory);
  };
}

export default StoryController;
