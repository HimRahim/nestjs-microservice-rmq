import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, LoginDto, TokenDto, TokenPayload } from '@apps/shared';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AuthResDto } from '@apps/shared/model/dto/auth/auth-response.dto';
import { DateTime } from 'luxon';
import {
  ACCESS_TOKEN_DURATION,
  REFRESH_TOKEN_DURATION,
} from '../../config/constant';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.refreshTokenSecret = this.configService.get(
      'JWT_REFRESH_TOKEN_SECRET',
    );
  }

  private readonly refreshTokenSecret: string;

  async createnewUser(data: CreateUserDto): Promise<TokenDto> {
    const existedUser = await this.userService.findOneByEmail(data.email);
    if (existedUser) {
      throw new RpcException(new NotAcceptableException('User already exists'));
    }
    data.password = await this.hashPassword(data.password);
    const newUser = await this.userService.createnewUser(data);

    const payload: TokenPayload = {
      sub: newUser.id,
      username: newUser.username,
    };

    return this.getToken(payload);
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = 10;
    return await bcrypt.hash(password, salt);
  }

  async login(data: LoginDto): Promise<TokenDto> {
    const user = await this.userService.findOneByEmail(data.email);
    if (!user) {
      throw new RpcException(new NotFoundException('Not found email'));
    }

    const isPasswordMatched = await bcrypt.compare(
      data.password,
      user.password,
    );
    if (!isPasswordMatched) {
      throw new RpcException(new NotAcceptableException('Password invalid'));
    }
    return this.getToken({ sub: user.id, username: user.username });
  }

  private async getToken(payload: TokenPayload): Promise<TokenDto> {
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: ACCESS_TOKEN_DURATION,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.refreshTokenSecret,
      expiresIn: REFRESH_TOKEN_DURATION,
    });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async validateToken(token: TokenDto): Promise<AuthResDto> {
    const accessTokenPayload: TokenPayload = this.jwtService.decode(
      token.accessToken,
    );
    let newToken: TokenDto;
    if (this.isTokenExpired(accessTokenPayload)) {
      const refreshTokenPayload: TokenPayload = this.jwtService.decode(
        token.refreshToken,
      );
      if (!this.isTokenExpired(refreshTokenPayload)) {
        newToken = await this.getToken({
          sub: accessTokenPayload.sub,
          username: accessTokenPayload.username,
        });
      } else {
        throw new RpcException(new UnauthorizedException('Token is expired'));
      }
    }
    const user = await this.userService.findOneById(accessTokenPayload.sub);
    if (!user) {
      throw new RpcException(new NotFoundException('User not found'));
    }
    return { user: user, token: newToken };
  }

  private isTokenExpired(token: TokenPayload): boolean {
    return DateTime.fromSeconds(token.exp) < DateTime.now();
  }
}
