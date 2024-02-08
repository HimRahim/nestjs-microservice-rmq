import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  DatabaseModule,
  LoggerInterceptor,
  MicroserviceExceptionsFilter,
} from '@apps/shared';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ProductController } from './modules/product/product.controller';
import { ProductService } from './modules/product/product.service';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/product/.env',
    }),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: APP_FILTER,
      useClass: MicroserviceExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
  ],
})
export class ProductModule {}
