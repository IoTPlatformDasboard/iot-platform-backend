import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topic } from '../common/entities/topic.entity';

@Injectable()
export class TopicCacheService implements OnModuleInit {
  private readonly logger = new Logger(TopicCacheService.name);
  private readonly topics = new Map<string, string>();
  private isReady = false;

  constructor(
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
  ) {}

  async onModuleInit() {
    await this.load();
    this.logger.log('Topic cache is ready');
    this.isReady = true;
  }

  async load(): Promise<void> {
    try {
      const topics = await this.topicRepository.find({
        select: { id: true, topic: true, is_active: true },
      });

      this.topics.clear();

      topics.forEach((t) => {
        if (!t.is_active) return;
        this.topics.set(t.topic, t.id);
      });

      this.logger.log(`Successfully loaded topics into cache`);
    } catch (error) {
      this.logger.error(
        'Failed to load topics into cache: ',
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  add(topic: string, id: string): void {
    try {
      this.topics.set(topic, id);
      this.logger.debug(`Successfully added topic to cache: ${topic}`);
    } catch (error) {
      this.logger.error(
        'Failed to add topic into cache: ',
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  remove(topic: string): void {
    try {
      this.topics.delete(topic);
      this.logger.debug(`Successfully removed topic from cache: ${topic}`);
    } catch (error) {
      this.logger.error(
        'Failed to remove topic from cache: ',
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  getId(topic: string): string | undefined {
    try {
      return this.topics.get(topic);
    } catch (error) {
      this.logger.error(
        'Failed to get topic id from cache: ',
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }
}
