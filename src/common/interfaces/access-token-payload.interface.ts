import { Request } from 'express';
import { UserRole } from '../entities';

export default interface AccessTokenPayload extends Request {
  sub: string;
  role: UserRole;
  type: 'access' | 'refresh';
}
