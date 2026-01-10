import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { WidgetType } from 'src/common/entities/widget.entity';
import { CreateWidgetBodyDto, WidgetDataSourceDto } from './create-widget.dto';

export class UpdateWidgetBodyDto extends PickType(CreateWidgetBodyDto, [
  'title',
  'type',
  'data_source',
  'config',
] as const) {
  @ApiProperty({ example: 'widget_title', description: 'Widget title' })
  title: string;

  @ApiProperty({ example: 'board', description: 'Widget type' })
  type: WidgetType;

  @ApiProperty({
    example: {
      topic: 'topic',
      key: 'key',
    },
    description: 'Widget data source',
  })
  data_source: WidgetDataSourceDto;

  @ApiProperty({
    example: {
      min: 0,
      max: 100,
    },
    description: 'Widget config',
  })
  config: Record<string, any>;
}
