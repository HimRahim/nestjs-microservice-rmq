import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, TokenDto } from '@apps/shared';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoginDto } from '@apps/shared';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('create_user')
  async signup(@Payload() data: CreateUserDto) {
    return this.authService.createnewUser(data);
  }

  @MessagePattern('login')
  async login(@Payload() loginData: LoginDto) {
    return this.authService.login(loginData);
  }

  @MessagePattern('validate_token')
  async validateToken(@Payload() token: TokenDto) {
    return this.authService.validateToken(token);
  }

  @Get()
  dome() {
    return 'asdf';
  }
}
