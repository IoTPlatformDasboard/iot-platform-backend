import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevicesRestApiService } from './devices-rest-api.service';
import { DevicesRestApiController } from './devices-rest-api.controller';
import { AuthRestApiModule } from 'src/auth-rest-api/auth-rest-api.module';
import { Organization, OrganizationMember, Device, WidgetBox, DeviceData, NotificationEvent } from '../common/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization, OrganizationMember, Device, WidgetBox, DeviceData, NotificationEvent]),
    AuthRestApiModule
  ],
  controllers: [DevicesRestApiController],
  providers: [DevicesRestApiService],
})
export class DevicesRestApiModule {}
