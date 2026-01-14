import {
  Injectable,
  Logger,
  HttpException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Telemetry } from 'src/common/entities/telemetry.entity';
import { Topic } from 'src/common/entities/topic.entity';
import { GetHistoricalDataQueryDto } from './dto/get-historical-data.dto';

@Injectable()
export class HistoricalDataRestApiService {
  private readonly logger = new Logger(HistoricalDataRestApiService.name);
  constructor(
    @InjectRepository(Telemetry)
    private readonly telemetryRepository: Repository<Telemetry>,
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
  ) {}

  async get(query: GetHistoricalDataQueryDto) {
    try {
      const { topicId, start, end } = query;

      // Validate topic
      const topic = await this.topicRepository.findOne({
        select: { id: true },
        where: { id: topicId },
      });
      if (!topic) {
        throw new BadRequestException('Topic not found');
      }

      // Validate query
      if (start > end) {
        throw new BadRequestException(
          'start date must be earlier than end date',
        );
      }

      // Get historical data
      const telemetry = await this.telemetryRepository.find({
        select: {
          payload: {},
          createdAt: true,
        },
        where: {
          topicId,
          createdAt: Between(start, end),
        },
        order: {
          createdAt: 'ASC',
        },
      });

      return {
        message: 'Successfully get historical data',
        data: telemetry,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `Failed to get historical data: ${error.message}`,
        error.stack,
      );

      throw new InternalServerErrorException(
        'Failed to get historical data, please try again later',
      );
    }
  }
}
