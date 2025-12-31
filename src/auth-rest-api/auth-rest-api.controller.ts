import {
  Controller,
  Req,
  Res,
  Body,
  Post,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Request, Response } from 'express';
import { AuthRestApiService } from './auth-rest-api.service';
import * as dto from './dto';

@ApiTags('Auth')
@UseInterceptors(CacheInterceptor)
@Controller('auth')
export class AuthRestApiController {
  constructor(private readonly authRestApiService: AuthRestApiService) {}

  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({
    schema: {
      example: {
        message: 'Successfully login',
        data: {
          access_token: 'xxxxxx',
        },
      },
    },
  })
  @Version('1')
  @Post('login')
  async postLogin(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() postLoginDto: dto.PostLoginDto,
  ) {
    return this.authRestApiService.postLogin(req, res, postLoginDto);
  }

  @ApiOperation({ summary: 'Refreshed token' })
  @ApiOkResponse({
    schema: {
      example: {
        message: 'Token refreshed',
        data: {
          access_token: 'xxxxxx',
        },
      },
    },
  })
  @Version('1')
  @Post('refresh')
  async postRefresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authRestApiService.postRefresh(req, res);
  }

  @ApiOperation({ summary: 'Logout' })
  @ApiOkResponse({
    schema: {
      example: {
        message: 'Successful logout',
      },
    },
  })
  @Version('1')
  @Post('logout')
  async postLogout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authRestApiService.postLogout(req, res);
  }
}
