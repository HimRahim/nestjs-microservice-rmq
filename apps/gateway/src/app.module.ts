import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import {
  APP_FILTER,
  APP_GUARD,
  APP_INTERCEPTOR,
  RouterModule,
} from '@nestjs/core';
import { AllExceptionFilter, LoggerInterceptor } from '@apps/shared';
import { ConfigModule } from '@nestjs/config';
import { GATEWAY_ROUTES } from './config/routing';
import { GatewayGuard } from './guard/gateway.guard';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/gateway/.env',
    }),
    RouterModule.register(GATEWAY_ROUTES),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: GatewayGuard,
    },
  ],
})
export class AppModule {}
