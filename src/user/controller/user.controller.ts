import { Body, Controller, Logger, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/user.dto';
import { UserEntity } from '../entities/user.entity';

@Controller('user')
export class UserController {
  private logger = new Logger('UserRepository');
  constructor(private userService: UserService) {}

  @Post('/create')
  createUser(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    this.logger.debug(createUserDto);
    return this.userService.createUser(createUserDto);
  }
}
