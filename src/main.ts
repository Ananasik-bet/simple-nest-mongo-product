import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as CookieParser from 'cookie-parser';

async function start() {
  const logger = new Logger('NestApplication');

  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = config.get('API_PORT');

  const options = new DocumentBuilder()
    .setTitle('Test API')
    .setDescription('A simple nest REST API for products with JWT auth.')
    .setVersion('1.0.0')
    .addServer(`http://localhost:${port}/api/`, 'Local environment')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api/docs', app, document);

  app.use(CookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api/');
  app.enableCors();

  await app.listen(port, () =>
    logger.log(`Nest application successfully started on port ${port}.`),
  );
}

start();
