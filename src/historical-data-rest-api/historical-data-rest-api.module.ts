import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoricalDataRestApiService } from './historical-data-rest-api.service';
import { HistoricalDataRestApiController } from './historical-data-rest-api.controller';
import { Telemetry } from '../common/entities/telemetry.entity';
import { Topic } from '../common/entities/topic.entity';
import { AuthRestApiModule } from '../auth-rest-api/auth-rest-api.module';

@Module({
  imports: [TypeOrmModule.forFeature([Telemetry, Topic]), AuthRestApiModule],
  controllers: [HistoricalDataRestApiController],
  providers: [HistoricalDataRestApiService],
})
export class HistoricalDataRestApiModule {}
