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
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { UsersRestApiService } from './users-rest-api.service';
import { UserRoles } from '../common/decorators/user-roles.decorator';
import { UserRole } from '../common/entities/user.entity';
import { UserRolesGuard } from '../common/guards/user-roles.guard';
import { AccessTokenPayload } from '../common/interfaces/access-token-payload.interface';
import { CreateUserBodyDto } from './dto/create-user.dto';
import { UpdateUserRoleBodyDto } from './dto/update-user-role.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseInterceptors(CacheInterceptor)
@Controller('users')
export class UsersRestApiController {
  constructor(private readonly usersRestApiService: UsersRestApiService) {}

  @ApiOperation({ summary: 'Get role list' })
  @ApiOkResponse({
    schema: {
      example: {
        message: 'Successfully get role list',
        data: ['Admin', 'Operator', 'Viewer'],
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
        message: 'Successfully create user',
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
  @Post('')
  async post(@Body() body: CreateUserBodyDto) {
    return this.usersRestApiService.post(body);
  }

  @ApiOperation({ summary: 'Get user list' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
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
  @Get('list')
  async getList(@Query() query: PaginationQueryDto) {
    return this.usersRestApiService.getList(query);
  }

  @ApiOperation({ summary: 'Update user role' })
  @ApiOkResponse({
    schema: {
      example: {
        message: 'Successfully update user role',
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
  @Patch('role/:userId')
  async patchRole(
    @Req() request: AccessTokenPayload,
    @Body() body: UpdateUserRoleBodyDto,
  ) {
    return this.usersRestApiService.patchRole(
      request.sub,
      request.params.userId,
      body,
    );
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiOkResponse({
    schema: {
      example: {
        message: 'Successfully delete user',
      },
    },
  })
  @Version('1')
  @UseGuards(UserRolesGuard)
  @UserRoles(UserRole.ADMIN)
  @Delete(':userId')
  async delete(@Req() request: AccessTokenPayload) {
    return this.usersRestApiService.delete(request.sub, request.params.userId);
  }
}
