import { ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomError } from 'src/error/error.interface';
import {
  ERROR_MSG_CONSTANTS,
  ERROR_STATUS_CONSTANTS,
} from 'src/util/constant/error.constant';
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/user.dto';
import { UserEntity } from '../entities/user.entity';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  private logger = new Logger(UserRepository.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userModel: Repository<UserEntity>,
  ) {
    super();
  }

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<UserEntity | CustomError> {
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
        return new CustomError(
          '5583',
          ERROR_STATUS_CONSTANTS.SOMETHING_WENT_WRONG,
          ERROR_MSG_CONSTANTS.SOMETHING_WENT_WRONG_MSG,
        );
      }
    }
  }
  async findUserById(userId: string): Promise<UserEntity | CustomError> {
    try {
      return await this.userModel.findOne({ id: userId });
    } catch (error) {
      this.logger.error(
        `Failed to find user: ${JSON.stringify(userId)} err: ${error}`,
        error.stack,
      );
      return new CustomError(
        '3238',
        ERROR_STATUS_CONSTANTS.SOMETHING_WENT_WRONG,
        ERROR_MSG_CONSTANTS.SOMETHING_WENT_WRONG_MSG,
      );
    }
  }
}
