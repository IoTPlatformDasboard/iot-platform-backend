import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../common/entities';
import { UsersRestApiService } from './users-rest-api.service';
import { UsersRestApiController } from './users-rest-api.controller';
import { AuthRestApiModule } from '../auth-rest-api/auth-rest-api.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthRestApiModule],
  providers: [UsersRestApiService],
  controllers: [UsersRestApiController],
})
export class UsersRestApiModule {}
