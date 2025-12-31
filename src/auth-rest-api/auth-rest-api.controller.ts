import {
  Controller,
  Req,
  Res,
  Body,
  Post,
  Get,
  UseInterceptors,
  Version,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Request, Response } from 'express';
import { AuthRestApiService } from './auth-rest-api.service';
import * as dto from './dto';
import AccessTokenPayload from '../common/interfaces/access-token-payload.interface';
import { UserRoles } from '../common/decorators/user-roles.decorator';
import { UserRole } from '../common/entities';
import { UserRolesGuard } from '../common/guards/user-roles.guard';

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

  @ApiOperation({ summary: 'Get profile' })
  @ApiOkResponse({
    schema: {
      example: {
        message: 'Successfully get profile',
        user: {
          username: 'user.username',
          role: 'user.role',
        },
      },
    },
  })
  @Version('1')
  @UseGuards(UserRolesGuard)
  @UserRoles(UserRole.VIEWER)
  @Get('profile')
  async getProfile(@Req() request: AccessTokenPayload) {
    return this.authRestApiService.getProfile(request.sub);
  }

  @ApiOperation({ summary: 'Update username' })
  @ApiOkResponse({
    schema: {
      example: {
        message: 'Successfully updated username',
        data: {
          user: {
            username: 'new_username',
          },
        },
      },
    },
  })
  @Version('1')
  @UseGuards(UserRolesGuard)
  @UserRoles(UserRole.VIEWER)
  @Patch('username')
  async patchUsername(
    @Req() request: AccessTokenPayload,
    @Body() body: dto.PatchUsernameDto,
  ) {
    return this.authRestApiService.patchUsername(request.sub, body);
  }

  @ApiOperation({ summary: 'Update password' })
  @ApiOkResponse({
    schema: {
      example: {
        message: 'Successfully updated password',
      },
    },
  })
  @Version('1')
  @UseGuards(UserRolesGuard)
  @UserRoles(UserRole.VIEWER)
  @Patch('password')
  async patchPassword(
    @Req() request: AccessTokenPayload,
    @Body() body: dto.PatchPasswordDto,
  ) {
    return this.authRestApiService.patchPassword(request.sub, body);
  }
}
