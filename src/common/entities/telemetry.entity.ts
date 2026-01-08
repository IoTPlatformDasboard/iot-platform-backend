import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Topic } from './topic.entity';

@Entity({ name: 'telemetry' })
export class Telemetry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  topic_id: string;

  @Column({ type: 'jsonb', nullable: false })
  payload: Record<string, any> | null;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => Topic, (Topic) => Topic.telemetry)
  @JoinColumn({ name: 'topic_id' })
  topic: Topic;
}
