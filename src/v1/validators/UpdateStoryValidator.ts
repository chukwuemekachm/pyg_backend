import { Length, IsOptional, IsString, IsDateString, IsEnum, IsDecimal, IsUUID } from 'class-validator';
import { StoryType, StoryComplexity, StoryStatus } from '../../database/entities/Story';

interface StoryPayload {
  summary: string;
  description: string;
  type: StoryType;
  complexity: StoryComplexity;
  estimatedCompletionTime: string;
  cost: number;
  storyId: string;
}

export class UpdateStoryValidator implements StoryPayload {
  @IsOptional()
  @IsString()
  @Length(5, 250)
  summary: string;

  @IsOptional()
  @IsString()
  @Length(5, 3000)
  description: string;

  @IsOptional()
  @IsEnum(StoryType)
  type: StoryType;

  @IsOptional()
  @IsEnum(StoryStatus)
  status: StoryStatus;

  @IsOptional()
  @IsEnum(StoryComplexity)
  complexity: StoryComplexity;

  @IsOptional()
  @IsDecimal()
  cost: number;

  @IsOptional()
  @IsDateString()
  estimatedCompletionTime: string;

  @IsUUID()
  storyId: string;

  constructor({ summary, description, type, complexity, estimatedCompletionTime, cost, storyId }: StoryPayload) {
    this.summary = summary;
    this.description = description;
    this.type = type;
    this.complexity = complexity;
    this.estimatedCompletionTime = estimatedCompletionTime;
    this.cost = cost ? Number(cost) : cost;
    this.storyId = storyId;
  }
}
