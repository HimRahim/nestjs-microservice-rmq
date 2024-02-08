import { CreateUserDto } from '@apps/shared';
import { LoginDto } from '@apps/shared/model/dto/auth/login.dto';
import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('AUTH_MICROSERVICE') private readonly authClient: ClientProxy,
  ) {}
  async onModuleInit() {
    await this.authClient.connect();
  }
  onModuleDestroy() {
    this.authClient.close();
  }
  async createUser(user: CreateUserDto) {
    return lastValueFrom(this.authClient.send('create_user', user));
  }
  async login(loginData: LoginDto) {
    // this.authService.send('login', loginData);
    return lastValueFrom(this.authClient.send('login', loginData));
  }
}
