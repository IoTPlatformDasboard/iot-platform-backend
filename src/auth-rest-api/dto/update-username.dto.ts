import { PickType } from '@nestjs/mapped-types';
import { UsernameDto } from '../../common/dto/username.dto';

export class UpdateUsernameBodyDto extends PickType(UsernameDto, [
  'username',
] as const) {}
