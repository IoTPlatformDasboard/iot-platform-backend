import {
  Controller,
  Req,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Query,
  UseInterceptors,
  Version,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { UsersRestApiService } from './users-rest-api.service';
import { UserRoles } from '../common/decorators/user-roles.decorator';
import { UserRole } from '../common/entities';
import { UserRolesGuard } from '../common/guards/user-roles.guard';
import * as dto from './dto';
import AccessTokenPayload from '../common/interfaces/access-token-payload.interface';

@ApiTags('Users')
@UseInterceptors(CacheInterceptor)
@Controller('users')
export class UsersRestApiController {
  constructor(private readonly usersRestApiService: UsersRestApiService) {}

  @ApiOperation({ summary: 'Get role list' })
  @ApiOkResponse({
    schema: {
      example: {
        message: 'Successfully get role list',
        data: [
          { role: 'ADMIN', description: 'Admin' },
          { role: 'OPERATOR', description: 'Operator' },
          { role: 'VIEWER', description: 'Viewer' },
        ],
      },
    },
  })
  @Version('1')
  @UseGuards(UserRolesGuard)
  @UserRoles(UserRole.ADMIN)
  @Get('role-list')
  async getRoleList() {
    return this.usersRestApiService.getRoleList();
  }

  @ApiOperation({ summary: 'Create user' })
  @ApiOkResponse({
    schema: {
      example: {
        message: 'User created successfully',
        data: {
          id: 'xxxx-xxxx-xxxx-xxxx',
          username: 'username',
          role: 'OPERATOR',
        },
      },
    },
  })
  @Version('1')
  @UseGuards(UserRolesGuard)
  @UserRoles(UserRole.ADMIN)
  @Post('create-user')
  async postCreateUser(@Body() body: dto.PostCreateUserBodyDto) {
    return this.usersRestApiService.postCreateUser(body);
  }

  @ApiOperation({ summary: 'Get user list' })
  @ApiOkResponse({
    schema: {
      example: {
        message: 'Successfully get user list',
        data: [
          {
            id: 'xxxx-xxxx-xxxx-xxxx',
            username: 'username',
            role: 'OPERATOR',
          },
        ],
        meta: {
          total: 1,
          page: 1,
          lastPage: 1,
          limit: 10,
        },
      },
    },
  })
  @Version('1')
  @UseGuards(UserRolesGuard)
  @UserRoles(UserRole.ADMIN)
  @Get('user-list')
  async getUserList(@Query() query: dto.GetUserListQueryDto) {
    return this.usersRestApiService.getUserList(query);
  }

  @ApiOperation({ summary: 'Patch user role' })
  @ApiOkResponse({
    schema: {
      example: {
        message: 'User role updated successfully',
        data: {
          id: 'xxxx-xxxx-xxxx-xxxx',
          username: 'username',
          role: 'OPERATOR',
        },
      },
    },
  })
  @Version('1')
  @UseGuards(UserRolesGuard)
  @UserRoles(UserRole.ADMIN)
  @Patch('user-role/:userId')
  async patchUserRole(
    @Req() request: AccessTokenPayload,
    @Body() body: dto.PatchUserRoleBodyDto,
  ) {
    return this.usersRestApiService.patchUserRole(
      request.sub,
      request.params.userId,
      body,
    );
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiOkResponse({
    schema: {
      example: {
        message: 'User deleted successfully',
      },
    },
  })
  @Version('1')
  @UseGuards(UserRolesGuard)
  @UserRoles(UserRole.ADMIN)
  @Delete(':userId')
  async deleteUser(@Req() request: AccessTokenPayload) {
    return this.usersRestApiService.deleteUser(
      request.sub,
      request.params.userId,
    );
  }
}
