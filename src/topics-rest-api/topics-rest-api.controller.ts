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
} from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { TopicsRestApiService } from './topics-rest-api.service';
import * as dto from './dto';
import AccessTokenPayload from '../common/interfaces/access-token-payload.interface';
import { UserRolesGuard } from '../common/guards/user-roles.guard';
import { UserRoles } from '../common/decorators/user-roles.decorator';
import { UserRole } from '../common/entities';

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
  async postRefresh(@Body() body: dto.PostPutTopicBodyDto) {
    return this.topicsRestApiService.postTopic(body);
  }

  @ApiOperation({ summary: 'Get topic list' })
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
  @Get('topic-list')
  async getTopicList(@Query() query: dto.GetTopicListQueryDto) {
    return this.topicsRestApiService.getTopicList(query);
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
  async putUpdateTopic(
    @Req() request: AccessTokenPayload,
    @Body() body: dto.PostPutTopicBodyDto,
  ) {
    return this.topicsRestApiService.putTopic(request.params.topicId, body);
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
  async deleteTopic(@Req() request: AccessTokenPayload) {
    return this.topicsRestApiService.deleteTopic(request.params.topicId);
  }
}
