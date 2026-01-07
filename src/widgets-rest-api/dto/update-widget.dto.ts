import { PickType } from '@nestjs/mapped-types';
import { CreateWidgetBodyDto } from './create-widget.dto';

export class UpdateWidgetBodyDto extends PickType(CreateWidgetBodyDto, [
  'title',
  'type',
  'data_source',
  'config',
] as const) {}
