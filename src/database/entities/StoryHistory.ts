import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { StoryStatus } from './Story';

@Entity('storyhistory')
export class StoryHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  status: StoryStatus;

  @Column()
  createdBy: string;

  @Column()
  storyId: string;

  @CreateDateColumn()
  createdAt: string;
}
