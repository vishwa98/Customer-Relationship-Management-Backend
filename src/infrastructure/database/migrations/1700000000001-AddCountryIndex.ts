import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class AddCountryIndex1700000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex(
      'customers',
      new TableIndex({
        name: 'idx_customers_country',
        columnNames: ['country'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('customers', 'idx_customers_country');
  }
}
