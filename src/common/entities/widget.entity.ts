import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum WidgetType {
  BOARD = 'BOARD',
  LINE_CHART = 'LINE_CHART',
  GAUGE = 'GAUGE',
}

export interface WidgetDataSource {
  topic: string;
  key: string;
}

@Entity({ name: 'widgets' })
export class Widget {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  title: string | null;

  @Column({ type: 'enum', enum: WidgetType, default: WidgetType.BOARD })
  type: string;

  @Column({ type: 'jsonb', nullable: true })
  data_source: WidgetDataSource | null;

  @Column({ type: 'jsonb', nullable: true })
  config: Record<string, any> | null;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
