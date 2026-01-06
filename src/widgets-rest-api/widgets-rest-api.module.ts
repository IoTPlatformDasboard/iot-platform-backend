import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WidgetsRestApiService } from './widgets-rest-api.service';
import { WidgetsRestApiController } from './widgets-rest-api.controller';
import { Widget } from '../common/entities';
import { AuthRestApiModule } from '../auth-rest-api/auth-rest-api.module';

@Module({
  imports: [TypeOrmModule.forFeature([Widget]), AuthRestApiModule],
  controllers: [WidgetsRestApiController],
  providers: [WidgetsRestApiService],
})
export class WidgetsRestApiModule {}
