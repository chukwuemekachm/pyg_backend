import { IsEnum, IsUUID } from 'class-validator';
import { StoryStatus } from '../../database/entities/Story';

interface ProcessStoryPayload {
  status: StoryStatus;
  storyId: string;
}

export class ProcessStoryValidator implements ProcessStoryPayload {
  @IsEnum(StoryStatus)
  status: StoryStatus;

  @IsUUID()
  storyId: string;

  constructor({ status, storyId }: ProcessStoryPayload) {
    this.status = status;
    this.storyId = storyId;
  }
}
