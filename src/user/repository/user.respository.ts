import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/user.dto';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  private logger = new Logger(UserRepository.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userModel: Repository<UserEntity>,
  ) {
    super();
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { name, email } = createUserDto;
    const userObj = { name, email };
    const user = this.userModel.create(userObj);
    try {
      return await this.userModel.save(user);
    } catch (error) {
      this.logger.error(
        `Failed to create user: ${JSON.stringify(createUserDto)} err: ${error}`,
        error.stack,
      );
      if (error.code === '23505') {
        throw new ConflictException('user already exists!');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
