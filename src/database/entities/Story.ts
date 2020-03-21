import { Entity, Column } from 'typeorm';
import { BaseEntity } from './BaseEntity';

export enum StoryComplexity {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

export enum StoryType {
  ENHANCEMENT = 'ENHANCEMENT',
  BUGFIX = 'BUGFIX',
  DEVELOPMENT = 'DEVELOPMENT',
  QA = 'QA',
}

export enum StoryStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity()
export class Story extends BaseEntity {
  @Column()
  summary: string;

  @Column()
  description: string;

  @Column()
  type: StoryType;

  @Column()
  complexity: StoryComplexity;

  @Column()
  status: StoryStatus;

  @Column()
  estimatedCompletionTime: string;

  @Column()
  createdBy: string;
}
