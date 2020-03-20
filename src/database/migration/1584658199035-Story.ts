import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class Story1584657195561 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE StoryComplexity AS ENUM ('SMALL', 'MEDIUM', 'LARGE');`);

    await queryRunner.query(`CREATE TYPE StoryType AS ENUM ('ENHANCEMENT', 'BUGFIX', 'DEVELOPMENT', 'QA');`);

    await queryRunner.query(
      `CREATE TYPE StoryStatus AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');`,
    );

    await queryRunner.createTable(
      new Table({
        name: 'story',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'summary',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'type',
            type: 'varchar',
            isNullable: false,
            default: `'DEVELOPMENT'`,
          },
          {
            name: 'complexity',
            type: 'StoryComplexity',
            isNullable: false,
            default: `'MEDIUM'`,
          },
          {
            name: 'status',
            type: 'varchar',
            isNullable: false,
            default: `'PENDING'`,
          },
          {
            name: 'estimatedCompletionTime',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'createdBy',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            isNullable: true,
            default: 'NOW()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            isNullable: true,
            default: 'NOW()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'story',
      new TableForeignKey({
        columnNames: ['id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('story');
    await queryRunner.query('DROP TYPE StoryComplexity;');
    await queryRunner.query('DROP TYPE StoryType;');
    await queryRunner.query('DROP TYPE StoryStatus;');
  }
}
