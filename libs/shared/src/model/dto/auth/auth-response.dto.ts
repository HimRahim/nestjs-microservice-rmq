import { UserEntity } from 'apps/auth/src/model/entity/user/user.entity';
import { TokenDto } from './jwt-token.dto';

export interface AuthResDto {
  user?: UserEntity;
  token?: TokenDto;
}
