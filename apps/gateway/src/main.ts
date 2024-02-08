import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { Settings } from 'luxon';
dotenv.config();

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  const port = configService.get('GATEWAY_PORT');
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  Settings.defaultZone = 'Asia/Bangkok';
  Settings.defaultLocale = 'th-TH';
  try {
    await app.listen(port, async () => {
      logger.log(`Gateway is Running on ${await app.getUrl()}`);
    });
  } catch (error) {
    logger.error(error);
  }
}
bootstrap();
