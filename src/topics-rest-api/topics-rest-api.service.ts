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
import { Topic } from '../common/entities/topic.entity';
import { CreateTopicBodyDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';
import { TopicCacheService } from 'src/topic-cache/topic-cache.service';

@Injectable()
export class TopicsRestApiService {
  private readonly logger = new Logger(TopicsRestApiService.name);
  constructor(
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
    private readonly topicCacheService: TopicCacheService,
  ) {}

  async post(body: CreateTopicBodyDto) {
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
          `Failed to create topic: ${duplicateField} already taken`,
        );

        throw new ConflictException(`${duplicateField} is already taken`);
      }

      // Create a new topic
      const newTopic = this.topicRepository.create({
        id: uuidv4(),
        name: body.name,
        description: body.description,
        topic: body.topic,
        isActive: body.is_active,
      });
      await this.topicRepository.save(newTopic);

      // Add topic to cache
      if (body.is_active) {
        this.topicCacheService.add(newTopic.topic, newTopic.id);
      }

      const data = {
        id: newTopic.id,
        name: newTopic.name,
        description: newTopic.description,
        topic: newTopic.topic,
        is_active: newTopic.isActive,
      };

      return {
        message: 'Successfully create topic',
        data,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `Failed to create topic: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to create topic, please try again later',
      );
    }
  }

  async getList(query: PaginationQueryDto) {
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
          isActive: true,
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
        `Failed to get topic list: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to get topic list, please try again later',
      );
    }
  }

  async put(topicId: string, body: UpdateTopicDto) {
    try {
      // Check if the topic exists
      const existingTopic = await this.topicRepository.findOne({
        select: { id: true },
        where: { id: topicId },
      });
      if (!existingTopic) {
        this.logger.warn(
          `Failed to update topic: Topic not found by id: ${topicId}`,
        );
        throw new NotFoundException('Topic not found');
      }

      // Check if the topic name or topic is already taken
      const duplicateName = await this.topicRepository.findOne({
        select: { id: true },
        where: {
          name: body.name,
        },
      });
      const duplicateTopic = await this.topicRepository.findOne({
        select: { id: true },
        where: {
          topic: body.topic,
        },
      });
      if (duplicateName && duplicateName.id !== topicId) {
        this.logger.warn('Failed to update topic: Name already taken');
        throw new ConflictException('Name is already taken');
      }
      if (duplicateTopic && duplicateTopic.id !== topicId) {
        this.logger.warn('Failed to update topic: Topic already taken');
        throw new ConflictException('Topic is already taken');
      }

      // Update the topic
      await this.topicRepository.update(topicId, {
        name: body.name,
        description: body.description,
        topic: body.topic,
        isActive: body.is_active,
      });

      // Update topic in cache
      this.topicCacheService.remove(body.topic);
      if (body.is_active) {
        this.topicCacheService.add(body.topic, topicId);
      }

      return {
        message: 'Successfully update topic',
        data: body,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `Failed to update topic: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to update topic, please try again later',
      );
    }
  }

  async delete(topicId: string) {
    try {
      // Check if the topic exists
      const topic = await this.topicRepository.findOne({
        select: { id: true },
        where: { id: topicId },
      });
      if (!topic) {
        this.logger.warn(`Failed to delete topic: Topic not found`);
        throw new NotFoundException('Topic not found');
      }

      // Delete the topic
      await this.topicRepository.delete({ id: topicId });

      // Remove topic from cache
      this.topicCacheService.remove(topic.topic);

      return {
        message: 'Successfully delete topic',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `Failed to delete topic: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to delete topic, please try again later',
      );
    }
  }

  async getLookup() {
    try {
      const topics = await this.topicRepository.find({
        select: { id: true, name: true, topic: true },
        order: { topic: 'ASC' },
      });
      return {
        message: 'Successfully get topic lookup',
        data: topics,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `Failed to get topic lookup: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to get topic lookup, please try again later',
      );
    }
  }
}
