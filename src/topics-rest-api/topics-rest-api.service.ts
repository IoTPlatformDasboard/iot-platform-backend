import {
  Injectable,
  Logger,
  HttpException,
  InternalServerErrorException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Topic } from '../common/entities';
import * as dto from './dto';

@Injectable()
export class TopicsRestApiService {
  private readonly logger = new Logger(TopicsRestApiService.name);
  constructor(
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
  ) {}

  async postTopic(body: dto.PostPutTopicBodyDto) {
    try {
      // Check if the topic name or topic is already taken
      const existingTopic = await this.topicRepository.findOne({
        select: { id: true, name: true, topic: true },
        where: [{ name: body.name }, { topic: body.topic }],
      });

      if (existingTopic) {
        const duplicateField =
          existingTopic.name === body.name ? 'Name' : 'Topic';
        this.logger.warn(
          `Post Create Topic failure: ${duplicateField} already taken`,
        );

        throw new ConflictException(`${duplicateField} is already taken`);
      }

      // Create a new topic
      const newTopic = this.topicRepository.create({
        id: uuidv4(),
        name: body.name,
        description: body.description,
        topic: body.topic,
        is_active: body.is_active,
      });
      await this.topicRepository.save(newTopic);

      return {
        message: 'Successfully create topic',
        data: newTopic,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `Post Topic System Error: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to create topic, please try again later',
      );
    }
  }

  async getTopicList(query: dto.GetTopicListQueryDto) {
    try {
      const { page = 1, limit = 10 } = query;

      // Calculate skip value for pagination
      const skip = (page - 1) * limit;

      // Fetch users with pagination
      const [topics, total] = await this.topicRepository.findAndCount({
        select: {
          id: true,
          name: true,
          description: true,
          topic: true,
          is_active: true,
        },
        take: limit,
        skip: skip,
        order: { name: 'ASC' },
      });

      // Calculate last page
      const lastPage = Math.ceil(total / limit);

      return {
        message: 'Successfully get topic list',
        data: topics,
        meta: {
          total,
          page,
          lastPage,
          limit,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `Get Topic List System Error: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to get topic list, please try again later',
      );
    }
  }

  async putTopic(topicId: string, body: dto.PostPutTopicBodyDto) {
    try {
      // Check if the topic name or topic is already taken
      const existingTopic = await this.topicRepository.findOne({
        select: { id: true, name: true, topic: true },
        where: [{ name: body.name }, { topic: body.topic }],
      });

      if (existingTopic && existingTopic.id !== topicId) {
        const duplicateField =
          existingTopic.name === body.name ? 'Name' : 'Topic';
        this.logger.warn(
          `Post Create Topic failure: ${duplicateField} already taken`,
        );

        throw new ConflictException(`${duplicateField} is already taken`);
      }

      // Update the topic
      await this.topicRepository.update(topicId, {
        name: body.name,
        description: body.description,
        topic: body.topic,
        is_active: body.is_active,
      });

      return {
        message: 'Successfully update topic',
        data: { ...existingTopic, ...body },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `Put Update Topic System Error: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to update topic, please try again later',
      );
    }
  }

  async deleteTopic(topicId: string) {
    try {
      // Check if the topic exists
      const topic = await this.topicRepository.findOne({
        select: { id: true },
        where: { id: topicId },
      });
      if (!topic) {
        this.logger.warn(`Delete Topic failure: Topic not found`);
        throw new NotFoundException('Topic not found');
      }

      // Delete the topic
      await this.topicRepository.delete({ id: topicId });

      return {
        message: 'Successfully delete topic',
        data: {
          id: topic.id,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `Delete Topic System Error: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to delete topic, please try again later',
      );
    }
  }
}
