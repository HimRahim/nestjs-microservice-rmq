import { UserEntity } from 'apps/auth/src/model/entity/user/user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: UserEntity;
    }
  }
}
