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

@Entity({ name: 'widgets' })
export class Widget {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'data_source', type: 'jsonb', nullable: true })
  dataSource: WidgetDataSource | null;

  @Column({ type: 'jsonb', nullable: true })
  config: Record<string, any> | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
