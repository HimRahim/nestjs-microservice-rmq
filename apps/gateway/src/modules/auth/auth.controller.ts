import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, Public } from '@apps/shared';
import { LoginDto } from '@apps/shared';
import { Request } from 'express';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Public()
  signup(@Body() data: CreateUserDto) {
    return this.authService.createUser(data);
  }

  @Post('login')
  @Public()
  login(@Body() loginData: LoginDto) {
    return this.authService.login(loginData);
  }

  @Get()
  hello(@Req() req: Request) {
    return 'hello';
  }
}
