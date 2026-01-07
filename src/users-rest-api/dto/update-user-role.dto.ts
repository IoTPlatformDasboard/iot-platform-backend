import { RoleDto } from '../../common/dto/role.dto';
import { PickType } from '@nestjs/mapped-types';

export class UpdateUserRoleBodyDto extends PickType(RoleDto, [
  'role',
] as const) {}
