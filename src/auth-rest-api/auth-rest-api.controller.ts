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
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Request, Response } from 'express';
import { AuthRestApiService } from './auth-rest-api.service';
import { AccessTokenPayload } from '../common/interfaces/access-token-payload.interface';
import { UserRoles } from '../common/decorators/user-roles.decorator';
import { UserRole } from '../common/entities/user.entity';
import { UserRolesGuard } from '../common/guards/user-roles.guard';
import { LoginBodyDto } from './dto/login.dto';
import { UpdateUsernameBodyDto } from './dto/update-username.dto';
import { UpdatePasswordBodyDto } from './dto/update-password.dto';

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
          accessToken: 'xxxxxx',
        },
      },
    },
  })
  @Version('1')
  @Post('login')
  async postLogin(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body: LoginBodyDto,
  ) {
    return this.authRestApiService.postLogin(req, res, body);
  }

  @ApiOperation({ summary: 'Refreshed token' })
  @ApiOkResponse({
    schema: {
      example: {
        message: 'Successfully refreshed token',
        data: {
          accessToken: 'xxxxxx',
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
  @ApiBearerAuth()
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
  @ApiBearerAuth()
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
    @Body() body: UpdateUsernameBodyDto,
  ) {
    return this.authRestApiService.patchUsername(request.sub, body);
  }

  @ApiOperation({ summary: 'Update password' })
  @ApiBearerAuth()
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
    @Body() body: UpdatePasswordBodyDto,
  ) {
    return this.authRestApiService.patchPassword(request.sub, body);
  }
}
