import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'Admin',
  OPERATOR = 'Operator',
  VIEWER = 'Viewer',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
  username: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.VIEWER })
  role: UserRole;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => RefreshToken, (refresh_token) => refresh_token.user)
  refresh_tokens: RefreshToken[];
}

@Entity({ name: 'refresh_tokens' })
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  user_id: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  token_hash: string;

  @Column({ type: 'timestamp', nullable: false })
  expires_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  revoked_at: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: false })
  device_info: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => User, (User) => User.refresh_tokens)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

@Entity({ name: 'topics' })
export class Topic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 36, unique: true, nullable: false })
  topic: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}

export enum WidgetType {
  BOARD = 'board',
  LINE_CHART = 'line_chart',
  GAUGE = 'gauge',
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
