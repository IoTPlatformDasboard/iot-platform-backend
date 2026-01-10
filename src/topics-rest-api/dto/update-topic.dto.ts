import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTopicBodyDto } from './create-topic.dto';

export class UpdateTopicDto extends PickType(CreateTopicBodyDto, [
  'name',
  'description',
  'topic',
  'is_active',
] as const) {
  @ApiProperty({ example: 'topic_name', description: 'Topic name' })
  name: string;

  @ApiProperty({
    example: 'This is a description of the topic',
    description: 'Topic description',
  })
  description: string;

  @ApiProperty({ example: 'topic', description: 'Topic' })
  topic: string;

  @ApiProperty({ example: 'true', description: 'Is active' })
  is_active: boolean;
}
