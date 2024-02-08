export class TokenDto {
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload {
  sub: number;
  username: string;
  iat?: number;
  exp?: number;
}
