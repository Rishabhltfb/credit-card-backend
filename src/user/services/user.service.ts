import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/user.dto';
import { UserRepository } from '../repository/user.respository';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.userRepository.createUser(createUserDto);
  }
}
