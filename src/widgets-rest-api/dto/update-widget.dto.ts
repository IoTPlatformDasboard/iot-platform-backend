import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  CreateWidgetBodyDto,
  WidgetDataSourceDto,
  WidgetConfigDto,
} from './create-widget.dto';

export class UpdateWidgetBodyDto extends PickType(CreateWidgetBodyDto, [
  'data_source',
  'config',
] as const) {
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
  config: WidgetConfigDto;
}
