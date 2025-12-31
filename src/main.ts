import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger, VersioningType } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('Bootstrap');

  // 1. Security & Middleware Configuration
  app.use(helmet());
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.use(cookieParser());

  // 2. View Engine
  app.setBaseViewsDir(join(__dirname, '..', 'src', 'common', 'views'));
  app.setViewEngine('hbs');

  // 3. Routing Configuration
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // 4. Global Interceptors/Pipes/Filters
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  // 5. Swagger
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('API Documentation for Application')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document, {
      customSiteTitle: 'API Documentation',
    });

    const port = process.env.PORT ?? 3000;
    logger.log(
      `📄 Swagger API Docs are available at: http://localhost:${port}/api-docs`,
    );
  }

  // 6. Start Server
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`🚀 Application is running on port ${port}`);
}
bootstrap();
