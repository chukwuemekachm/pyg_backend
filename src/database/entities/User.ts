import { Entity, Column } from 'typeorm';
import { BaseEntity } from './BaseEntity';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Entity()
export class User extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  role: UserRole;

  @Column()
  password: string;
}
