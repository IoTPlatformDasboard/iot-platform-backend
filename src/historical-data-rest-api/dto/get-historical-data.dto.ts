import { IsISO8601, IsString } from 'class-validator';

export class GetHistoricalDataQueryDto {
  @IsString()
  topicId: string;

  @IsISO8601()
  start: Date;

  @IsISO8601()
  end: Date;
}
