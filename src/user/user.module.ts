import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserController } from './controller/user.controller';
import { UserService } from './services/user.service';
import { UserRepository } from './repository/user.respository';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
