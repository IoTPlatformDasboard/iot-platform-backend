import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from '../common/entities/topic.entity';
import { AuthRestApiModule } from '../auth-rest-api/auth-rest-api.module';
import { TopicsRestApiService } from './topics-rest-api.service';
import { TopicsRestApiController } from './topics-rest-api.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Topic]), AuthRestApiModule],
  controllers: [TopicsRestApiController],
  providers: [TopicsRestApiService],
})
export class TopicsRestApiModule {}
