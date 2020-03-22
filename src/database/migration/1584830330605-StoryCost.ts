import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class StoryCost1584830330605 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      'story',
      new TableColumn({
        name: 'cost',
        type: 'decimal',
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn('story', 'cost');
  }
}
