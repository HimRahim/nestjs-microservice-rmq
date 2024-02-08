import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { IdDto } from '../common/common';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  email: string;

  @IsString()
  password: string;
}

export class UpdateUserDto extends IntersectionType(
  IdDto,
  PartialType(CreateUserDto),
) {}
