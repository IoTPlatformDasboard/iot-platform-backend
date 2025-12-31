import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { User, RefreshToken } from '../common/entities';
import { AuthRestApiService } from './auth-rest-api.service';
import { AuthRestApiController } from './auth-rest-api.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: '15m',
        },
      }),
    }),
  ],
  providers: [AuthRestApiService],
  controllers: [AuthRestApiController],
  exports: [JwtModule],
})
export class AuthRestApiModule {}
