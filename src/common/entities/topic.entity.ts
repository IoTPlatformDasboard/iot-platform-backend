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

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: false,
    nullable: false,
  })
  isActive: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToMany(() => Telemetry, (Telemetry) => Telemetry.topic)
  telemetry: Telemetry[];

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      topic: this.topic,
      is_active: this.isActive,
      created_at: this.createdAt,
    };
  }
}
