import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../entities/user.entity';

export const USER_ROLES_KEY = 'userRolesKey';
export const UserRoles = (roles: UserRole) =>
  SetMetadata(USER_ROLES_KEY, roles);
