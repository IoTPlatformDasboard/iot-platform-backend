import { IsNotEmpty, IsEnum } from 'class-validator';
import { UserRole } from '../../common/entities/user.entity';

export class RoleDto {
  @IsNotEmpty({ message: 'Role cannot be empty' })
  @IsEnum(UserRole, {
    message: 'Role must be either ADMIN, OPERATOR, or VIEWER',
  })
  role: UserRole;
}
