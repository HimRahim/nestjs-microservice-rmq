import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ProductModule } from './product.module';

async function bootstrap() {
  const app = await NestFactory.create(ProductModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PRODUCT_PORT');

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.RMQ,
      options: {
        urls: [`${configService.get('RABBIT_MQ_URI')}`],
        queue: configService.get('RABBIT_MQ_QUEUE'),
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
