import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Settings } from 'luxon';
import { AuthModule } from './auth.module';
async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);
  const port = configService.get('AUTH_PORT');

  Settings.defaultZone = 'Asia/Bangkok';
  Settings.defaultLocale = 'th-TH';

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.RMQ,
      options: {
        urls: [`${configService.get('RABBIT_MQ_URI')}`],
        queue: `${configService.get('RABBIT_MQ_QUEUE')}`,
        queueOptions: {
          durable: false,
        },
      },
    },
    { inheritAppConfig: true },
  );

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  await app.startAllMicroservices();

  try {
    await app.listen(port, async () => {
      console.log(`Auth Service is Running on port ${await app.getUrl()}`);
    });
  } catch (error) {
    console.log(error);
  }
}
bootstrap();
