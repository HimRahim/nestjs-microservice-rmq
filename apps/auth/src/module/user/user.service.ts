import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../model/entity/user/user.entity';
import { AUTH_DATASOURCE } from '../../config/constant';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from '@apps/shared';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity, AUTH_DATASOURCE)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async createnewUser(data: CreateUserDto): Promise<UserEntity> {
    return this.userRepo.save(data);
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepo.find();
  }

  async findOneById(id: number): Promise<UserEntity> {
    return this.userRepo.findOne({
      where: { id: id },
    });
  }

  async findOneByEmail(email: string): Promise<UserEntity> {
    return this.userRepo.findOneBy({ email: email });
  }

  async updateUser(id: number, updateData: UpdateUserDto): Promise<void> {
    await this.userRepo.update({ id: id }, updateData);
    return;
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepo.delete({ id: id });
    return;
  }
}
