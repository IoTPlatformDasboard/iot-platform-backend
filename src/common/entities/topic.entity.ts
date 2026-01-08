import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Telemetry } from './telemetry.entity';

@Entity({ name: 'topics' })
export class Topic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  topic: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => Telemetry, (Telemetry) => Telemetry.topic)
  telemetry: Telemetry[];
}
