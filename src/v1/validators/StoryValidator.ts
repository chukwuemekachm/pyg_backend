import { Length, IsOptional, IsString, IsDateString, IsEnum, IsNumber } from 'class-validator';
import { StoryType, StoryComplexity, StoryStatus } from '../../database/entities/Story';

interface StoryPayload {
  summary: string;
  description: string;
  type: StoryType;
  complexity: StoryComplexity;
  estimatedCompletionTime: string;
  cost: number;
  status: StoryStatus;
}

export class StoryValidator implements StoryPayload {
  @IsString()
  @Length(5, 250)
  summary: string;

  @IsString()
  @Length(5, 3000)
  @IsOptional()
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

  // @IsNumber()
  cost: number;

  @IsDateString()
  estimatedCompletionTime: string;

  constructor({ summary, description, type, complexity, estimatedCompletionTime, cost, status }: StoryPayload) {
    this.summary = summary;
    this.description = description;
    this.type = type;
    this.complexity = complexity;
    this.estimatedCompletionTime = estimatedCompletionTime;
    this.cost = Number(cost);
    this.status = status;
  }
}
