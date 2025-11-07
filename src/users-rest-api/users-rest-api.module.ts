import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthRestApiModule } from 'src/auth-rest-api/auth-rest-api.module';
import { User } from '../common/entities';
import { UsersRestApiService } from './users-rest-api.service';
import { UsersRestApiController } from './users-rest-api.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthRestApiModule,
  ],
  controllers: [UsersRestApiController],
  providers: [UsersRestApiService],
})
export class UsersRestApiModule { }
