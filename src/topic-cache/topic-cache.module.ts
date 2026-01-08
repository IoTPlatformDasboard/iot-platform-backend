import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicCacheService } from './topic-cache.service';
import { Topic } from 'src/common/entities/topic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Topic])],
  providers: [TopicCacheService],
  exports: [TopicCacheService],
})
export class TopicCacheModule {}
