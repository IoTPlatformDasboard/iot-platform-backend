import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { User, VerifyEmailToken, ResetPasswordToken } from '../common/entities';
import { AuthRestApiService } from './auth-rest-api.service';
import { AuthRestApiController } from './auth-rest-api.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, VerifyEmailToken, ResetPasswordToken]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'default_secret'),
        signOptions: { expiresIn: '30d' }
      }),
    }),
  ],
  providers: [AuthRestApiService],
  controllers: [AuthRestApiController],
  exports: [JwtModule],
})
export class AuthRestApiModule {}
