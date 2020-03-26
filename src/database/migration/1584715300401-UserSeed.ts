import { MigrationInterface, QueryRunner } from 'typeorm';
import userSeeds from '../seed/user';
import { hashString } from '../../v1/shared/utils';

export class UserSeed1584715300401 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    userSeeds.forEach(async seed => {
      await queryRunner.query(`
        INSERT INTO "user" ("id", "firstName", "lastName", "email", "role", "password")
        VALUES (uuid_generate_v4(), '${seed.firstName}', '${seed.lastName}', '${seed.email}', '${
        seed.role
      }', '${hashString(seed.password)}');
      `);
    });
  }

  public async down(): Promise<void> {
    // do nothing
  }
}
