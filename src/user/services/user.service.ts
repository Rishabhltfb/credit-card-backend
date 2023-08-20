import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/user.dto';
import { UserRepository } from '../repository/user.respository';
import { UserEntity } from '../entities/user.entity';
import { CustomError } from 'src/error/error.interface';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<UserEntity | CustomError> {
    return this.userRepository.createUser(createUserDto);
  }

  async getUserById(id: string): Promise<UserEntity | CustomError> {
    const user = await this.userRepository.findUserById(id);
    return user;
  }
}
