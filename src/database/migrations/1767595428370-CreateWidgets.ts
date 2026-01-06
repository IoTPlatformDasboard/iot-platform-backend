import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateWidgets1767595428370 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'widgets',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
          },
          {
            name: 'title',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['line_chart', 'gauge', 'board'],
            default: `'board'`,
            isNullable: false,
          },
          {
            name: 'data_source',
            type: 'jsonb',
            isNullable: true,
            comment:
              'Data binding configuration (topic, jsonPath, aggregation)',
          },
          {
            name: 'config',
            type: 'jsonb',
            isNullable: true,
            comment: 'Presentation & behavior configuration for frontend',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('widgets');
    await queryRunner.query('DROP TYPE IF EXISTS widgets_type_enum');
  }
}
