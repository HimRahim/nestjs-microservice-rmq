import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './module/database/database.module';
import { LoggerInterceptor, MicroserviceExceptionsFilter } from '@apps/shared';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './module/auth/auth.controller';
import { AuthService } from './module/auth/auth.service';
import { UserService } from './module/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AUTH_DATASOURCE } from './config/constant';
import { UserEntity } from './model/entity/user/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/auth/.env',
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([UserEntity], AUTH_DATASOURCE),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_TOKEN_SECRET'),
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    ConfigService,
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
export class AuthModule {}
