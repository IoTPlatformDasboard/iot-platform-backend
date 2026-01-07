import {
  Controller,
  UseInterceptors,
  Version,
  Post,
  Get,
  Put,
  Delete,
  Req,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { WidgetsRestApiService } from './widgets-rest-api.service';
import { CreateWidgetBodyDto } from './dto/create-widget.dto';
import { UpdateWidgetBodyDto } from './dto/update-widget.dto';
import { UserRolesGuard } from '../common/guards/user-roles.guard';
import { UserRoles } from '../common/decorators/user-roles.decorator';
import { UserRole } from '../common/entities/user.entity';
import { AccessTokenPayload } from '../common/interfaces/access-token-payload.interface';

@ApiTags('Widgets')
@ApiBearerAuth()
@UseInterceptors(CacheInterceptor)
@Controller('widgets')
export class WidgetsRestApiController {
  constructor(private readonly widgetsRestApiService: WidgetsRestApiService) {}

  @ApiOperation({ summary: 'Get widget type list' })
  @ApiOkResponse({
    schema: {
      example: {
        message: 'Successfully get widget type list',
        data: ['BOARD', 'CHART', 'GAUGE'],
      },
    },
  })
  @Version('1')
  @UseGuards(UserRolesGuard)
  @UserRoles(UserRole.OPERATOR)
  @Get('type-list')
  async getTypeList() {
    return this.widgetsRestApiService.getTypeList();
  }

  @ApiOperation({ summary: 'Create widget' })
  @ApiOkResponse({
    schema: {
      example: {
        message: 'Successfully create widget',
        data: {
          id: 'xxxx-xxxx-xxxx-xxxx',
          title: 'widget_title',
          type: 'BOARD',
          data_source: {
            topic: 'topic',
            key: 'key',
          },
          config: {},
        },
      },
    },
  })
  @Version('1')
  @UseGuards(UserRolesGuard)
  @UserRoles(UserRole.OPERATOR)
  @Post('')
  async post(@Body() body: CreateWidgetBodyDto) {
    return this.widgetsRestApiService.post(body);
  }

  @ApiOperation({ summary: 'Get widgets' })
  @ApiOkResponse({
    schema: {
      example: {
        message: 'Successfully get widgets',
        data: [
          {
            id: 'xxxx-xxxx-xxxx-xxxx',
            title: 'widget_title',
            type: 'board',
            data_source: {
              topic: 'topic',
              key: 'key',
            },
            config: {},
          },
        ],
      },
    },
  })
  @Version('1')
  @UseGuards(UserRolesGuard)
  @UserRoles(UserRole.VIEWER)
  @Get('')
  async get() {
    return this.widgetsRestApiService.get();
  }

  @ApiOperation({ summary: 'Update widget' })
  @ApiOkResponse({
    schema: {
      example: {
        message: 'Successfully update widget',
        data: {
          id: 'xxxx-xxxx-xxxx-xxxx',
          title: 'updated_widget_title',
          type: 'board',
          data_source: {
            topic: 'topic',
            key: 'key',
          },
          config: {},
        },
      },
    },
  })
  @Version('1')
  @UseGuards(UserRolesGuard)
  @UserRoles(UserRole.OPERATOR)
  @Put(':widgetId')
  async put(
    @Req() request: AccessTokenPayload,
    @Body() body: UpdateWidgetBodyDto,
  ) {
    return this.widgetsRestApiService.put(request.params.widgetId, body);
  }

  @ApiOperation({ summary: 'Delete widget' })
  @ApiOkResponse({
    schema: {
      example: {
        message: 'Successfully delete widget',
      },
    },
  })
  @Version('1')
  @UseGuards(UserRolesGuard)
  @UserRoles(UserRole.OPERATOR)
  @Delete(':widgetId')
  async delete(@Req() request: AccessTokenPayload) {
    return this.widgetsRestApiService.delete(request.params.widgetId);
  }
}
