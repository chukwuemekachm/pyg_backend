import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class StoryCreatedBy1584833742343 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = await queryRunner.getTable('story');
    const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('id') !== -1);
    await queryRunner.dropForeignKey('story', foreignKey);

    await queryRunner.createForeignKey(
      'story',
      new TableForeignKey({
        columnNames: ['createdBy'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const table = await queryRunner.getTable('story');
    const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('createdBy') !== -1);
    await queryRunner.dropForeignKey('story', foreignKey);

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
}
