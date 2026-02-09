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

  @Column({ name: 'topic_id', type: 'varchar', nullable: false })
  topicId: string;

  @Column({ type: 'jsonb', nullable: false })
  payload: Record<string, any> | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => Topic, (Topic) => Topic.telemetry)
  @JoinColumn({ name: 'topic_id' })
  topic: Topic;

  toJSON() {
    return {
      id: this.id,
      topic_id: this.topicId,
      payload: this.payload,
      created_at: this.createdAt,
    };
  }
}
