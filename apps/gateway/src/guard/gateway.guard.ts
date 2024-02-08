import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { lastValueFrom } from 'rxjs';
import { Request } from 'express';
import { ClientProxy } from '@nestjs/microservices';
import { TokenDto } from '@apps/shared';
import { AuthResDto } from '@apps/shared/model/dto/auth/auth-response.dto';

@Injectable()
export class GatewayGuard implements CanActivate, OnModuleInit {
  constructor(
    @Inject('AUTH_MICROSERVICE') private readonly authClient: ClientProxy,
    private readonly reflector: Reflector,
  ) {}

  async onModuleInit() {
    await this.authClient.connect();
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublicApi: boolean = this.reflector.get(
      'isPublic',
      ctx.getHandler(),
    );
    if (isPublicApi) {
      return true;
    }
    const req: Request = ctx.switchToHttp().getRequest();
    const token = this.extractToken(req);
    if (!token) {
      throw new UnauthorizedException('No authorization token');
    }
    const authRes: AuthResDto = await lastValueFrom(
      this.authClient.send('validate_token', token),
    );
    if (!authRes.user) {
      throw new UnauthorizedException('User not foud');
    }
    ctx.switchToHttp().getRequest().user = authRes.user;
    if (authRes.token) {
      ctx.switchToHttp().getRequest().newToken = authRes.token;
    }
    return true;
  }

  private extractToken(req: Request): TokenDto | undefined {
    const accessToken = req.headers.authorization?.split(' ')[1] ?? undefined;
    const refreshToken =
      (req.headers.refreshToken as string) ??
      (req.headers.refreshtoken as string);
    if (
      !accessToken ||
      accessToken.length == 0 ||
      !refreshToken ||
      refreshToken.length == 0
    ) {
      return undefined;
    }
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}
