import {
  Controller,
  UseInterceptors,
  Version,
  Req,
  Post,
  Get,
  Put,
  Delete,
  Query,
  Body,
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
import { TopicsRestApiService } from './topics-rest-api.service';
import { CreateTopicBodyDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';
import { AccessTokenPayload } from '../common/interfaces/access-token-payload.interface';
import { UserRolesGuard } from '../common/guards/user-roles.guard';
import { UserRoles } from '../common/decorators/user-roles.decorator';
import { UserRole } from '../common/entities/user.entity';

@ApiTags('Topics')
@ApiBearerAuth()
@UseInterceptors(CacheInterceptor)
@Controller('topics')
export class TopicsRestApiController {
  constructor(private readonly topicsRestApiService: TopicsRestApiService) {}

  @ApiOperation({ summary: 'Create topic' })
  @ApiOkResponse({
    schema: {
      example: {
        message: 'Successfully create topic',
        data: {
          name: 'topic_name',
          description: 'This is a description of the topic',
          topic: 'topic',
          is_active: true,
        },
      },
    },
  })
  @Version('1')
  @UseGuards(UserRolesGuard)
  @UserRoles(UserRole.OPERATOR)
  @Post('')
  async post(@Body() body: CreateTopicBodyDto) {
    return this.topicsRestApiService.post(body);
  }

  @ApiOperation({ summary: 'Get topic list' })
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
        message: 'Successfully get topic list',
        data: [
          {
            id: 'xxxx-xxxx-xxxx-xxxx',
            name: 'topic_name',
            description: 'This is a description of the topic',
            topic: 'topic',
            is_active: true,
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
  @UserRoles(UserRole.VIEWER)
  @Get('list')
  async getList(@Query() query: PaginationQueryDto) {
    return this.topicsRestApiService.getList(query);
  }

  @ApiOperation({ summary: 'Update topic' })
  @ApiOkResponse({
    schema: {
      example: {
        message: 'Successfully update topic',
        data: {
          name: 'topic_name',
          description: 'This is a description of the topic',
          topic: 'topic',
          is_active: true,
        },
      },
    },
  })
  @Version('1')
  @UseGuards(UserRolesGuard)
  @UserRoles(UserRole.OPERATOR)
  @Put(':topicId')
  async put(@Req() request: AccessTokenPayload, @Body() body: UpdateTopicDto) {
    return this.topicsRestApiService.put(request.params.topicId, body);
  }

  @ApiOperation({ summary: 'Delete topic' })
  @ApiOkResponse({
    schema: {
      example: {
        message: 'Successfully delete topic',
      },
    },
  })
  @Version('1')
  @UseGuards(UserRolesGuard)
  @UserRoles(UserRole.OPERATOR)
  @Delete(':topicId')
  async delete(@Req() request: AccessTokenPayload) {
    return this.topicsRestApiService.delete(request.params.topicId);
  }

  @ApiOperation({ summary: 'Get topic lookup' })
  @ApiOkResponse({
    schema: {
      example: {
        message: 'Successfully get topic lookup',
        data: [
          {
            id: '25997702-c6e7-4111-b089-e805dea790f1',
            topic: 'auth-code/60de5684-505a-479f-a894-187a9500a3c4',
          },
        ],
      },
    },
  })
  @Version('1')
  @UseGuards(UserRolesGuard)
  @UserRoles(UserRole.VIEWER)
  @Get('lookup')
  async getLookup() {
    return this.topicsRestApiService.getLookup();
  }
}
