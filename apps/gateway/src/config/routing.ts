import { Routes } from '@nestjs/core';
import { AuthModule } from '../modules/auth/auth.module';
import { PostModule } from '../modules/post/post.module';

export const GATEWAY_ROUTES: Routes = [
  {
    path: 'auth',
    module: AuthModule,
  },
  {
    path: 'post',
    module: PostModule,
  },
];
