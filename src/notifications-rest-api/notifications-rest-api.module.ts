import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsRestApiService } from './notifications-rest-api.service';
import { NotificationsRestApiController } from './notifications-rest-api.controller';
import { AuthRestApiModule } from 'src/auth-rest-api/auth-rest-api.module';
import { UserNotification } from '../common/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserNotification]),
    AuthRestApiModule
  ],
  controllers: [NotificationsRestApiController],
  providers: [NotificationsRestApiService],
})
export class NotificationsRestApiModule {}
