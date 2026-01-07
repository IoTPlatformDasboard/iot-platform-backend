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
import { Widget, WidgetType } from '../common/entities/widget.entity';
import { CreateWidgetBodyDto } from './dto/create-widget.dto';
import { UpdateWidgetBodyDto } from './dto/update-widget.dto';

@Injectable()
export class WidgetsRestApiService {
  private readonly logger = new Logger(WidgetsRestApiService.name);
  constructor(
    @InjectRepository(Widget)
    private readonly widgetRepository: Repository<Widget>,
  ) {}

  async getTypeList() {
    try {
      return {
        message: 'Successfully get widget type list',
        data: Object.values(WidgetType),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `Get Type List System Error: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to get widget type list, please try again later',
      );
    }
  }

  async post(body: CreateWidgetBodyDto) {
    try {
      // Create a new widget
      const newWidget = this.widgetRepository.create({
        id: uuidv4(),
        title: body.title,
        type: body.type,
        data_source: body.data_source,
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
        `Post Widget System Error: ${error.message}`,
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

      this.logger.error(
        `Get Widget System Error: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to get widget, please try again later',
      );
    }
  }

  async put(widgetId: string, body: UpdateWidgetBodyDto) {
    try {
      // Update the widget
      await this.widgetRepository.update(widgetId, {
        title: body.title,
        type: body.type,
        data_source: body.data_source,
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
        `Put Widget System Error: ${error.message}`,
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
        this.logger.warn(`Delete Widget failure: Widget not found`);
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
        `Delete Widget System Error: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to delete widget, please try again later',
      );
    }
  }
}
