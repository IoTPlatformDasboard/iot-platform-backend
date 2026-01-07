import { PickType } from '@nestjs/mapped-types';
import { CreateTopicBodyDto } from './create-topic.dto';

export class UpdateTopicDto extends PickType(CreateTopicBodyDto, [
  'name',
  'description',
  'topic',
  'is_active',
] as const) {}
