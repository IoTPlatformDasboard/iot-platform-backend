import {
  Injectable,
  Logger,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Widget } from '../common/entities/widget.entity';
import { CreateWidgetBodyDto } from './dto/create-widget.dto';
import { UpdateWidgetBodyDto } from './dto/update-widget.dto';

@Injectable()
export class WidgetsRestApiService {
  private readonly logger = new Logger(WidgetsRestApiService.name);
  constructor(
    @InjectRepository(Widget)
    private readonly widgetRepository: Repository<Widget>,
  ) {}

  async post(body: CreateWidgetBodyDto) {
    try {
      // Create a new widget
      const newWidget = this.widgetRepository.create({
        id: uuidv4(),
        dataSource: body.data_source,
        config: body.config,
      });
      await this.widgetRepository.save(newWidget);

      return {
        message: 'Successfully create widget',
        data: newWidget,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `Failed to create widget: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to create widget, please try again later',
      );
    }
  }

  async get() {
    try {
      const data = await this.widgetRepository.find();

      return {
        message: 'Successfully get widget',
        data,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(`Failed to get widget: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        'Failed to get widget, please try again later',
      );
    }
  }

  async put(widgetId: string, body: UpdateWidgetBodyDto) {
    try {
      // Update the widget
      await this.widgetRepository.update(widgetId, {
        dataSource: body.data_source,
        config: body.config,
      });

      return {
        message: 'Successfully update widget',
        data: body,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `Failed to update widget: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to update widget, please try again later',
      );
    }
  }

  async delete(widgetId: string) {
    try {
      // Check if the widget exists
      const widget = await this.widgetRepository.findOne({
        select: { id: true },
        where: { id: widgetId },
      });
      if (!widget) {
        this.logger.warn(`Failed to delete widget: Widget not found`);
        throw new NotFoundException('Widget not found');
      }

      // Delete the widget
      await this.widgetRepository.delete({ id: widgetId });

      return {
        message: 'Successfully delete widget',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `Failed to delete widget: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to delete widget, please try again later',
      );
    }
  }
}
