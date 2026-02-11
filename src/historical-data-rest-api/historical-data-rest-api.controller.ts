import {
  Controller,
  UseInterceptors,
  Get,
  UseGuards,
  Query,
  Version,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { HistoricalDataRestApiService } from './historical-data-rest-api.service';
import { UserRolesGuard } from '../common/guards/user-roles.guard';
import { UserRoles } from '../common/decorators/user-roles.decorator';
import { UserRole } from '../common/entities/user.entity';
import { GetHistoricalDataQueryDto } from './dto/get-historical-data.dto';

@ApiTags('Historical Data')
@ApiBearerAuth()
@UseInterceptors(CacheInterceptor)
@Controller('historical-data')
export class HistoricalDataRestApiController {
  constructor(
    private readonly historicalDataRestApiService: HistoricalDataRestApiService,
  ) {}

  @ApiOperation({ summary: 'Get historical data' })
  @ApiQuery({
    name: 'topicId',
    required: true,
    type: String,
  })
  @ApiQuery({
    name: 'start',
    required: true,
    type: String,
    example: '2025-01-01T00:00:00Z',
  })
  @ApiQuery({
    name: 'end',
    required: true,
    type: String,
    example: '2025-01-02T00:00:00Z',
  })
  @ApiOkResponse({
    schema: {
      example: {
        message: 'Successfully get historical data',
        data: [
          {
            payload: {
              V1: 24.7,
              V2: 186,
              V3: 5.3,
              V4: 0.501,
            },
            created_at: '2026-01-14T04:06:15.856Z',
          },
        ],
      },
    },
  })
  @Version('1')
  @UseGuards(UserRolesGuard)
  @UserRoles(UserRole.VIEWER)
  @Get()
  async get(@Query() query: GetHistoricalDataQueryDto) {
    return this.historicalDataRestApiService.get(query);
  }
}
