import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsRestApiService } from './organizations-rest-api.service';
import { OrganizationsRestApiController } from './organizations-rest-api.controller';
import { AuthRestApiModule } from 'src/auth-rest-api/auth-rest-api.module';
import { User, UserNotification, Organization, OrganizationMember } from '../common/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserNotification, Organization, OrganizationMember]),
    AuthRestApiModule,
  ],
  providers: [OrganizationsRestApiService],
  controllers: [OrganizationsRestApiController],
})
export class OrganizationsRestApiModule {}
