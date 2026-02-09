import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export interface WidgetDataSource {
  topic: string;
  key: string;
}

export interface WidgetConfig {
  title: string;
  type: 'gauge' | 'chart' | 'value';
  order: number;
  max: number;
  min: number;
  unit: string;
}

@Entity({ name: 'widgets' })
export class Widget {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'data_source', type: 'jsonb', nullable: true })
  dataSource: WidgetDataSource;

  @Column({ type: 'jsonb', nullable: true })
  config: WidgetConfig;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  toJSON() {
    return {
      id: this.id,
      data_source: this.dataSource,
      config: this.config,
      created_at: this.createdAt,
    };
  }
}
