import { Request } from 'express';
import { UserRole } from '../entities/user.entity';

export interface AccessTokenPayload extends Request {
  sub: string;
  role: UserRole;
  type: 'access' | 'refresh';
}
