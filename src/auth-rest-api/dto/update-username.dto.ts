import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { UsernameDto } from '../../common/dto/username.dto';

export class UpdateUsernameBodyDto extends PickType(UsernameDto, [
  'username',
] as const) {
  @ApiProperty({ example: 'username' })
  username: string;
}
