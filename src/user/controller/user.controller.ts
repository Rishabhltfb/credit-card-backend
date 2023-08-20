import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/user.dto';
import { UserEntity } from '../entities/user.entity';
import { CustomError } from 'src/error/error.interface';

@Controller('user')
export class UserController {
  private logger = new Logger(UserController.name);
  constructor(private userService: UserService) {}

  @Post('/create')
  createUser(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    this.logger.debug(createUserDto);
    return this.userService.createUser(createUserDto);
  }

  @Get('/fetch/:id')
  getUserById(@Param('id') id: string): Promise<UserEntity | CustomError> {
    this.logger.debug(id);
    return this.userService.getUserById(id);
  }
}
